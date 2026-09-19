// Manual / Scheduled Ingestion Trigger Script
// Run via: npm run update:leaderboard OR node scripts/updateLeaderboard.js

import { runIngestionPipeline } from '../server/pipeline/ingest.js';

async function main() {
  const result = await runIngestionPipeline();
  if (!result.success) {
    console.error('Leaderboard update failed:', result.error);
    process.exit(1);
  }
  console.log('Leaderboard successfully updated with real evaluation data!');
  process.exit(0);
}

main();
