import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// ---------------------------------------------------------------------------
// SAFETY: This script ONLY inserts rows into MCPItemSubCategory.
// It NEVER modifies, deletes, or updates any other table or column.
//
// This backfill maps MCPSubCategory references to MCPDirectorySubCategory
// by matching slugs. It creates MCPItemSubCategory junction records for
// any MCPItem that has MCPSubCategoryItem records but no MCPItemSubCategory.
//
// Usage:
//   npx tsx scripts/backfill-mcp-subcategories.ts            (live run)
//   npx tsx scripts/backfill-mcp-subcategories.ts --dry-run  (dry run)
// ---------------------------------------------------------------------------

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  console.log(`\n🔧 MCP Subcategory Backfill Script`);
  console.log(`   Mode: ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE RUN"}`);
  console.log(`${"─".repeat(60)}\n`);

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Step 1: Get all MCPDirectorySubCategory records (canonical taxonomy)
    const directorySubCategories = await prisma.mCPDirectorySubCategory.findMany({
      include: { category: true },
    });

    console.log(`📂 Found ${directorySubCategories.length} MCPDirectorySubCategory records`);

    // Build slug → id lookup map
    const slugToDirectoryId = new Map<string, string>();
    for (const sub of directorySubCategories) {
      slugToDirectoryId.set(sub.slug, sub.id);
      console.log(`   - ${sub.slug} → ${sub.id} (${sub.category.name})`);
    }

    console.log("");

    // Step 2: Get all MCPSubCategory records (legacy taxonomy)
    const legacySubCategories = await prisma.mCPSubCategory.findMany();
    console.log(`📦 Found ${legacySubCategories.length} MCPSubCategory records (legacy)`);

    // Build slug → id lookup map
    const slugToLegacyId = new Map<string, string>();
    for (const sub of legacySubCategories) {
      slugToLegacyId.set(sub.slug, sub.id);
    }

    // Step 3: Get all MCPSubCategoryItem records (legacy junction)
    const legacyItems = await prisma.mCPSubCategoryItem.findMany();
    console.log(`🔗 Found ${legacyItems.length} MCPSubCategoryItem records (legacy junction)\n`);

    if (legacyItems.length === 0) {
      console.log("✅ No legacy junction records to backfill. Done.\n");
      return;
    }

    // Step 4: Get all existing MCPItemSubCategory records (canonical junction)
    const existingItems = await prisma.mCPItemSubCategory.findMany();
    const existingSet = new Set(
      existingItems.map((i) => `${i.mcpItemId}:${i.subCategoryId}`)
    );
    console.log(`📋 Found ${existingItems.length} existing MCPItemSubCategory records\n`);

    // Step 5: Map legacy → canonical and insert missing junction records
    let created = 0;
    let skipped = 0;
    let noMatch = 0;

    for (const legacy of legacyItems) {
      // Find the legacy subcategory to get its slug
      const legacySub = legacySubCategories.find((s) => s.id === legacy.subCategoryId);
      if (!legacySub) {
        console.log(`   ⚠️  Legacy subcategory ${legacy.subCategoryId} not found, skipping`);
        skipped++;
        continue;
      }

      // Find the canonical subcategory by slug
      const canonicalId = slugToDirectoryId.get(legacySub.slug);
      if (!canonicalId) {
        console.log(`   ⚠️  No MCPDirectorySubCategory found for slug "${legacySub.slug}", skipping`);
        noMatch++;
        continue;
      }

      // Check if junction record already exists
      const key = `${legacy.mcpItemId}:${canonicalId}`;
      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      // Insert the canonical junction record
      if (!DRY_RUN) {
        await prisma.mCPItemSubCategory.create({
          data: {
            mcpItemId: legacy.mcpItemId,
            subCategoryId: canonicalId,
          },
        });
      }

      console.log(`   ✅ ${DRY_RUN ? "[DRY] " : ""}Created MCPItemSubCategory: ${legacy.mcpItemId} → ${canonicalId} (${legacySub.slug})`);
      created++;
      existingSet.add(key);
    }

    console.log(`\n${"─".repeat(60)}`);
    console.log(`📊 Summary:`);
    console.log(`   Created: ${created}`);
    console.log(`   Skipped (already exists): ${skipped}`);
    console.log(`   No match: ${noMatch}`);
    console.log(`${"─".repeat(60)}\n`);

    if (DRY_RUN) {
      console.log("ℹ️  This was a dry run. No data was modified.\n");
    } else {
      console.log("✅ Backfill complete.\n");
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("❌ Backfill failed:", e);
  process.exit(1);
});
