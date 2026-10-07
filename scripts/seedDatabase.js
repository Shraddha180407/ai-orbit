// Seed SQLite database directly from verified expanded datasets
import { AI_MODELS_DATA } from '../src/data/modelsData.js';
import { AI_AGENTS_DATA } from '../src/data/agentsData.js';
import { MCP_DATA } from '../src/data/mcpData.js';
import { AI_TOOLS_DATA } from '../src/data/toolsData.js';
import { COMPANIES_DATA } from '../src/data/companiesData.js';
import { saveIngestionResults } from '../server/db.js';
import { rankLeaderboard } from '../server/pipeline/rankingEngine.js';

console.log('[Seed] Seeding SQLite database from expanded datasets...');

const perspectives = ['overall', 'risers', 'adopted', 'speed', 'open_weights'];
const rankingsByPerspective = {};

for (const p of perspectives) {
  const ranked = rankLeaderboard(AI_MODELS_DATA, p);
  rankingsByPerspective[p] = ranked;
  console.log(`[Seed] Perspective [${p}]: ${ranked.returnedCount} models.`);
}

saveIngestionResults(AI_MODELS_DATA, rankingsByPerspective, {
  agents: AI_AGENTS_DATA,
  mcps: MCP_DATA,
  tools: AI_TOOLS_DATA,
  companies: COMPANIES_DATA
});

console.log('[Seed] Database successfully seeded with 500 models, 500 agents, 500 mcps, 500 tools, 175 companies!');
process.exit(0);
