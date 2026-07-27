import type { PrismaClient } from "@prisma/client";
import type { CollectionsIngestPayload } from "./collections.ingest.schema.js";
import { logger } from "../../lib/logger.js";
import { recalculateCollectionToolCount } from "../collections/collections.routes.js";

export class CollectionsIngestService {
  static async ingestCollections(prisma: PrismaClient, payload: CollectionsIngestPayload) {
    const summary = {
      created: 0,
      updated: 0,
      skippedInvalidRefs: [] as { collectionSlug: string; invalidToolIds: string[]; invalidModelIds: string[]; invalidCompanyIds: string[] }[],
      errors: [] as { slug: string; message: string }[]
    };

    for (const colData of payload.collections) {
      try {
        const existingCol = await prisma.collection.findUnique({
          where: { slug: colData.slug },
          select: { id: true }
        });
        const wasExisting = !!existingCol;

        await prisma.$transaction(async (tx) => {
          // Validate existing related IDs
          const validTools = await tx.tool.findMany({
            where: { id: { in: colData.toolIds } },
            select: { id: true }
          });
          const validToolIds = validTools.map(t => t.id);
          const invalidToolIds = colData.toolIds.filter(id => !validToolIds.includes(id));

          const validModels = await tx.aIModel.findMany({
            where: { id: { in: colData.modelIds } },
            select: { id: true }
          });
          const validModelIds = validModels.map(m => m.id);
          const invalidModelIds = colData.modelIds.filter(id => !validModelIds.includes(id));

          const validCompanies = await tx.company.findMany({
            where: { id: { in: colData.companyIds } },
            select: { id: true }
          });
          const validCompanyIds = validCompanies.map(c => c.id);
          const invalidCompanyIds = colData.companyIds.filter(id => !validCompanyIds.includes(id));

          if (invalidToolIds.length > 0 || invalidModelIds.length > 0 || invalidCompanyIds.length > 0) {
            summary.skippedInvalidRefs.push({
              collectionSlug: colData.slug,
              invalidToolIds,
              invalidModelIds,
              invalidCompanyIds
            });
          }

          if (existingCol) {
            // Delete previous associations
            await tx.collectionCategory.deleteMany({ where: { collectionId: existingCol.id } });
            await tx.collectionTool.deleteMany({ where: { collectionId: existingCol.id } });
            await tx.collectionModel.deleteMany({ where: { collectionId: existingCol.id } });
            await tx.collectionCompany.deleteMany({ where: { collectionId: existingCol.id } });
          }

          await tx.collection.upsert({
            where: { slug: colData.slug },
            create: {
              name: colData.name,
              slug: colData.slug,
              description: colData.description || null,
              isFeatured: colData.isFeatured,
              isCurated: colData.isCurated,
              creatorType: colData.creatorType,
              creatorId: colData.creatorId,
              categories: {
                create: colData.categories.map(cat => ({ categoryName: cat }))
              },
              tools: {
                create: validToolIds.map(tId => ({ toolId: tId }))
              },
              relatedModels: {
                create: validModelIds.map(mId => ({ modelId: mId }))
              },
              relatedCompanies: {
                create: validCompanyIds.map(cId => ({ companyId: cId }))
              }
            },
            update: {
              name: colData.name,
              description: colData.description || null,
              isFeatured: colData.isFeatured,
              isCurated: colData.isCurated,
              creatorType: colData.creatorType,
              creatorId: colData.creatorId,
              categories: {
                create: colData.categories.map(cat => ({ categoryName: cat }))
              },
              tools: {
                create: validToolIds.map(tId => ({ toolId: tId }))
              },
              relatedModels: {
                create: validModelIds.map(mId => ({ modelId: mId }))
              },
              relatedCompanies: {
                create: validCompanyIds.map(cId => ({ companyId: cId }))
              }
            }
          });
        }, {
          timeout: 10000
        });

        const insertedCol = await prisma.collection.findUnique({
            where: { slug: colData.slug }
        });
        if (insertedCol) {
            await recalculateCollectionToolCount(prisma, insertedCol.id);
        }

        if (wasExisting) {
          summary.updated++;
        } else {
          summary.created++;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : (typeof err === 'object' ? JSON.stringify(err) : String(err));
        logger.error(`Error ingesting collection ${colData.slug}:`, err);
        summary.errors.push({
          slug: colData.slug,
          message
        });

        // Decrement logic removed, summary is only incremented on success
      }
    }

    return summary;
  }
}