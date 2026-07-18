/**
 * Shared ingestion orchestration — everything a "run ingestion" trigger
 * needs to do, regardless of whether that trigger is the manual
 * POST /api/ingestion/run route or the real scheduled() Cron handler.
 * Keeping this in one place means the two entry points can't drift apart
 * on per-run creation caps, HN discovery limits, or source selection.
 */
import { FEED_SOURCES, type FeedSource } from "./sources.js";
import { ingestAll, ingestHackerNewsDiscovery, loadRecentTitleIndex, type IngestionContext, type PipelineResult, type RunCap } from "./pipeline.js";

/**
 * Caps how many NEW articles a single runIngestion() call may create,
 * across every source combined (RSS + Hacker News discovery run
 * concurrently and share one counter — see RunCap in pipeline.ts).
 * Articles are no longer pruned (see the removed pruneToMostRecent() call
 * below), so this is now the only volume control on the News table's
 * growth per run.
 */
export const MAX_NEW_ARTICLES_PER_RUN = 100;

/**
 * Caps HN discovery to the same per-run volume a single RSS source already
 * gets (see FeedSource/parseFeed's own `limit` convention) — HN discovery
 * previously had no analogous cap, which is fine against a generous
 * GitHub Actions budget but not against a hard 15-minute Cloudflare Cron
 * Trigger ceiling. See ingestHackerNewsDiscovery() in pipeline.ts.
 */
export const HN_DISCOVERY_LIMIT = 30;

export interface IngestionRunOptions {
  sources?: FeedSource[];
  limit?: number;
  includeHackerNews?: boolean;
}

export interface IngestionRunSummary {
  totalCreated: number;
  /**
   * Always 0 — pruning is permanently disabled (see MAX_NEW_ARTICLES_PER_RUN
   * above). Kept as a field, rather than removed, because backend/src/index.ts's
   * Cron handler (outside this module's scope) still reads summary.pruned in
   * its log line; removing the field would break that caller.
   */
  pruned: number;
  results: PipelineResult[];
}

export async function runIngestion(ctx: IngestionContext, options: IngestionRunOptions = {}): Promise<IngestionRunSummary> {
  const sources = options.sources ?? FEED_SOURCES;
  const limit = options.limit ?? 30;
  const includeHackerNews = options.includeHackerNews ?? true;

  const titleIndex = await loadRecentTitleIndex(ctx.prisma);
  const runCap: RunCap = { remaining: MAX_NEW_ARTICLES_PER_RUN };
  const [results, hnResult] = await Promise.all([
    ingestAll(ctx, sources, limit, titleIndex, runCap),
    includeHackerNews ? ingestHackerNewsDiscovery(ctx, titleIndex, HN_DISCOVERY_LIMIT, runCap) : Promise.resolve(null),
  ]);
  const allResults = hnResult ? [...results, hnResult] : results;
  const totalCreated = allResults.reduce((sum, r) => sum + r.created, 0);

  // Visibility only (see task): no pruning ever runs now, so the News table
  // grows indefinitely — this log is how anyone watching a run (manual
  // script or the dormant Cron handler, both funnel through here) sees the
  // table's actual size and duplicate-skip rate without a dashboard.
  const totalArticles = await ctx.prisma.news.count();
  const duplicatesSkipped = allResults.reduce((sum, r) => sum + r.skippedDuplicate + r.skippedNearDuplicate, 0);
  console.log(`[ingestion] run summary: totalArticles=${totalArticles} newlyInserted=${totalCreated} duplicatesSkipped=${duplicatesSkipped}`);

  return {
    totalCreated,
    pruned: 0,
    results: allResults,
  };
}
