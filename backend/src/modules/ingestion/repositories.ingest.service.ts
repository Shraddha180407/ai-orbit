import type { PrismaClient } from "@prisma/client";
import type { RepositoriesIngestPayload } from "./repositories.ingest.schema.js";
import { resolveSlugCollision } from "../../lib/repository-helpers.js";
import { logger } from "../../lib/logger.js";

export class RepositoriesIngestService {
  static async ingestRepositories(prisma: PrismaClient, payload: RepositoriesIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { githubId: number; message: string }[]
    };

    for (const repoData of payload.repositories) {
      summary.processed++;

      try {
        await prisma.$transaction(async (tx) => {
          // 1. Resolve slug collision (same logic as sync-repositories.ts)
          const slug = await resolveSlugCollision(tx, repoData.slug, repoData.githubId);

          // 2. Check if Repository already exists to determine create vs update
          const existingRepo = await tx.repository.findUnique({
            where: { githubId: repoData.githubId },
          });

          if (existingRepo) {
            summary.updated++;
          } else {
            summary.created++;
          }

          // 3. Upsert Repository
          await tx.repository.upsert({
            where: { githubId: repoData.githubId },
            create: {
              githubId: repoData.githubId,
              slug,
              name: repoData.name,
              owner: repoData.owner,
              ownerAvatarUrl: repoData.ownerAvatarUrl || null,
              description: repoData.description || null,
              url: repoData.url,
              homepage: repoData.homepage || null,
              language: repoData.language || null,
              license: repoData.license || null,
              topics: repoData.topics,
              stars: repoData.stars,
              forks: repoData.forks,
              openIssues: repoData.openIssues,
              defaultBranch: repoData.defaultBranch,
              logoUrl: repoData.logoUrl || null,
              brandColor: repoData.brandColor || null,
              githubCreatedAt: repoData.githubCreatedAt,
              syncedAt: repoData.syncedAt,
            },
            update: {
              slug,
              name: repoData.name,
              owner: repoData.owner,
              ownerAvatarUrl: repoData.ownerAvatarUrl || null,
              description: repoData.description || null,
              url: repoData.url,
              homepage: repoData.homepage || null,
              language: repoData.language || null,
              license: repoData.license || null,
              topics: repoData.topics,
              stars: repoData.stars,
              forks: repoData.forks,
              openIssues: repoData.openIssues,
              defaultBranch: repoData.defaultBranch,
              logoUrl: repoData.logoUrl || null,
              brandColor: repoData.brandColor || null,
              githubCreatedAt: repoData.githubCreatedAt,
              syncedAt: repoData.syncedAt,
            },
          });
        }, {
          timeout: 10000,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting repository githubId=${repoData.githubId}:`, err);
        summary.errors.push({
          githubId: repoData.githubId,
          message,
        });

        // Adjust counts since it failed
        if (summary.created > 0 && message.includes('create')) summary.created--;
        if (summary.updated > 0 && !message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
