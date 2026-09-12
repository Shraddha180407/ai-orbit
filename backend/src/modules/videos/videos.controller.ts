import type { Context } from "hono";
import { PrismaClient } from "@prisma/client";
import type { Video } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import {
  fetchVideos,
  fetchVideosWithCount,
  fetchVideoBySlug,
  fetchRelatedVideos,
  countVideos,
} from "./videos.services.js";
import { logger } from "../../lib/logger.js";
import {
  ListQuerySchema,
  CountQuerySchema,
  SlugParamSchema,
  RelatedQuerySchema,
} from "./videos.schemas.js";

function getPrisma(c: Context) {
  const adapter = new PrismaNeon({ connectionString: c.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Prisma stores authorName/authorAvatar as flat columns, but the frontend
// (ported as-is from Video_section) expects a nested `author: {name, avatar}`
// object. Reshape at the API boundary so frontend components stay untouched.
function toApiShape(video: Video | null) {
  if (!video) return video;
  const { authorName, authorAvatar, ...rest } = video;
  return { ...rest, author: { name: authorName, avatar: authorAvatar } };
}

const inMemoryCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = inMemoryCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data as T;
  }
  if (entry) inMemoryCache.delete(key);
  return null;
}

function setCache(key: string, data: any, ttl = CACHE_TTL_MS) {
  inMemoryCache.set(key, { data, expiresAt: Date.now() + ttl });
}

// GET /api/videos?sort=latest|trending&limit=N&offset=N&category=slug&sortBy=name|duration|posted|views&sortDir=asc|desc
export async function listVideos(c: Context) {
  const cacheKey = `videos_list_${c.req.url}`;
  const cached = getCached(cacheKey);
  c.header("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  if (cached) {
    return c.json(cached);
  }

  const prisma = getPrisma(c);
  try {
    const result = ListQuerySchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters", details: result.error.format() }, 400);
    }

    const { sort, limit, offset, category, sortBy, sortDir, withCount } = result.data;

    if (withCount) {
      const { videos: rawVideos, total } = await fetchVideosWithCount(
        prisma,
        sort,
        limit,
        offset,
        category,
        sortBy,
        sortDir
      );
      const videos = rawVideos.map(toApiShape);
      const data = { videos, total };
      setCache(cacheKey, data);
      return c.json(data);
    }

    const rawVideos = await fetchVideos(prisma, sort, limit, offset, category, sortBy, sortDir);
    const videos = rawVideos.map(toApiShape);
    setCache(cacheKey, videos);
    return c.json(videos);
  } catch (error: unknown) {
    logger.error("Videos API Controller Error:", error);
    return c.json({ error: "Internal server error.", message: error instanceof Error ? error.message : "Unknown error" }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

// GET /api/videos/count?category=slug
export async function getVideosCount(c: Context) {
  const cacheKey = `videos_count_${c.req.url}`;
  const cached = getCached(cacheKey);
  c.header("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  if (cached) {
    return c.json(cached);
  }

  const prisma = getPrisma(c);
  try {
    const result = CountQuerySchema.safeParse(c.req.query());
    if (!result.success) {
      return c.json({ error: "Invalid query parameters", details: result.error.format() }, 400);
    }

    const total = await countVideos(prisma, result.data.category);
    const data = { total };
    setCache(cacheKey, data);
    return c.json(data);
  } catch (error: unknown) {
    logger.error("Videos API Controller Error:", error);
    return c.json({ error: "Internal server error.", message: error instanceof Error ? error.message : "Unknown error" }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

// GET /api/videos/:slug
export async function getVideoBySlug(c: Context) {
  const slug = c.req.param("slug");
  const cacheKey = `videos_slug_${slug}`;
  const cached = getCached(cacheKey);
  c.header("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
  if (cached) {
    return c.json(cached);
  }

  const prisma = getPrisma(c);
  try {
    const parsed = SlugParamSchema.safeParse({ slug });
    if (!parsed.success) {
      return c.json({ error: "Invalid slug" }, 400);
    }

    const video = await fetchVideoBySlug(prisma, parsed.data.slug);
    if (!video) return c.json({ error: "Not found" }, 404);

    const shaped = toApiShape(video);
    setCache(cacheKey, shaped);
    return c.json(shaped);
  } catch (error: unknown) {
    logger.error("Videos API Controller Error:", error);
    return c.json({ error: "Internal server error.", message: error instanceof Error ? error.message : "Unknown error" }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

// GET /api/videos/:slug/related?limit=N
export async function getRelatedVideos(c: Context) {
  const prisma = getPrisma(c);
  try {
    const slugParsed = SlugParamSchema.safeParse({ slug: c.req.param("slug") });
    if (!slugParsed.success) {
      return c.json({ error: "Invalid slug" }, 400);
    }

    const queryParsed = RelatedQuerySchema.safeParse(c.req.query());
    if (!queryParsed.success) {
      return c.json({ error: "Invalid query parameters", details: queryParsed.error.format() }, 400);
    }

    const video = await fetchVideoBySlug(prisma, slugParsed.data.slug);
    if (!video) return c.json({ error: "Not found" }, 404);

    const related = await fetchRelatedVideos(prisma, video, queryParsed.data.limit);
    return c.json(related.map(toApiShape));
  } catch (error: unknown) {
    logger.error("Videos API Controller Error:", error);
    return c.json({ error: "Internal server error.", message: error instanceof Error ? error.message : "Unknown error" }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}