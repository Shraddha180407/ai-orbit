import type { PrismaClient } from "@prisma/client";
import type { ModelsIngestPayload } from "./models.ingest.schema.js";
import { logger } from "../../lib/logger.js";

/**
 * Maximum number of models to process within a single Prisma transaction.
 * Kept small enough that each chunk completes well within Cloudflare Worker
 * CPU and wall-clock limits, while large enough to amortise per-transaction
 * connection overhead against Neon's serverless pool.
 *
 * NOTE: This now uses Prisma's *sequential array* transaction API
 * (`prisma.$transaction([...])`) instead of the *interactive* callback API
 * (`prisma.$transaction(async (tx) => ...)`). The interactive form requires
 * a persistent DB connection/session (only available via the `pg.Pool` /
 * `PrismaPg` adapter — i.e. `getPrismaTx`), which leaks TCP connections to
 * Neon across Cloudflare Worker isolate recycles and eventually exhausts
 * Neon's connection limit (this was the root cause of ingestion failing
 * after ~90-100 models). The array form works over Neon's stateless HTTP
 * adapter (`getPrisma`), so no persistent connection is ever held.
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

      const chunkModels = chunk.filter(
        (m) => !m.provider || !failedProviders.has(m.provider.slug),
      );

      if (chunkModels.length === 0) continue;

      const chunkSlugs = chunkModels.map((m) => m.slug);

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

        summary.processed += chunkModels.length;
        for (const modelData of chunkModels) {
          summary.errors.push({ slug: modelData.slug, message });
        }
        continue;
      }

      // Build the list of upsert operations for this chunk. Nothing is
      // executed yet — these are unresolved Prisma "promises" that
      // `$transaction([...])` will batch into a single request over the
      // Neon HTTP adapter.
      const ops = chunkModels.map((modelData) => {
        const providerId = modelData.provider
          ? providerIdMap.get(modelData.provider.slug) ?? null
          : null;

        return prisma.aIModel.upsert({
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
      });

      let chunkCreated = 0;
      let chunkUpdated = 0;
      for (const modelData of chunkModels) {
        if (existingSlugs.has(modelData.slug)) {
          chunkUpdated++;
        } else {
          chunkCreated++;
        }
      }

      try {
        await prisma.$transaction(ops);

        summary.processed += chunkModels.length;
        summary.created += chunkCreated;
        summary.updated += chunkUpdated;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(
          `Error ingesting model batch starting at index ${i}:`,
          err,
        );

        summary.processed += chunkModels.length;
        for (const modelData of chunkModels) {
          summary.errors.push({ slug: modelData.slug, message });
        }
      }
    }

    return summary;
  }
}
