import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { SmitherySyncService } from "../src/modules/mcp/sync/smithery.sync.js";

// ---------------------------------------------------------------------------
// CLI: Smithery Sync Script
//
// Usage:
//   npx tsx scripts/sync-smithery.ts                          (live, 100 servers)
//   npx tsx scripts/sync-smithery.ts --dry-run                (dry run)
//   npx tsx scripts/sync-smithery.ts --limit 50               (first 50 only)
//   npx tsx scripts/sync-smithery.ts --page-size 50           (50 per page)
//   npx tsx scripts/sync-smithery.ts --page 5                 (start from page 5)
//   npx tsx scripts/sync-smithery.ts --limit 100 --page 2     (100 servers from page 2)
// ---------------------------------------------------------------------------

function parseArgs(): {
  dryRun: boolean;
  limit: number;
  pageSize: number;
  startPage: number;
} {
  const args = process.argv.slice(2);

  const dryRun = args.includes("--dry-run");

  const getNum = (flag: string, fallback: number): number => {
    const idx = args.indexOf(flag);
    if (idx === -1 || idx + 1 >= args.length) return fallback;
    const val = parseInt(args[idx + 1], 10);
    return isNaN(val) ? fallback : val;
  };

  return {
    dryRun,
    limit: getNum("--limit", 100),
    pageSize: getNum("--page-size", 100),
    startPage: getNum("--page", 1),
  };
}

async function main() {
  const { dryRun, limit, pageSize, startPage } = parseArgs();

  console.log("\n🔧 Smithery Sync Script");
  console.log(`   Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE RUN"}`);
  console.log(`   Limit: ${limit} servers`);
  console.log(`   Page size: ${pageSize}`);
  console.log(`   Start page: ${startPage}`);
  console.log(`${"─".repeat(60)}\n`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const service = new SmitherySyncService(prisma, {
      dryRun,
      maxServers: limit,
      pageSize,
      startPage,
    });

    const result = await service.sync();

    if (result.failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("\n❌ Sync failed:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
