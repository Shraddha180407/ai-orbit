import type { PrismaClient } from "@prisma/client";
import type { ModelsIngestPayload } from "./models.ingest.schema.js";
import { logger } from "../../lib/logger.js";

/**
 * Maximum number of models to process within a single Prisma transaction.
 * Kept small enough that each chunk completes well within Cloudflare Worker
 * CPU and wall-clock limits, while large enough to amortise per-transaction
 * connection overhead against Neon's serverless pool.
 *
 * Each model inside a chunk requires 1 upsert (AIModel) = 1 query.
 * Providers are pre-upserted outside the transaction.
 * At chunk size 50 that is ~50 queries per transaction — comfortably under
 * the 10 s Prisma timeout.
 */
const CHUNK_SIZE = 50;

export class ModelsIngestService {
  static async ingestModels(prisma: PrismaClient, payload: ModelsIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[],
    };

    if (payload.models.length === 0) return summary;

    // ── 1. Pre-upsert all unique providers outside a transaction ───────────
    // This collapses N company upserts (many models share the same provider)
    // into one upsert per unique provider slug, without paying per-model
    // transaction overhead.
    const uniqueProviders = new Map<
      string,
      { slug: string; name: string; logoUrl: string | null }
    >();
    for (const m of payload.models) {
      if (m.provider && !uniqueProviders.has(m.provider.slug)) {
        uniqueProviders.set(m.provider.slug, {
          slug: m.provider.slug,
          name: m.provider.name,
          logoUrl: m.provider.logoUrl || null,
        });
      }
    }

    const providerIdMap = new Map<string, string>(); // slug → company id
    const failedProviders = new Set<string>();
    for (const prov of uniqueProviders.values()) {
      try {
        const company = await prisma.company.upsert({
          where: { slug: prov.slug },
          create: { slug: prov.slug, name: prov.name, logoUrl: prov.logoUrl },
          update: { name: prov.name, logoUrl: prov.logoUrl },
        });
        providerIdMap.set(prov.slug, company.id);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error upserting provider ${prov.slug}:`, err);
        failedProviders.add(prov.slug);

        // Record every model that references this failed provider so the
        // caller sees them in the error list.  These models are NOT counted
        // in processed/created/updated — they were never attempted.
        for (const m of payload.models) {
          if (m.provider?.slug === prov.slug) {
            summary.errors.push({
              slug: m.slug,
              message: `Provider upsert failed (${prov.slug}): ${message}`,
            });
          }
        }
      }
    }

    // ── 2. Process models in bounded chunks, one transaction each ───────────
    for (let i = 0; i < payload.models.length; i += CHUNK_SIZE) {
      const chunk = payload.models.slice(i, i + CHUNK_SIZE);

      // Skip models whose provider failed — they were already recorded
      // as errors above.
      const chunkModels = chunk.filter(
        (m) => !m.provider || !failedProviders.has(m.provider.slug),
      );

      if (chunkModels.length === 0) continue;

      const chunkSlugs = chunkModels.map((m) => m.slug);

      // Single query to find which models in this chunk already exist.
      // Replaces the old per-model findUnique — saves N-1 round-trips.
      let existingSlugs: Set<string>;
      try {
        const rows = await prisma.aIModel.findMany({
          where: { slug: { in: chunkSlugs } },
          select: { slug: true },
        });
        existingSlugs = new Set(rows.map((r) => r.slug));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("Error querying existing models for chunk:", err);

        // Cannot determine create/update split — fail the entire chunk
        // so counts stay accurate.
        summary.processed += chunkModels.length;
        for (const modelData of chunkModels) {
          summary.errors.push({ slug: modelData.slug, message });
        }
        continue;
      }

      // Track counts locally; only commit to summary on transaction success.
      let chunkCreated = 0;
      let chunkUpdated = 0;

      try {
        await prisma.$transaction(
          async (tx) => {
            for (const modelData of chunkModels) {
              const providerId = modelData.provider
                ? providerIdMap.get(modelData.provider.slug) ?? null
                : null;

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
                  providerId,
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
                  providerId,
                },
              });

              if (existingSlugs.has(modelData.slug)) {
                chunkUpdated++;
              } else {
                chunkCreated++;
              }
            }
          },
          { timeout: 10000 },
        );

        // Transaction succeeded — all models in chunk were persisted.
        summary.processed += chunkModels.length;
        summary.created += chunkCreated;
        summary.updated += chunkUpdated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(
          `Error ingesting model batch starting at index ${i}:`,
          err,
        );

        // Transaction rolled back — record every model in the chunk as an
        // error.  processed increments (attempt count), but created/updated
        // are NOT incremented because nothing was actually persisted.
        summary.processed += chunkModels.length;
        for (const modelData of chunkModels) {
          summary.errors.push({ slug: modelData.slug, message });
        }
      }
    }

    return summary;
  }
}
