import type { PrismaClient } from "@prisma/client";
import type { VideoUpsertInput } from "./videos.schemas.js";

// ---- Reads (used by the Worker's HTTP routes) ----

export async function fetchVideos(
  prisma: PrismaClient,
  sort: "latest" | "trending",
  limit?: number
) {
  if (sort === "trending") {
    const cutoff = new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10);
    return prisma.video.findMany({
      where: { publishedAt: { gte: cutoff } },
      orderBy: { views: "desc" },
      take: limit,
    });
  }

  return prisma.video.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function fetchVideoBySlug(prisma: PrismaClient, slug: string) {
  return prisma.video.findUnique({ where: { slug } });
}

export async function fetchRelatedVideos(
  prisma: PrismaClient,
  video: { id: string; toolCategory: string },
  limit = 4
) {
  const sameCategory = await prisma.video.findMany({
    where: { id: { not: video.id }, toolCategory: video.toolCategory },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  if (sameCategory.length >= limit) return sameCategory;

  const fillers = await prisma.video.findMany({
    where: {
      id: { not: video.id, notIn: sameCategory.map((v: { id: string }) => v.id) },
      toolCategory: { not: video.toolCategory },
    },
    orderBy: { publishedAt: "desc" },
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...fillers];
}

// ---- Writes (used by the standalone crawler, see backend/crawler/ingest.ts) ----
// These replace apps/server/src/store.ts's Supabase calls one-for-one.

export async function getKnownYoutubeIds(prisma: PrismaClient): Promise<Set<string>> {
  const rows = await prisma.video.findMany({ select: { youtubeId: true } });
  return new Set(rows.map((r) => r.youtubeId));
}

export async function upsertVideos(
  prisma: PrismaClient,
  incoming: VideoUpsertInput[]
): Promise<number> {
  if (incoming.length === 0) {
    return prisma.video.count();
  }

  // Each upsert is independent — running them outside a single $transaction
  // avoids Neon's HTTP-driver per-query latency blowing past the default
  // 5s interactive transaction timeout once there are more than a few rows.
  for (const v of incoming) {
    await prisma.video.upsert({
      where: { youtubeId: v.youtubeId },
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
        authorName: v.author.name,
        authorAvatar: v.author.avatar,
        channelId: v.channelId ?? null,
        tags: v.tags,
        accent: v.accent,
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
        authorName: v.author.name,
        authorAvatar: v.author.avatar,
        channelId: v.channelId ?? null,
        tags: v.tags,
        accent: v.accent,
      },
    });
  }

  return prisma.video.count();
}