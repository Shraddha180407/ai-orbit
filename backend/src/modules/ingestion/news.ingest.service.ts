import type { PrismaClient } from "@prisma/client";
import type { NewsIngestPayload } from "./news.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class NewsIngestService {
  static async ingestNews(prisma: PrismaClient, payload: NewsIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[]
    };

    for (const newsData of payload.news) {
      summary.processed++;
      
      try {
        await prisma.$transaction(async (tx) => {
          // 1. Upsert Publisher by domain
          const publisher = await tx.publisher.upsert({
            where: { domain: newsData.publisher.domain },
            create: {
              name: newsData.publisher.name,
              domain: newsData.publisher.domain,
              website: newsData.publisher.website,
              logoUrl: newsData.publisher.logoUrl || null,
              faviconUrl: newsData.publisher.faviconUrl || null,
              colorHex: newsData.publisher.colorHex || null,
              followersLabel: newsData.publisher.followersLabel || null,
              credibilityScore: newsData.publisher.credibilityScore,
            },
            update: {
              name: newsData.publisher.name,
              website: newsData.publisher.website,
              logoUrl: newsData.publisher.logoUrl || null,
              faviconUrl: newsData.publisher.faviconUrl || null,
              colorHex: newsData.publisher.colorHex || null,
              followersLabel: newsData.publisher.followersLabel || null,
              credibilityScore: newsData.publisher.credibilityScore,
            }
          });

          // 2. Upsert Topics
          const topicIds: string[] = [];
          for (const t of newsData.topics) {
            const topic = await tx.topic.upsert({
              where: { name: t.name },
              create: { name: t.name },
              update: {} // No other fields to update on topic
            });
            topicIds.push(topic.id);
          }

          // 3. Check if News already exists to determine if it's create or update for summary
          const existingNews = await tx.news.findUnique({
            where: { slug: newsData.slug }
          });
          
          if (existingNews) {
            summary.updated++;
          } else {
            summary.created++;
          }

          // 4. Upsert News and reconnect relations
          await tx.news.upsert({
            where: { slug: newsData.slug },
            create: {
              slug: newsData.slug,
              title: newsData.title,
              dek: newsData.dek,
              aiSummary: newsData.aiSummary,
              articleUrl: newsData.articleUrl,
              category: newsData.category,
              filterTags: newsData.filterTags,
              publishedAt: newsData.publishedAt,
              publisherId: publisher.id,
              topics: {
                connect: topicIds.map(tId => ({ id: tId }))
              }
            },
            update: {
              title: newsData.title,
              dek: newsData.dek,
              aiSummary: newsData.aiSummary,
              articleUrl: newsData.articleUrl,
              category: newsData.category,
              filterTags: newsData.filterTags,
              publishedAt: newsData.publishedAt,
              publisherId: publisher.id,
              topics: {
                set: topicIds.map(tId => ({ id: tId }))
              }
            }
          });
        }, {
          // Increase timeout for large payloads
          timeout: 10000 
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting news ${newsData.slug}:`, err);
        summary.errors.push({
          slug: newsData.slug,
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
