import { pathToFileURL } from "node:url";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { discoverVideos } from "./youtube-search.js";
import { enrichVideos } from "./youtube-enrich.js";
import { getKnownYoutubeIds, upsertVideos } from "../src/modules/videos/videos.services.js";
import { notifyIngestFailure, notifyIngestSuspicious } from "./alerts.js";
import { logger } from "./logger.js";

/**
 * Runs as a standalone Node script OUTSIDE the Cloudflare Worker — the
 * discover -> enrich chain makes many sequential external API calls and
 * doesn't fit Workers' execution time limits. Schedule this via GitHub
 * Actions cron (or similar), not a Workers Cron Trigger.
 *
 * LLM classification (relevance-gate.ts) is parked for now — free-tier
 * rate limits on Gemini/Groq made iteration painful. Relevance + category
 * are both handled locally via keyword matching in categorize.ts instead.
 * Nothing here needs to change to bring the LLM gate back later — just
 * swap this file for the gate-based version again once you've got a paid
 * key or are OK with it running as a slow background job instead of
 * something you test interactively.
 */

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export async function runIngest() {
  const prisma = getPrisma();
  try {
    // 1. Discovery: open crawl across all of YouTube via keyword search —
    //    no channel whitelist involved. Query set may be rotated per run,
    //    see YOUTUBE_SEARCH_QUERY_BATCH_SIZE in youtube-search.ts.
    const discovered = await discoverVideos();

    const known = await getKnownYoutubeIds(prisma);
    const newIds = discovered.map((d) => d.videoId).filter((id) => !known.has(id));

    if (newIds.length === 0) {
      const result = { discovered: discovered.length, new: 0, total: known.size };
      await notifyIngestSuspicious(result);
      return result;
    }

    // 2. Enrichment: full metadata + local keyword categorization/relevance
    //    filtering (see categorize.ts) — no LLM call, no rate limits.
    const enriched = await enrichVideos(newIds);

    // 3. Storage
    const total = await upsertVideos(prisma, enriched);

    const result = { discovered: discovered.length, new: enriched.length, total };
    await notifyIngestSuspicious(result);
    return result;
  } catch (err) {
    await notifyIngestFailure(err);
    throw err;
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  runIngest()
    .then((result) => {
      logger.info("[ingest] done:", result);
      process.exit(0);
    })
    .catch((err) => {
      logger.error("[ingest] failed:", err);
      process.exit(1);
    });
}
