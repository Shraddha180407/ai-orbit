// ============================================================
// Smithery Sync Service
// ============================================================

import { PrismaClient, type Prisma } from '@prisma/client';
import { SmitheryClient } from './smithery.client.js';
import { mapSmitheryServer, mapSmitheryServerToMCPItemIngestInput } from './smithery.mapper.js';
import { MCPIngestService } from '../../ingestion/mcp.ingest.service.js';
import type { SmitheryServerSummary, SmitheryServerDetail, SyncConfig } from './types.js';

const DEFAULT_SYNC_CONFIG: SyncConfig = {
  dryRun: false,
  pageSize: 100,
  maxPages: 10,
  maxServers: 1000,
  startPage: 1,
  source: 'smithery',
  itemPrefix: 'sm-',
  detailConcurrency: 5,
};

export interface SyncResult {
  totalFetched: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: Array<{ slug: string; error: string }>;
  pagesProcessed: number;
}

// Fix 3: Shape of preloaded existing MCP for in-memory comparison
interface ExistingMCP {
  id: string;
  name: string;
  shortDescription: string;
  logoUrl: string | null;
  isVerified: boolean;
  qualityScore: number;
}

export class SmitherySyncService {
  private prisma: PrismaClient;
  private client: SmitheryClient;
  private config: SyncConfig;

  constructor(prisma: PrismaClient, config?: Partial<SyncConfig>) {
    this.prisma = prisma;
    this.client = new SmitheryClient();
    this.config = { ...DEFAULT_SYNC_CONFIG, ...config };
  }

