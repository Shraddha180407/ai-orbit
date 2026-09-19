// Server 24-Hour Ingestion Scheduler
// Schedules automatic background execution of the ingestion pipeline every 24 hours.

import { runIngestionPipeline } from './pipeline/ingest.js';

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
let timerId = null;

export function start24HourScheduler() {
  if (timerId) return;

  console.log('[Scheduler] Initializing 24-Hour Leaderboard Update Scheduler (Interval: 24h)');

  timerId = setInterval(async () => {
    console.log('[Scheduler] Executing scheduled 24-hour leaderboard update...');
    try {
      await runIngestionPipeline();
    } catch (err) {
      console.error('[Scheduler] Scheduled update failed:', err.message);
    }
  }, TWENTY_FOUR_HOURS_MS);

  // Prevent scheduler from keeping Node process alive if exiting
  if (timerId.unref) {
    timerId.unref();
  }
}

export function stopScheduler() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}
