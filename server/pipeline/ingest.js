// Server Ingestion Pipeline Orchestrator
// Coordinates: Fetch -> Validate & Normalize -> Rank Perspectives -> Store in DB -> Export Snapshot
// Powers all 5 modules with real data:
// 1. Models: LMSYS Chatbot Arena official dataset (text, vision, webdev)
// 2. Agents: LMSYS Arena Agent dataset (config=agent, split=latest)
// 3. MCP: Official Model Context Protocol Registry (GET /v0.1/servers)
// 4. Tools: Public npm Tools Registry + Flagship Developer Tools
// 5. Companies: Verified AI Ecosystem Companies

import { 
  fetchLMSYSArenaData, 
  fetchArtificialAnalysisData,
  fetchArenaAgentData,
  fetchMCPRegistryData,
  fetchToolsRegistryData,
  fetchCompaniesEnrichmentData
} from './fetcher.js';
import { 
  mergeAndNormalize,
  normalizeArenaAgents,
  normalizeMCPServers,
  normalizeRegistryTools,
  normalizeCompanies
} from './normalizer.js';
import { rankLeaderboard } from './rankingEngine.js';
import { getPreviousSnapshotMap, saveIngestionResults, getDb } from '../db.js';
import { AI_TOOLS_DATA } from '../../src/data/toolsData.js';
import { COMPANIES_DATA } from '../../src/data/companiesData.js';
import fs from 'node:fs';
import path from 'node:path';