  // ----------------------------------------------------------
  // Main sync entry point
  // ----------------------------------------------------------
  async sync(): Promise<SyncResult> {
    const result: SyncResult = {
      totalFetched: 0,
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [],
      pagesProcessed: 0,
    };

    console.log(`\n🔄 Smithery Sync ${this.config.dryRun ? '(DRY RUN)' : '(LIVE)'}`);
    console.log(`   Page size: ${this.config.pageSize}`);
    console.log(`   Max pages: ${this.config.maxPages}`);
    console.log(`   Max servers: ${this.config.maxServers}`);
    console.log(`   Start page: ${this.config.startPage}`);
    console.log(`${'─'.repeat(60)}\n`);

    // Fix 3: Single preload query — slug → full record
    const existingBySlug = await this.loadExistingBySlug();
    console.log(`📦 ${existingBySlug.size} existing MCP items in database\n`);

    // Pre-load taxonomy lookups
    const categoryMap = await this.loadCategoryMap();
    const subCategoryMap = await this.loadSubCategoryMap();
    const tagMap = await this.loadTagMap();
    console.log(
      `📂 ${categoryMap.size} categories, ${subCategoryMap.size} subcategories, ${tagMap.size} tags\n`,
    );

    let currentPage = this.config.startPage;
    let serversProcessed = 0;

    while (currentPage < this.config.startPage + this.config.maxPages) {
      if (serversProcessed >= this.config.maxServers) {
        console.log(`\n⏹  Reached server limit (${this.config.maxServers})`);
        break;
      }

      console.log(`📄 Fetching page ${currentPage}...`);

      let listResponse;
      try {
        listResponse = await this.client.listServers(currentPage, this.config.pageSize);
      } catch (err) {
        console.error(`❌ Failed to fetch page ${currentPage}: ${err}`);
        result.errors.push({ slug: `page-${currentPage}`, error: String(err) });
        result.failed++;
        break;
      }

      const { servers, pagination } = listResponse;
      console.log(
        `   Found ${servers.length} servers (total: ${pagination.totalCount}, page ${pagination.currentPage}/${pagination.totalPages})`,
      );

      if (servers.length === 0) break;

      const remaining = this.config.maxServers - serversProcessed;
      const toProcess = servers.slice(0, remaining);

      // Process in batches for detail fetches
      const batchSize = this.config.detailConcurrency;
      for (let i = 0; i < toProcess.length; i += batchSize) {
        const batch = toProcess.slice(i, i + batchSize);
        const batchResults = await this.processBatch(
          batch,
          existingBySlug,
          categoryMap,
          subCategoryMap,
          tagMap,
        );

        result.created += batchResults.created;
        result.updated += batchResults.updated;
        result.skipped += batchResults.skipped;
        result.failed += batchResults.failed;
        result.errors.push(...batchResults.errors);
        serversProcessed += batch.length;
        result.totalFetched += batch.length;

        const pct = Math.round(
          ((serversProcessed + (currentPage - this.config.startPage) * this.config.pageSize) /
            this.config.maxServers) *
            100,
        );
        console.log(
          `   ✅ Batch done: +${batchResults.created} created, +${batchResults.updated} updated, ${batchResults.skipped} skipped (${pct}% of limit)`,
        );
      }

      result.pagesProcessed++;

      if (currentPage >= pagination.totalPages) {
        console.log(`\n📄 Reached last page (${pagination.totalPages})`);
        break;
      }

      currentPage++;
    }

    // Final summary
    const dry = this.config.dryRun;
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📊 Sync Summary`);
    console.log(`${'─'.repeat(60)}`);
    console.log(`   Fetched:  ${result.totalFetched}`);
    console.log(`   ${dry ? 'Would create:' : 'Created:  '} ${result.created}`);
    console.log(`   ${dry ? 'Would update:' : 'Updated:  '} ${result.updated}`);
    console.log(`   ${dry ? 'Would skip:' : 'Skipped:  '} ${result.skipped}`);
    console.log(`   ${dry ? 'Would fail:' : 'Failed:   '} ${result.failed}`);
    console.log(`   Pages:    ${result.pagesProcessed}`);
    if (result.errors.length > 0) {
      console.log(`\n   Errors:`);
      for (const e of result.errors.slice(0, 10)) {
        console.log(`     - ${e.slug}: ${e.error}`);
      }
      if (result.errors.length > 10) {
        console.log(`     ... and ${result.errors.length - 10} more`);
      }
    }
    console.log(`${'═'.repeat(60)}\n`);

    return result;
  }

  // ----------------------------------------------------------
  // Process a batch of servers
  // ----------------------------------------------------------
  private async processBatch(
    servers: SmitheryServerSummary[],
    existingBySlug: Map<string, ExistingMCP>,
    categoryMap: Map<string, string>,
    subCategoryMap: Map<string, string>,
    tagMap: Map<string, string>,
  ): Promise<Omit<SyncResult, 'totalFetched' | 'pagesProcessed'>> {
    const batchResult = {
      created: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      errors: [] as Array<{ slug: string; error: string }>,
    };

    // Fetch details in chunks of detailConcurrency
    const details: PromiseSettledResult<SmitheryServerDetail>[] = [];
    for (let i = 0; i < servers.length; i += this.config.detailConcurrency) {
      const chunk = servers.slice(i, i + this.config.detailConcurrency);
      const chunkResults = await Promise.allSettled(
        chunk.map((s) => this.client.getServer(s.qualifiedName)),
      );
      details.push(...chunkResults);
    }

    for (let i = 0; i < servers.length; i++) {
      const summary = servers[i];
      const slug = `${this.config.itemPrefix}${sanitizeSlug(summary.qualifiedName)}`;

      try {
        const detail =
          details[i].status === 'fulfilled' ? (details[i] as PromiseFulfilledResult<SmitheryServerDetail>).value : null;

        if (details[i].status === 'rejected') {
          console.warn(
            `   ⚠️  Failed to fetch detail for ${summary.qualifiedName}: ${(details[i] as PromiseRejectedResult).reason}`,
          );
          batchResult.failed++;
          batchResult.errors.push({ slug, error: String((details[i] as PromiseRejectedResult).reason) });
        }

        const mapped = mapSmitheryServer(summary, detail);

        // Fix 3: In-memory comparison — no DB call
        const existing = existingBySlug.get(slug);

        if (existing) {
          if (!hasChanged(existing, mapped)) {
            batchResult.skipped++;
            continue;
          }

          const ingestItem = mapSmitheryServerToMCPItemIngestInput(summary, detail);
          if (!this.config.dryRun) {
            await MCPIngestService.ingestMCPItems(this.prisma, { items: [ingestItem] });
          }
          batchResult.updated++;
        } else {
          const ingestItem = mapSmitheryServerToMCPItemIngestInput(summary, detail);
          if (!this.config.dryRun) {
            const ingestResult = await MCPIngestService.ingestMCPItems(this.prisma, { items: [ingestItem] });
            existingBySlug.set(slug, {
              id: slug,
              name: mapped.item.name,
              shortDescription: mapped.item.shortDescription,
              logoUrl: mapped.item.logoUrl,
              isVerified: mapped.item.isVerified,
              qualityScore: mapped.item.qualityScore,
            });
          }
          batchResult.created++;
        }
      } catch (err) {
        console.error(`   ❌ Failed to process ${summary.qualifiedName}: ${err}`);
        batchResult.failed++;
        batchResult.errors.push({ slug, error: String(err) });
      }
    }

    return batchResult;
  }

  // ----------------------------------------------------------
  // Fix 1 + 9: Create with upsert + transaction
  // ----------------------------------------------------------
  private async createItem(
    mapped: Awaited<ReturnType<typeof mapSmitheryServer>>,
    categoryMap: Map<string, string>,
    subCategoryMap: Map<string, string>,
    tagMap: Map<string, string>,
  ): Promise<string> {
    const { item, relations } = mapped;

    const result = await this.prisma.$transaction(async (tx) => {
      // Fix 9: Use upsert to handle concurrent syncs
      const upserted = await tx.mCPItem.upsert({
        where: { slug: item.slug },
        create: {
          itemType: item.itemType,
          name: item.name,
          slug: item.slug,
          logoUrl: item.logoUrl,
          shortDescription: item.shortDescription,
          fullDescription: item.fullDescription,
          providerName: item.providerName,
          providerUrl: item.providerUrl,
          license: item.license,
          pricingType: item.pricingType,
          isVerified: item.isVerified,
          websiteUrl: item.websiteUrl,
          documentationUrl: item.documentationUrl,
          repositoryUrl: item.repositoryUrl,
          qualityScore: item.qualityScore,
        },
        update: {
          name: item.name,
          logoUrl: item.logoUrl,
          shortDescription: item.shortDescription,
          fullDescription: item.fullDescription,
          providerName: item.providerName,
          providerUrl: item.providerUrl,
          license: item.license,
          isVerified: item.isVerified,
          websiteUrl: item.websiteUrl,
          documentationUrl: item.documentationUrl,
          repositoryUrl: item.repositoryUrl,
          qualityScore: item.qualityScore,
        },
      });

      await attachRelations(tx, upserted.id, relations, categoryMap, subCategoryMap, tagMap);
      return upserted;
    });

    return result.id;
  }

  // ----------------------------------------------------------
  // Fix 1 + 2: Update with diff-based sync + transaction
  // ----------------------------------------------------------
  private async updateItem(
    slug: string,
    mapped: Awaited<ReturnType<typeof mapSmitheryServer>>,
    categoryMap: Map<string, string>,
    subCategoryMap: Map<string, string>,
    tagMap: Map<string, string>,
    existingId: string,
  ) {
    const { item, relations } = mapped;

    await this.prisma.$transaction(async (tx) => {
      // Update core fields (lastUpdatedDate is handled by @updatedAt in schema)
      await tx.mCPItem.update({
        where: { slug },
        data: {
          name: item.name,
          logoUrl: item.logoUrl,
          shortDescription: item.shortDescription,
          fullDescription: item.fullDescription,
          providerName: item.providerName,
          providerUrl: item.providerUrl,
          license: item.license,
          isVerified: item.isVerified,
          websiteUrl: item.websiteUrl,
          documentationUrl: item.documentationUrl,
          repositoryUrl: item.repositoryUrl,
          qualityScore: item.qualityScore,
        },
      });

      // Fix 2: Diff-based sync — only insert missing, delete obsolete
      await diffRelations(tx, existingId, relations, categoryMap, subCategoryMap, tagMap);
    });
  }

  // ----------------------------------------------------------
  // Loaders
  // ----------------------------------------------------------
  private async loadExistingBySlug(): Promise<Map<string, ExistingMCP>> {
    const items = await this.prisma.mCPItem.findMany({
      select: {
        slug: true,
        id: true,
        name: true,
        shortDescription: true,
        logoUrl: true,
        isVerified: true,
        qualityScore: true,
      },
    });
    const map = new Map<string, ExistingMCP>();
    for (const item of items) {
      map.set(item.slug, {
        id: item.id,
        name: item.name,
        shortDescription: item.shortDescription,
        logoUrl: item.logoUrl,
        isVerified: item.isVerified,
        qualityScore: item.qualityScore ?? 0,
      });
    }
    return map;
  }

  private async loadCategoryMap(): Promise<Map<string, string>> {
    const cats = await this.prisma.mCPDirectoryCategory.findMany({
      select: { slug: true, id: true },
    });
    return new Map(cats.map((c) => [c.slug, c.id]));
  }

  private async loadSubCategoryMap(): Promise<Map<string, string>> {
    const subs = await this.prisma.mCPDirectorySubCategory.findMany({
      select: { slug: true, id: true },
    });
    return new Map(subs.map((s) => [s.slug, s.id]));
  }

  private async loadTagMap(): Promise<Map<string, string>> {
    const tags = await this.prisma.mCPDirectoryTag.findMany({
      select: { slug: true, id: true },
    });
    return new Map(tags.map((t) => [t.slug, t.id]));
  }
}

// ----------------------------------------------------------
// Fix 8: Batch inserts with createMany
// ----------------------------------------------------------
async function attachRelations(
  tx: Prisma.TransactionClient,
  mcpItemId: string,
  relations: Awaited<ReturnType<typeof mapSmitheryServer>>['relations'],
  categoryMap: Map<string, string>,
  subCategoryMap: Map<string, string>,
  tagMap: Map<string, string>,
) {
  // Category (max 1)
  if (relations.categorySlug) {
    const catId = categoryMap.get(relations.categorySlug);
    if (catId) {
      await tx.mCPItemCategory.create({
        data: { mcpItemId, categoryId: catId },
      });
    }
  }

  // Subcategory (max 1)
  if (relations.subCategorySlug) {
    const subId = subCategoryMap.get(relations.subCategorySlug);
    if (subId) {
      await tx.mCPItemSubCategory.create({
        data: { mcpItemId, subCategoryId: subId },
      });
    }
  }

  // Fix 5: Only use existing tags — never create new ones
  const tagRows: Array<{ mcpItemId: string; tagId: string }> = [];
  for (const tagSlug of relations.tagSlugs) {
    const tagId = tagMap.get(tagSlug);
    if (!tagId) {
      console.warn(`   ⚠️  Skipping unknown tag: ${tagSlug}`);
      continue;
    }
    tagRows.push({ mcpItemId, tagId });
  }
  if (tagRows.length > 0) {
    await tx.mCPItemTag.createMany({ data: tagRows });
  }

  // Features — createMany
  if (relations.features.length > 0) {
    await tx.mCPFeature.createMany({
      data: relations.features.slice(0, 10).map((f) => ({
        mcpItemId,
        title: f.title,
        description: f.description,
      })),
    });
  }

  // Technical spec (max 1)
  if (relations.technicalSpec) {
    await tx.technicalSpec.create({
      data: {
        mcpItemId,
        supportedPlatforms: relations.technicalSpec.supportedPlatforms,
        compatibility: relations.technicalSpec.compatibility,
        integrations: relations.technicalSpec.integrations,
        localBindingControls: relations.technicalSpec.localBindingControls,
      },
    });
  }

  // Installation steps — createMany
  if (relations.installationSteps.length > 0) {
    await tx.installationGuide.createMany({
      data: relations.installationSteps.map((s) => ({
        mcpItemId,
        stepNumber: s.stepNumber,
        title: s.title,
        codeSnippet: s.codeSnippet,
        instructions: s.instructions,
      })),
    });
  }
}

// ----------------------------------------------------------
// Fix 2: Diff-based relation sync (insert missing, delete obsolete)
// ----------------------------------------------------------
async function diffRelations(
  tx: Prisma.TransactionClient,
  mcpItemId: string,
  relations: Awaited<ReturnType<typeof mapSmitheryServer>>['relations'],
  categoryMap: Map<string, string>,
  subCategoryMap: Map<string, string>,
  tagMap: Map<string, string>,
) {
  // --- Categories ---
  const desiredCategoryId = relations.categorySlug ? categoryMap.get(relations.categorySlug) : null;
  const existingCats = await tx.mCPItemCategory.findMany({
    where: { mcpItemId },
    select: { id: true, categoryId: true },
  });
  if (desiredCategoryId) {
    const hasDesired = existingCats.some((c) => c.categoryId === desiredCategoryId);
    if (!hasDesired) {
      await tx.mCPItemCategory.create({
        data: { mcpItemId, categoryId: desiredCategoryId },
      });
    }
  }
  // Delete obsolete categories
  if (desiredCategoryId) {
    const toDelete = existingCats.filter((c) => c.categoryId !== desiredCategoryId);
    if (toDelete.length > 0) {
      await tx.mCPItemCategory.deleteMany({
        where: { id: { in: toDelete.map((c) => c.id) } },
      });
    }
  } else {
    // No desired category — remove all
    await tx.mCPItemCategory.deleteMany({ where: { mcpItemId } });
  }

  // --- Subcategories ---
  const desiredSubId = relations.subCategorySlug
    ? subCategoryMap.get(relations.subCategorySlug)
    : null;
  const existingSubs = await tx.mCPItemSubCategory.findMany({
    where: { mcpItemId },
    select: { id: true, subCategoryId: true },
  });
  if (desiredSubId) {
    const hasDesired = existingSubs.some((s) => s.subCategoryId === desiredSubId);
    if (!hasDesired) {
      await tx.mCPItemSubCategory.create({
        data: { mcpItemId, subCategoryId: desiredSubId },
      });
    }
  }
  if (desiredSubId) {
    const toDelete = existingSubs.filter((s) => s.subCategoryId !== desiredSubId);
    if (toDelete.length > 0) {
      await tx.mCPItemSubCategory.deleteMany({
        where: { id: { in: toDelete.map((s) => s.id) } },
      });
    }
  } else {
    await tx.mCPItemSubCategory.deleteMany({ where: { mcpItemId } });
  }

  // --- Tags ---
  const desiredTagIds = relations.tagSlugs
    .map((slug) => tagMap.get(slug))
    .filter((id): id is string => id !== undefined);

  const existingTags = await tx.mCPItemTag.findMany({
    where: { mcpItemId },
    select: { id: true, tagId: true },
  });

  const existingTagIdSet = new Set(existingTags.map((t) => t.tagId));
  const desiredTagIdSet = new Set(desiredTagIds);

  // Insert missing
  const toInsert = desiredTagIds.filter((id) => !existingTagIdSet.has(id));
  if (toInsert.length > 0) {
    await tx.mCPItemTag.createMany({
      data: toInsert.map((tagId) => ({ mcpItemId, tagId })),
    });
  }

  // Delete obsolete
  const toDeleteTags = existingTags.filter((t) => !desiredTagIdSet.has(t.tagId));
  if (toDeleteTags.length > 0) {
    await tx.mCPItemTag.deleteMany({
      where: { id: { in: toDeleteTags.map((t) => t.id) } },
    });
  }

  // --- Features ---
  const existingFeatures = await tx.mCPFeature.findMany({
    where: { mcpItemId },
    select: { id: true, title: true },
  });
  const existingFeatureTitles = new Set(existingFeatures.map((f) => f.title));
  const desiredFeatures = relations.features.slice(0, 10);

  // Insert missing features
  const newFeatures = desiredFeatures.filter((f) => !existingFeatureTitles.has(f.title));
  if (newFeatures.length > 0) {
    await tx.mCPFeature.createMany({
      data: newFeatures.map((f) => ({
        mcpItemId,
        title: f.title,
        description: f.description,
      })),
    });
  }

  // Delete obsolete features (not in desired list)
  const desiredFeatureTitles = new Set(desiredFeatures.map((f) => f.title));
  const toDeleteFeatures = existingFeatures.filter((f) => !desiredFeatureTitles.has(f.title));
  if (toDeleteFeatures.length > 0) {
    await tx.mCPFeature.deleteMany({
      where: { id: { in: toDeleteFeatures.map((f) => f.id) } },
    });
  }

  // --- Technical spec (1:1 — replace if changed) ---
  const existingSpec = await tx.technicalSpec.findFirst({
    where: { mcpItemId },
    select: { id: true },
  });
  if (relations.technicalSpec) {
    if (existingSpec) {
      await tx.technicalSpec.update({
        where: { id: existingSpec.id },
        data: {
          supportedPlatforms: relations.technicalSpec.supportedPlatforms,
          compatibility: relations.technicalSpec.compatibility,
          integrations: relations.technicalSpec.integrations,
          localBindingControls: relations.technicalSpec.localBindingControls,
        },
      });
    } else {
      await tx.technicalSpec.create({
        data: {
          mcpItemId,
          supportedPlatforms: relations.technicalSpec.supportedPlatforms,
          compatibility: relations.technicalSpec.compatibility,
          integrations: relations.technicalSpec.integrations,
          localBindingControls: relations.technicalSpec.localBindingControls,
        },
      });
    }
  } else if (existingSpec) {
    await tx.technicalSpec.delete({ where: { id: existingSpec.id } });
  }

  // --- Installation steps ---
  const existingSteps = await tx.installationGuide.findMany({
    where: { mcpItemId },
    select: { id: true, stepNumber: true },
  });
  const existingStepNums = new Set(existingSteps.map((s) => s.stepNumber));
  const desiredStepNums = new Set(relations.installationSteps.map((s) => s.stepNumber));

  // Insert missing steps
  const newSteps = relations.installationSteps.filter(
    (s) => !existingStepNums.has(s.stepNumber),
  );
  if (newSteps.length > 0) {
    await tx.installationGuide.createMany({
      data: newSteps.map((s) => ({
        mcpItemId,
        stepNumber: s.stepNumber,
        title: s.title,
        codeSnippet: s.codeSnippet,
        instructions: s.instructions,
      })),
    });
  }

  // Delete obsolete steps
  const toDeleteSteps = existingSteps.filter((s) => !desiredStepNums.has(s.stepNumber));
  if (toDeleteSteps.length > 0) {
    await tx.installationGuide.deleteMany({
      where: { id: { in: toDeleteSteps.map((s) => s.id) } },
    });
  }
}

// ----------------------------------------------------------
// Fix 3: In-memory change detection (no DB call)
// ----------------------------------------------------------
function hasChanged(existing: ExistingMCP, mapped: Awaited<ReturnType<typeof mapSmitheryServer>>): boolean {
  return (
    existing.name !== mapped.item.name ||
    existing.shortDescription !== mapped.item.shortDescription ||
    existing.logoUrl !== mapped.item.logoUrl ||
    existing.isVerified !== mapped.item.isVerified ||
    Math.abs(existing.qualityScore - mapped.item.qualityScore) > 0.01
  );
}

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------
function sanitizeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
