/**
 * One-time backfill: checks every existing video's YouTube availability via
 * oEmbed and sets `available` accordingly. New videos going forward get
 * this set correctly at ingest time (see checkVideoAvailability in
 * videos.services.ts) — this script is only needed once, for the rows
 * that predate the `available` column.
 *
 * Run with: npx tsx backend/scripts/backfill-video-availability.ts
 *
 * Unlike `npx prisma migrate ...`, which has its own built-in .env loading,
 * running a script directly via tsx does not — so this explicitly loads
 * .env itself. Requires the `dotenv` package (already a dependency in most
 * Node backends; if this import fails, run `npm install dotenv` first).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { checkVideoAvailability } from "../src/modules/videos/videos.services.js";

const BATCH_SIZE = 20; // concurrent oEmbed checks at a time — stay polite to YouTube
const DELAY_MS = 500; // pause between batches

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set — check your .env is loaded before running this script.");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = getPrisma();

  const videos = await prisma.video.findMany({
    select: { id: true, youtubeId: true, title: true },
  });

  console.log(`Checking availability for ${videos.length} videos...`);

  let checked = 0;
  let markedUnavailable = 0;

  for (let i = 0; i < videos.length; i += BATCH_SIZE) {
    const batch = videos.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (v) => ({
        id: v.id,
        title: v.title,
        available: await checkVideoAvailability(v.youtubeId),
      }))
    );

    for (const r of results) {
      checked++;
      if (!r.available) {
        markedUnavailable++;
        console.log(`  unavailable: ${r.title}`);
        await prisma.video.update({
          where: { id: r.id },
          data: { available: false },
        });
      }
    }

    console.log(`Progress: ${checked}/${videos.length} (${markedUnavailable} unavailable so far)`);
    await sleep(DELAY_MS);
  }

  console.log(`Done. ${markedUnavailable} of ${videos.length} videos marked unavailable.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
