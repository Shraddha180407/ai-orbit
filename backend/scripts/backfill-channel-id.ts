import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { logger } from "../src/lib/logger.js";

interface YouTubeVideosResponse {
  items?: Array<{
    id: string;
    snippet?: {
      channelId?: string;
    };
  }>;
}

/**
 * One-off backfill: the normal ingest pipeline (crawler/ingest.ts) only
 * enriches videos that are NOT already known (see the `newIds` filter in
 * ingest.ts), so existing rows never get re-enriched and their channelId
 * stays null forever. This script re-fetches metadata directly for every
 * row currently missing channelId and updates just that column.
 *
 * Usage: npx tsx scripts/backfill-channel-id.ts
 */

const API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

async function fetchChannelIds(youtubeIds: string[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const batches: string[][] = [];
  for (let i = 0; i < youtubeIds.length; i += 50) {
    batches.push(youtubeIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    const url = `${API_BASE}/videos?part=snippet&id=${batch.join(",")}&key=${apiKey()}`;
    const res = await fetch(url);
    if (!res.ok) {
      logger.error(`[backfill] videos.list failed: ${res.status}`);
      continue;
    }
    const json = (await res.json()) as YouTubeVideosResponse;
    for (const item of json.items ?? []) {
      if (item.snippet?.channelId) {
        result.set(item.id, item.snippet.channelId);
      }
    }
  }

  return result;
}

async function main() {
  const prisma = getPrisma();

  const rows = await prisma.video.findMany({
    where: { channelId: null },
    select: { id: true, youtubeId: true },
  });

  logger.info(`[backfill] ${rows.length} video(s) missing channelId.`);
  if (rows.length === 0) {
    await prisma.$disconnect();
    return;
  }

  const channelIds = await fetchChannelIds(rows.map((r) => r.youtubeId));
  logger.info(`[backfill] resolved channelId for ${channelIds.size}/${rows.length} video(s).`);

  let updated = 0;
  for (const row of rows) {
    const channelId = channelIds.get(row.youtubeId);
    if (!channelId) continue; // video deleted/private on YouTube since ingest — skip, leave null
    await prisma.video.update({
      where: { id: row.id },
      data: { channelId },
    });
    updated++;
  }

  logger.info(`[backfill] done. Updated ${updated} row(s).`);
  await prisma.$disconnect();
}

main().catch((err) => {
  logger.error("[backfill] failed:", err);
  process.exit(1);
});