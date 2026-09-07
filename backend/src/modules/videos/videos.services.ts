import type { PrismaClient, Prisma } from "@prisma/client";
import type { VideoUpsertInput } from "./videos.schemas.js";

const TOOL_CATEGORIES = [
  "multimodal-ai",
  "robotics",
  "agents",
  "llm",
  "general-ai",
] as const;

type ToolCategory = (typeof TOOL_CATEGORIES)[number];
type SortBy = "name" | "duration" | "posted" | "views";
type SortDir = "asc" | "desc";

function isToolCategory(value: string): value is ToolCategory {
  return (TOOL_CATEGORIES as readonly string[]).includes(value);
}

function categoryWhere(category?: string): Prisma.VideoWhereInput {
  if (!category) return {};

  const or: Prisma.VideoWhereInput[] = [
    { tags: { has: category } },
  ];

  if (isToolCategory(category)) {
    or.push({ toolCategory: category });
  }

  return { OR: or };
}

const AVAILABLE_ONLY: Prisma.VideoWhereInput = {
  available: true,
};

const SORT_FIELD: Record<
  SortBy,
  keyof Prisma.VideoOrderByWithRelationInput
> = {
  name: "title",
  duration: "durationSeconds",
  posted: "publishedAt",
  views: "views",
};

function orderByFor(
  sortBy?: SortBy,
  sortDir?: SortDir
): Prisma.VideoOrderByWithRelationInput {
  if (!sortBy) {
    return { publishedAt: "desc" };
  }

  return {
    [SORT_FIELD[sortBy]]: sortDir ?? "desc",
  };
}

// ---- Reads ----

export async function fetchVideos(
  prisma: PrismaClient,
  sort: "latest" | "trending",
  limit?: number,
  offset?: number,
  category?: string,
  sortBy?: SortBy,
  sortDir?: SortDir
) {
  const where: Prisma.VideoWhereInput = {
    ...categoryWhere(category),
    ...AVAILABLE_ONLY,
  };

  if (sort === "trending") {
    const cutoff = new Date(
      Date.now() - 60 * 86400000
    ).toISOString().slice(0, 10);

    return prisma.video.findMany({
      where: {
        ...where,
        publishedAt: { gte: cutoff },
      },
      orderBy: sortBy
        ? orderByFor(sortBy, sortDir)
        : { views: "desc" },
      take: limit,
      skip: offset,
    });
  }

  return prisma.video.findMany({
    where,
    orderBy: orderByFor(sortBy, sortDir),
    take: limit,
    skip: offset,
  });
}

export async function countVideos(
  prisma: PrismaClient,
  category?: string
) {
  return prisma.video.count({
    where: {
      ...categoryWhere(category),
      ...AVAILABLE_ONLY,
    },
  });
}

export async function fetchVideoBySlug(
  prisma: PrismaClient,
  slug: string
) {
  return prisma.video.findUnique({
    where: { slug },
  });
}

// ---- Related videos ----

export async function fetchRelatedVideos(
  prisma: PrismaClient,
  video: {
    id: string;
    toolCategory: string;
    tags?: string[];
  },
  limit = 4
) {
  const sameCategory = await prisma.video.findMany({
    where: {
      available: true,
      id: { not: video.id },
      toolCategory: video.toolCategory,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
  });

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  const fillers = await prisma.video.findMany({
    where: {
      available: true,
      id: {
        not: video.id,
        notIn: sameCategory.map((v) => v.id),
      },
      ...(video.tags && video.tags.length > 0
        ? {
            tags: {
              hasSome: video.tags,
            },
          }
        : {}),
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...fillers];
}

// ---- Writes ----

export async function getKnownYoutubeIds(
  prisma: PrismaClient
): Promise<Set<string>> {
  const rows = await prisma.video.findMany({
    select: { youtubeId: true },
  });

  return new Set(rows.map((r) => r.youtubeId));
}

export async function checkVideoAvailability(
  youtubeId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${youtubeId}`
      )}&format=json`
    );

    return res.ok;
  } catch {
    // Don't permanently hide a video because of a temporary
    // network failure during ingestion.
    return true;
  }
}

export async function upsertVideos(
  prisma: PrismaClient,
  incoming: VideoUpsertInput[]
): Promise<number> {
  if (incoming.length === 0) {
    return prisma.video.count();
  }

  for (const v of incoming) {
    const available = await checkVideoAvailability(v.youtubeId);

    await prisma.video.upsert({
      where: {
        youtubeId: v.youtubeId,
      },

      update: {
        title: v.title,
        description: v.description,
        toolName: v.toolName,
        toolCategory: v.toolCategory,
        thumbnail: v.thumbnail,
        durationSeconds: v.durationSeconds,
        views: v.views,
        likes: v.likes,
        publishedAt: v.publishedAt,

        // Keep the crawler/schema contract nested.
        authorName: v.author.name,
        authorAvatar: v.author.avatar,

        channelId: v.channelId ?? null,
        tags: v.tags,
        accent: v.accent,
        available,
      },

      create: {
        slug: v.slug,
        title: v.title,
        description: v.description,
        toolName: v.toolName,
        toolCategory: v.toolCategory,
        youtubeId: v.youtubeId,
        thumbnail: v.thumbnail,
        durationSeconds: v.durationSeconds,
        views: v.views,
        likes: v.likes,
        publishedAt: v.publishedAt,

        // Keep the crawler/schema contract nested.
        authorName: v.author.name,
        authorAvatar: v.author.avatar,

        channelId: v.channelId ?? null,
        tags: v.tags,
        accent: v.accent,
        available,
      },
    });
  }

  return prisma.video.count();
}