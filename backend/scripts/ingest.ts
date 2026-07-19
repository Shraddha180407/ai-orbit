/**
 * Manual ingestion trigger — runs the full pipeline directly against Neon
 * via DATABASE_URL, entirely outside Cloudflare Workers.
 *
 * Built because the team's Cloudflare account is on the Free plan, whose
 * limits (10ms CPU time, 50 subrequests per invocation — see
 * https://developers.cloudflare.com/workers/platform/limits/) make the
 * Cron Trigger path (see the scheduled() handler in src/index.ts, left in
 * place for if/when the plan changes) unusable for this workload. Running
 * as a plain Node script sidesteps those limits entirely — there's no
 * Workers runtime involved here at all.
 *
 * The pipeline code itself is unchanged from what Workers runs — this
 * script builds the same IngestionContext, reading Cloudinary credentials
 * from backend/.env the same way DATABASE_URL/GEMINI_API_KEY/GROQ_API_KEY
 * already are. Unlike the old R2-based storage, Cloudinary's plain HTTP
 * upload API works identically here and inside Workers — no plan-specific
 * degradation needed for logo storage anymore.
 *
 * Usage: npm run ingest
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { runIngestion } from "../src/modules/ingestion/ingestion.service.js";
import type { IngestionContext } from "../src/modules/ingestion/pipeline.js";

function checkRequiredEnv(): void {
  if (!process.env.DATABASE_URL) {
    console.error("FATAL: DATABASE_URL is not set. Add it to backend/.env.");
    process.exit(1);
  }
  for (const key of ["GEMINI_API_KEY", "GROQ_API_KEY"]) {
    if (!process.env[key]) {
      console.warn(`  note: ${key} is not set in backend/.env — LLM summaries will fall through to Pollinations.ai or the raw RSS description.`);
    }
  }
  for (const key of ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"]) {
    if (!process.env[key]) {
      console.warn(`  note: ${key} is not set in backend/.env — publisher logos will fall through to the Google favicon aggregator.`);
    }
  }
}

function cloudinaryConfigFromEnv() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) return undefined;
  return { cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET };
}

async function main() {
  checkRequiredEnv();
  console.log("Starting manual ingestion run...\n");

  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const ctx: IngestionContext = {
    prisma,
    llmKeys: { geminiKey: process.env.GEMINI_API_KEY, groqKey: process.env.GROQ_API_KEY },
    cloudinary: cloudinaryConfigFromEnv(),
  };

  const summary = await runIngestion(ctx);

  for (const r of summary.results) {
    console.log(
      `${r.source.padEnd(28)} fetched=${r.fetched} created=${r.created} duplicate=${r.skippedDuplicate} ` +
        `near-dup=${r.skippedNearDuplicate} not-ai=${r.skippedNotAiRelevant} invalid=${r.skippedInvalid} ` +
        `no-content=${r.skippedNoContent} cap-reached=${r.skippedCapReached}` +
        `${r.errors.length ? ` errors=${r.errors.length}` : ""}`
    );
    for (const err of r.errors.slice(0, 3)) console.log(`   ! ${err}`);
  }

  console.log(`\nDone. ${summary.totalCreated} new article(s) ingested.`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
