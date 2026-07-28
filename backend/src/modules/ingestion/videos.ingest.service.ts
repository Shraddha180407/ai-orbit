import type { PrismaClient } from "@prisma/client";
import type { VideosIngestPayload } from "./videos.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class VideosIngestService {
  static async ingestVideos(prisma: PrismaClient, payload: VideosIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { youtubeId: string; message: string }[]
    };

    for (const videoData of payload.videos) {
      summary.processed++;
      
      try {
        await prisma.$transaction(async (tx) => {
          // 1. Check if Video already exists to determine if it's create or update for summary
          // youtubeId is used as the unique identifier for upserts
          const existingVideo = await tx.video.findUnique({
            where: { youtubeId: videoData.youtubeId }
          });
          
          if (existingVideo) {
            summary.updated++;
          } else {
            summary.created++;
          }

          // 2. Upsert Video
          await tx.video.upsert({
            where: { youtubeId: videoData.youtubeId },
            create: {
              slug: videoData.slug,
              title: videoData.title,
              description: videoData.description,
              toolName: videoData.toolName,
              toolCategory: videoData.toolCategory,
              youtubeId: videoData.youtubeId,
              thumbnail: videoData.thumbnail,
              durationSeconds: videoData.durationSeconds,
              views: videoData.views,
              likes: videoData.likes,
              publishedAt: videoData.publishedAt,
              authorName: videoData.author.name,
              authorAvatar: videoData.author.avatar,
              channelId: videoData.channelId ?? null,
              tags: videoData.tags,
              accent: videoData.accent,
            },
            update: {
              title: videoData.title,
              description: videoData.description,
              toolName: videoData.toolName,
              toolCategory: videoData.toolCategory,
              thumbnail: videoData.thumbnail,
              durationSeconds: videoData.durationSeconds,
              views: videoData.views,
              likes: videoData.likes,
              publishedAt: videoData.publishedAt,
              authorName: videoData.author.name,
              authorAvatar: videoData.author.avatar,
              channelId: videoData.channelId ?? null,
              tags: videoData.tags,
              accent: videoData.accent,
            }
          });
        }, {
          // Increase timeout for large payloads
          timeout: 10000 
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting video ${videoData.youtubeId}:`, err);
        summary.errors.push({
          youtubeId: videoData.youtubeId,
          message
        });
        
        // Adjust counts since it failed
        if (summary.created > 0 && message.includes('create')) summary.created--;
        if (summary.updated > 0 && !message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
