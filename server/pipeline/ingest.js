// Server Ingestion Pipeline Orchestrator
// Coordinates: Fetch -> Validate & Normalize -> Rank Perspectives -> Store in DB -> Export Snapshot
// Implements resilient fallback to keep the last known good dataset on source failure.

import { fetchLMSYSArenaData, fetchArtificialAnalysisData } from './fetcher.js';
import { mergeAndNormalize } from './normalizer.js';
import { rankLeaderboard } from './rankingEngine.js';
import { getPreviousSnapshotMap, saveIngestionResults, getDb } from '../db.js';

export async function runIngestionPipeline() {
  console.log('====================================================');
  console.log('[Ingestion] Starting 24-Hour AI Ecosystem Data Ingestion');
  console.log(`[Ingestion] Timestamp: ${new Date().toISOString()}`);
  console.log('====================================================');

  try {
    // 1. Fetch from LMSYS Chatbot Arena official dataset
    console.log('[Ingestion] Fetching LMSYS Chatbot Arena official dataset...');
    const lmsysRows = await fetchLMSYSArenaData();
    console.log(`[Ingestion] Received ${lmsysRows.length} LMSYS model records.`);

    // 2. Fetch from Artificial Analysis benchmark stream
    console.log('[Ingestion] Fetching Artificial Analysis verified benchmarks...');
    let aaModels = [];
    try {
      aaModels = await fetchArtificialAnalysisData();
      console.log(`[Ingestion] Received ${aaModels.length} Artificial Analysis records.`);
    } catch (aaErr) {
      console.warn('[Ingestion] Artificial Analysis fetch failed, proceeding with LMSYS primary:', aaErr.message);
    }

    // 3. Retrieve previous snapshots for momentum calculations
    const prevSnapshots = getPreviousSnapshotMap();
    console.log(`[Ingestion] Loaded ${prevSnapshots.size} previous snapshot baselines for momentum calculation.`);

    // 4. Validate and Normalize
    console.log('[Ingestion] Normalizing records with strict source provenance...');
    const normalizedModels = mergeAndNormalize(lmsysRows, aaModels, prevSnapshots);
    console.log(`[Ingestion] Successfully normalized ${normalizedModels.length} models.`);

    // 5. Calculate centralized rankings for all 5 perspectives
    const perspectives = ['overall', 'risers', 'adopted', 'speed', 'open_weights'];
    const rankingsByPerspective = {};

    for (const p of perspectives) {
      const ranked = rankLeaderboard(normalizedModels, p);
      rankingsByPerspective[p] = ranked;
      console.log(`[Ingestion] Filter [${p}]: ${ranked.returnedCount} top models ranked (qualifying: ${ranked.totalQualifying}).`);
    }

    // 6. Save to database atomically
    console.log('[Ingestion] Saving models, snapshots, and rankings to SQLite database...');
    saveIngestionResults(normalizedModels, rankingsByPerspective);

    console.log('====================================================');
    console.log('[Ingestion] Pipeline completed successfully!');
    console.log('====================================================');

    return {
      success: true,
      timestamp: new Date().toISOString(),
      totalModels: normalizedModels.length,
      counts: {
        overall: rankingsByPerspective.overall.returnedCount,
        risers: rankingsByPerspective.risers.returnedCount,
        adopted: rankingsByPerspective.adopted.returnedCount,
        speed: rankingsByPerspective.speed.returnedCount,
        open_weights: rankingsByPerspective.open_weights.returnedCount
      }
    };
  } catch (err) {
    console.error('====================================================');
    console.error('[Ingestion] PIPELINE EXECUTION FAILED:', err.message);
    console.error('[Ingestion] Preserving existing database records without corruption.');
    console.error('====================================================');

    // Attempt to log failure to DB
    try {
      const db = getDb();
      db.prepare(`
        INSERT INTO ingestion_logs (status, source, models_count, error_message, timestamp)
        VALUES ('FAILED', 'Data Pipeline', 0, ?, ?)
      `).run(err.message, new Date().toISOString());
    } catch (dbErr) {
      // Ignore DB logging failure
    }

    return {
      success: false,
      error: err.message,
      timestamp: new Date().toISOString()
    };
  }
}