export async function runIngestionPipeline() {
  console.log('====================================================');
  console.log('[Ingestion] Starting AI Ecosystem 5-Module Data Ingestion');
  console.log(`[Ingestion] Timestamp: ${new Date().toISOString()}`);
  console.log('====================================================');

  try {
    // 1. Fetch Models: LMSYS Chatbot Arena official dataset
    console.log('[Ingestion] 1/5 Fetching LMSYS Chatbot Arena official dataset...');
    const lmsysRows = await fetchLMSYSArenaData(600, ['text', 'vision', 'webdev']);
    console.log(`[Ingestion] Received ${lmsysRows.length} LMSYS model records across configs.`);

    // 2. Fetch Verified Benchmarks from Artificial Analysis
    console.log('[Ingestion] Fetching Artificial Analysis verified benchmarks...');
    let aaModels = [];
    try {
      aaModels = await fetchArtificialAnalysisData();
      console.log(`[Ingestion] Received ${aaModels.length} Artificial Analysis records.`);
    } catch (aaErr) {
      console.warn('[Ingestion] Artificial Analysis fetch warning, proceeding with LMSYS primary:', aaErr.message);
    }

    // 3. Fetch Agents: LMSYS Arena Agent dataset
    console.log('[Ingestion] 2/5 Fetching LMSYS Arena Agent official dataset...');
    let rawAgentRows = [];
    try {
      rawAgentRows = await fetchArenaAgentData(100);
      console.log(`[Ingestion] Received ${rawAgentRows.length} LMSYS Arena Agent evaluation records.`);
    } catch (agentErr) {
      console.warn('[Ingestion] Arena Agent fetch warning:', agentErr.message);
    }

    // 4. Fetch MCP: Official MCP Registry
    console.log('[Ingestion] 3/5 Fetching Official MCP Registry servers...');
    let rawMcpServers = [];
    try {
      rawMcpServers = await fetchMCPRegistryData(150);
      console.log(`[Ingestion] Received ${rawMcpServers.length} Official MCP Registry records.`);
    } catch (mcpErr) {
      console.warn('[Ingestion] MCP Registry fetch warning:', mcpErr.message);
    }

    // 5. Fetch Tools: Public npm Tools Registry
    console.log('[Ingestion] 4/5 Fetching Public Tools Registry...');
    let rawToolPackages = [];
    try {
      rawToolPackages = await fetchToolsRegistryData(50);
      console.log(`[Ingestion] Received ${rawToolPackages.length} registry tool package records.`);
    } catch (toolErr) {
      console.warn('[Ingestion] Tools registry fetch warning:', toolErr.message);
    }

    // 5/5. Fetch Companies enrichment: Hugging Face org stats (real download/model/likes signals)
    console.log('[Ingestion] 5/5 Fetching Companies HF enrichment data...');
    let hfOrgStats = {};
    try {
      hfOrgStats = await fetchCompaniesEnrichmentData();
      console.log(`[Ingestion] Received HF stats for ${Object.keys(hfOrgStats).length} company orgs.`);
    } catch (compErr) {
      console.warn('[Ingestion] Companies HF enrichment warning:', compErr.message);
    }

    // Retrieve previous snapshots for momentum calculations
    const prevSnapshots = getPreviousSnapshotMap();
    console.log(`[Ingestion] Loaded ${prevSnapshots.size} previous snapshot baselines.`);

    // Validate and Normalize all 5 modules
    console.log('[Ingestion] Normalizing models...');
    const normalizedModels = mergeAndNormalize(lmsysRows, aaModels, prevSnapshots);
    console.log(`[Ingestion] Normalized ${normalizedModels.length} foundation models.`);

    console.log('[Ingestion] Normalizing arena agents...');
    const normalizedAgents = normalizeArenaAgents(rawAgentRows);
    console.log(`[Ingestion] Normalized ${normalizedAgents.length} arena agents.`);

    console.log('[Ingestion] Normalizing official MCP servers...');
    const normalizedMcps = normalizeMCPServers(rawMcpServers);
    console.log(`[Ingestion] Normalized ${normalizedMcps.length} unique official MCP servers.`);

    console.log('[Ingestion] Normalizing AI tools...');
    const normalizedTools = normalizeRegistryTools(rawToolPackages, AI_TOOLS_DATA);
    console.log(`[Ingestion] Normalized ${normalizedTools.length} AI tools.`);

    console.log('[Ingestion] Normalizing AI companies with HF enrichment...');
    const normalizedCompanies = normalizeCompanies(COMPANIES_DATA, hfOrgStats);
    console.log(`[Ingestion] Normalized ${normalizedCompanies.length} AI companies.`);

    // Calculate centralized rankings for models across 5 perspectives
    const perspectives = ['overall', 'risers', 'adopted', 'speed', 'open_weights'];
    const rankingsByPerspective = {};

    for (const p of perspectives) {
      const ranked = rankLeaderboard(normalizedModels, p);
      rankingsByPerspective[p] = ranked;
      console.log(`[Ingestion] Perspective [${p}]: ${ranked.returnedCount} top models ranked.`);
    }

    // Sync static files so build and client bundle stay fresh
    try {
      if (normalizedAgents.length > 0) {
        const agentsFilePath = path.resolve(process.cwd(), 'src', 'data', 'agentsData.js');
        const agentsContent = `// AI Orbit Official Agents Dataset\n// Sourced from LMSYS Arena Agent official benchmark dataset\n// Total Verified Agents: ${normalizedAgents.length}\n// Last Synced: ${new Date().toISOString()}\n\nexport const AGENT_CATEGORIES = [\n  "All",\n  "AI Agents",\n  "Autonomous SWE",\n  "Coding Agents"\n];\n\nexport const AI_AGENTS_DATA = ${JSON.stringify(normalizedAgents, null, 2)};\n`;
        fs.writeFileSync(agentsFilePath, agentsContent, 'utf-8');
      }

      if (normalizedMcps.length > 0) {
        const mcpFilePath = path.resolve(process.cwd(), 'src', 'data', 'mcpData.js');
        const mcpContent = `// AI Orbit Official MCP Registry Dataset\n// Sourced directly from Official Model Context Protocol Registry (GET /v0.1/servers)\n// Total Registered Official Servers: ${normalizedMcps.length}\n// Last Synced: ${new Date().toISOString()}\n\nexport const MCP_CATEGORIES = [\n  "All",\n  "MCP",\n  "Developer Tools",\n  "Databases",\n  "Search & Web"\n];\n\nexport const MCP_DATA = ${JSON.stringify(normalizedMcps, null, 2)};\n`;
        fs.writeFileSync(mcpFilePath, mcpContent, 'utf-8');
      }

      if (normalizedCompanies.length > 0) {
        const companiesFilePath = path.resolve(process.cwd(), 'src', 'data', 'companiesData.js');
        // Preserve the COMPANY_CATEGORIES and COMPANY_PERSPECTIVES exports at the top
        const companiesContent = `// AI Orbit Official Companies Dataset\n// Curated AI ecosystem company data enriched with live Hugging Face model ecosystem signals\n// Total Companies: ${normalizedCompanies.length}\n// Last Synced: ${new Date().toISOString()}\n\nexport const COMPANY_CATEGORIES = [\n  "All",\n  "Foundation Models",\n  "AI Infrastructure",\n  "AI Code & DevTools",\n  "AI Search & Assistants",\n  "Voice & Multimodal",\n  "Enterprise & Productivity",\n  "Creative & Video AI"\n];\n\nexport const COMPANY_PERSPECTIVES = [\n  { id: "overall", label: "Overall", icon: "Trophy", description: "Composite ecosystem prominence and market strength" },\n  { id: "funding", label: "Funding", icon: "DollarSign", description: "Disclosed venture and private capital raised" },\n  { id: "valuation", label: "Valuation", icon: "Gem", description: "Estimated enterprise valuation or market capitalization" },\n  { id: "growth", label: "Growth", icon: "TrendingUp", description: "Headcount velocity, web momentum, and adoption trajectory" }\n];\n\nexport const COMPANIES_DATA = ${JSON.stringify(normalizedCompanies, null, 2)};\n`;
        fs.writeFileSync(companiesFilePath, companiesContent, 'utf-8');
        console.log(`[Ingestion] Updated companiesData.js with ${normalizedCompanies.length} enriched companies.`);
      }
    } catch (writeErr) {
      console.warn('[Ingestion] Static file write warning:', writeErr.message);
    }

    // Save to SQLite database and export public snapshot
    console.log('[Ingestion] Saving models, snapshots, and rankings to SQLite database...');
    saveIngestionResults(normalizedModels, rankingsByPerspective, {
      agents: normalizedAgents,
      mcps: normalizedMcps,
      tools: normalizedTools,
      companies: normalizedCompanies
    });

    console.log('====================================================');
    console.log('[Ingestion] 5-Module Data Ingestion completed successfully!');
    console.log('====================================================');

    return {
      success: true,
      timestamp: new Date().toISOString(),
      counts: {
        models: normalizedModels.length,
        agents: normalizedAgents.length,
        mcp: normalizedMcps.length,
        tools: normalizedTools.length,
        companies: normalizedCompanies.length,
        perspectives: {
          overall: rankingsByPerspective.overall.returnedCount,
          risers: rankingsByPerspective.risers.returnedCount,
          adopted: rankingsByPerspective.adopted.returnedCount,
          speed: rankingsByPerspective.speed.returnedCount,
          open_weights: rankingsByPerspective.open_weights.returnedCount
        }
      }
    };
  } catch (err) {
    console.error('====================================================');
    console.error('[Ingestion] PIPELINE EXECUTION FAILED:', err.message);
    console.error('====================================================');

    try {
      const db = getDb();
      db.prepare(`
        INSERT INTO ingestion_logs (status, source, models_count, error_message, timestamp)
        VALUES ('FAILED', '5-Module Ingestion Pipeline', 0, ?, ?)
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
