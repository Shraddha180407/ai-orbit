import type { PrismaClient } from "@prisma/client";
import type { ModelsIngestPayload } from "./models.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class ModelsIngestService {
  static async ingestModels(prisma: PrismaClient, payload: ModelsIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[],
    };

    for (const modelData of payload.models) {
      summary.processed++;

      try {
        await prisma.$transaction(async (tx) => {
          // 1. Upsert provider (Company), if present
          let providerId: string | undefined;

          if (modelData.provider) {
            const company = await tx.company.upsert({
              where: { slug: modelData.provider.slug },
              create: {
                slug: modelData.provider.slug,
                name: modelData.provider.name,
                logoUrl: modelData.provider.logoUrl || null,
              },
              update: {
                name: modelData.provider.name,
                logoUrl: modelData.provider.logoUrl || null,
              },
            });
            providerId = company.id;
          }

          // 2. Check if model already exists
          const existingModel = await tx.aIModel.findUnique({
            where: { slug: modelData.slug },
          });

          if (existingModel) {
            summary.updated++;
          } else {
            summary.created++;
          }

          // 3. Upsert AIModel
          await tx.aIModel.upsert({
            where: { slug: modelData.slug },
            create: {
                    slug: modelData.slug,
                    name: modelData.name,
                    creator: modelData.creator,
                    contextWindow: modelData.contextWindow,
                    parameterSize: modelData.parameterSize,
                    modality: modelData.modality,
                    releaseDate: modelData.releaseDate,
                    description: modelData.description,
                    websiteUrl: modelData.websiteUrl || null,
                    capabilities: modelData.capabilities,
                    apiAvailable: modelData.apiAvailable,
                    documentation: modelData.documentation ?? undefined,
                    promptExamples: modelData.promptExamples,
                    openSource: modelData.openSource,
                    primaryTask: modelData.primaryTask || null,
                    modelType: modelData.modelType || null,
                    providerId: providerId || null,
                  },
          update: {
                  name: modelData.name,
                  creator: modelData.creator,
                  contextWindow: modelData.contextWindow,
                  parameterSize: modelData.parameterSize,
                  modality: modelData.modality,
                  releaseDate: modelData.releaseDate,
                  description: modelData.description,
                  websiteUrl: modelData.websiteUrl || null,
                  capabilities: modelData.capabilities,
                  apiAvailable: modelData.apiAvailable,
                  documentation: modelData.documentation ?? undefined,
                  promptExamples: modelData.promptExamples,
                  openSource: modelData.openSource,
                  primaryTask: modelData.primaryTask || null,
                  modelType: modelData.modelType || null,
                  providerId: providerId || null,
                },
          });
        }, {
          timeout: 10000,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting model ${modelData.slug}:`, err);
        summary.errors.push({
          slug: modelData.slug,
          message,
        });

        if (summary.created > 0 && message.includes("create")) summary.created--;
        if (summary.updated > 0 && !message.includes("create")) summary.updated--;
      }
    }

    return summary;
  }
}