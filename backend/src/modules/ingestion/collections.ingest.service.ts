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
        // Validate creatorId exists before starting transaction
        const creator = await prisma.user.findUnique({
          where: { id: colData.creatorId },
          select: { id: true }
        });
        if (!creator) {
          summary.errors.push({
            slug: colData.slug,
            message: `creatorId ${colData.creatorId} does not exist`
          });
          continue;
        }

        const existingCol = await prisma.collection.findUnique({
          where: { slug: colData.slug },
          select: { id: true }
        });
        const wasExisting = !!existingCol;

        await prisma.$transaction(async (tx) => {
          let validToolIds: string[] | undefined = undefined;
          let invalidToolIds: string[] = [];
          if (colData.toolIds !== undefined) {
            const validTools = await tx.tool.findMany({
              where: { id: { in: colData.toolIds } },
              select: { id: true }
            });
            validToolIds = validTools.map(t => t.id);
            invalidToolIds = colData.toolIds.filter(id => !validToolIds!.includes(id));
          }

          let validModelIds: string[] | undefined = undefined;
          let invalidModelIds: string[] = [];
          if (colData.modelIds !== undefined) {
            const validModels = await tx.aIModel.findMany({
              where: { id: { in: colData.modelIds } },
              select: { id: true }
            });
            validModelIds = validModels.map(m => m.id);
            invalidModelIds = colData.modelIds.filter(id => !validModelIds!.includes(id));
          }

          let validCompanyIds: string[] | undefined = undefined;
          let invalidCompanyIds: string[] = [];
          if (colData.companyIds !== undefined) {
            const validCompanies = await tx.company.findMany({
              where: { id: { in: colData.companyIds } },
              select: { id: true }
            });
            validCompanyIds = validCompanies.map(c => c.id);
            invalidCompanyIds = colData.companyIds.filter(id => !validCompanyIds!.includes(id));
          }

          if (invalidToolIds.length > 0 || invalidModelIds.length > 0 || invalidCompanyIds.length > 0) {
            summary.skippedInvalidRefs.push({
              collectionSlug: colData.slug,
              invalidToolIds,
              invalidModelIds,
              invalidCompanyIds
            });
          }

          if (existingCol) {
            // Delete previous associations ONLY if field is provided
            if (colData.categories !== undefined) {
              await tx.collectionCategory.deleteMany({ where: { collectionId: existingCol.id } });
            }
            if (colData.toolIds !== undefined) {
              await tx.collectionTool.deleteMany({ where: { collectionId: existingCol.id } });
            }
            if (colData.modelIds !== undefined) {
              await tx.collectionModel.deleteMany({ where: { collectionId: existingCol.id } });
            }
            if (colData.companyIds !== undefined) {
              await tx.collectionCompany.deleteMany({ where: { collectionId: existingCol.id } });
            }
          }

          const categoriesData = colData.categories !== undefined ? {
            create: colData.categories.map(cat => ({ categoryName: cat }))
          } : undefined;

          const toolsData = validToolIds !== undefined ? {
            create: validToolIds.map(tId => ({ toolId: tId }))
          } : undefined;

          const modelsData = validModelIds !== undefined ? {
            create: validModelIds.map(mId => ({ modelId: mId }))
          } : undefined;

          const companiesData = validCompanyIds !== undefined ? {
            create: validCompanyIds.map(cId => ({ companyId: cId }))
          } : undefined;

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
              ...(categoriesData && { categories: categoriesData }),
              ...(toolsData && { tools: toolsData }),
              ...(modelsData && { relatedModels: modelsData }),
              ...(companiesData && { relatedCompanies: companiesData })
            },
            update: {
              name: colData.name,
              description: colData.description || null,
              isFeatured: colData.isFeatured,
              isCurated: colData.isCurated,
              creatorType: colData.creatorType,
              creatorId: colData.creatorId,
              ...(categoriesData && { categories: categoriesData }),
              ...(toolsData && { tools: toolsData }),
              ...(modelsData && { relatedModels: modelsData }),
              ...(companiesData && { relatedCompanies: companiesData })
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
        const message = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err));
        logger.error(`Error ingesting collection ${colData.slug}:`, err);
        summary.errors.push({
          slug: colData.slug,
          message
        });
      }
    }

    return summary;
  }
}