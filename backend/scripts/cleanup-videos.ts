import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { MIN_DURATION_SECONDS, isLikelyEnglish } from "../crawler/youtube-enrich.js";

/**
 * One-off cleanup: youtube-enrich.ts's duration/language filters only apply
 * to newly discovered videos (see ingest.ts's newIds filter) — rows already
 * in the DB from before this change were never re-evaluated. This deletes
 * existing rows that violate the same rules.
 *
 * Note: we don't have defaultAudioLanguage/defaultLanguage stored for
 * existing rows (never persisted), so language here falls back to the
 * title/description script heuristic only — same as youtube-enrich.ts does
 * when YouTube doesn't report a declared language.
 *
 * Usage: npx tsx scripts/cleanup-videos.ts        (dry run, lists only)
 *        npx tsx scripts/cleanup-videos.ts --delete  (actually deletes)
 */

function getPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

async function main() {
  const shouldDelete = process.argv.includes("--delete");
  const prisma = getPrisma();

  const rows = await prisma.video.findMany({
    select: { id: true, title: true, description: true, durationSeconds: true },
  });

  const toDelete = rows.filter((v) => {
    const tooShort = v.durationSeconds > 0 && v.durationSeconds < MIN_DURATION_SECONDS;
    const notEnglish = !isLikelyEnglish(v.title, v.description ?? "");
    return tooShort || notEnglish;
  });

  console.log(`[cleanup] ${rows.length} total video(s). ${toDelete.length} violate the rules:`);
  for (const v of toDelete) {
    const tooShort = v.durationSeconds > 0 && v.durationSeconds < MIN_DURATION_SECONDS;
    const notEnglish = !isLikelyEnglish(v.title, v.description ?? "");
    const reasons = [tooShort && "short", notEnglish && "non-english"].filter(Boolean).join(", ");
    console.log(`  - [${reasons}] ${v.title} (${v.durationSeconds}s)`);
  }

  if (!shouldDelete) {
    console.log(`\n[cleanup] Dry run only — nothing deleted. Re-run with --delete to actually remove these.`);
    await prisma.$disconnect();
    return;
  }

  const ids = toDelete.map((v) => v.id);
  const result = await prisma.video.deleteMany({ where: { id: { in: ids } } });
  console.log(`[cleanup] Deleted ${result.count} row(s).`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("[cleanup] failed:", err);
  process.exit(1);
});