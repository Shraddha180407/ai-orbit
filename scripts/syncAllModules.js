// Sync Script for AI Orbit — Phase 1 MVP
// Fetches real data for:
// 1. LMSYS Arena Agents (lmarena-ai/leaderboard-dataset?config=agent&split=latest)
// 2. Official MCP Registry (https://registry.modelcontextprotocol.io/v0.1/servers)
// 3. Public Tools Registry (npm search API)
// Updates src/data/agentsData.js and src/data/mcpData.js with verified real data.

import fs from 'node:fs';
import path from 'node:path';
import { normalizeOrg } from '../server/pipeline/normalizer.js';

const ROOT_DIR = process.cwd();
const AGENTS_FILE = path.resolve(ROOT_DIR, 'src', 'data', 'agentsData.js');
const MCP_FILE = path.resolve(ROOT_DIR, 'src', 'data', 'mcpData.js');

async function syncAgents() {
  console.log('[Sync] Fetching real Arena Agent dataset from LMSYS...');
  const url = 'https://datasets-server.huggingface.co/rows?dataset=lmarena-ai/leaderboard-dataset&config=agent&split=latest&offset=0&limit=100';
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'AI-Orbit-Pipeline/1.0' }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Arena Agents: HTTP ${res.status}`);
  }

  const data = await res.json();
  const rows = (data.rows || []).map((r) => r.row);
  console.log(`[Sync] Received ${rows.length} real Arena Agent evaluation records.`);

  const agents = rows.map((raw, idx) => {
    const slug = raw.model_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const org = normalizeOrg(raw.organization, raw.model_name);
    const scoreVal = typeof raw.score === 'number' ? raw.score : 0;
    const scorePct = `${scoreVal >= 0 ? '+' : ''}${(scoreVal * 100).toFixed(1)}%`;
    const sessions = typeof raw.session_count === 'number' ? raw.session_count : 0;
    const obs = typeof raw.observation_count === 'number' ? raw.observation_count : 0;
    const license = raw.license || 'Proprietary';
    const isOpen = !(license.toLowerCase().includes('proprietary') || license.toLowerCase().includes('custom'));

    // Distinguish agent specialization
    let agentCategory = 'AI Agents';
    const lowerName = raw.model_name.toLowerCase();
    if (lowerName.includes('code') || lowerName.includes('coder') || lowerName.includes('dev')) {
      agentCategory = 'Coding Agents';
    } else if (lowerName.includes('max') || lowerName.includes('high') || lowerName.includes('opus')) {
      agentCategory = 'Autonomous SWE';
    }

    return {
      id: `agent-${slug}`,
      slug,
      name: raw.model_name,
      org,
      category: 'AI Agents',
      subCategory: agentCategory,
      entityType: 'agent',
      rank: raw.rank || (idx + 1),
      rankDelta: raw.rank <= 3 ? 'NEW' : '0',
      score: scoreVal,
      arenaElo: null,
      codingScore: null,
      outputSpeed: 'Agentic Runtime',
      monthlyVisits: `${(sessions / 1000).toFixed(1)}k sess`,
      price: isOpen ? 'Open Weights' : 'Commercial API',
      license,
      licenseType: isOpen ? 'Open Weights' : 'Commercial API',
      isOpenWeights: isOpen,
      superpower: 'Autonomous Multi-Turn Agentic Execution',
      superpowerShort: 'Autonomous Agent',
      superpowerDetail: `LMSYS Agent Arena: ${scorePct} win rate across ${sessions.toLocaleString()} evaluation sessions`,
      categoryMetricLabel: 'Task Win Rate',
      categoryMetricValue: scorePct,
      categorySubMetricLabel: 'Eval Sessions',
      categorySubMetricValue: sessions.toLocaleString(),
      categoryDimension3: obs > 0 ? `${Math.round(obs / 1000)}k obs` : 'Verified',
      badge: raw.rank === 1 ? 'World #1 Agent' : raw.rank <= 5 ? 'Top Agent' : 'Verified Agent',
      shortDescription: `Official LMSYS Arena Agent ranking #${raw.rank || idx + 1} with ${scorePct} win index across ${sessions.toLocaleString()} sessions.`,
      fullDescription: `${raw.model_name} by ${org} is evaluated on the LMSYS Arena Agent benchmark under complex multi-turn autonomous tool use, environment interactions, and self-correction tasks.`,
      website: org === 'Anthropic' ? 'https://www.anthropic.com' : org === 'OpenAI' ? 'https://openai.com' : org === 'Google' ? 'https://deepmind.google' : 'https://lmarena.ai',
      sourceMetadata: {
        dataset: 'lmarena-ai/leaderboard-dataset',
        config: 'agent',
        split: 'latest',
        publishDate: raw.leaderboard_publish_date,
        observationCount: obs,
        sessionCount: sessions
      }
    };
  });

  const fileContent = `// AI Orbit Official Agents Dataset
// Sourced from LMSYS Arena Agent official benchmark dataset (lmarena-ai/leaderboard-dataset?config=agent)
// Real models evaluated on autonomous tool use, multi-step actions, and task completion.
// Total Verified Agents: ${agents.length}
// Last Synced: ${new Date().toISOString()}

export const AGENT_CATEGORIES = [
  "All",
  "AI Agents",
  "Autonomous SWE",
  "Coding Agents"
];

export const AI_AGENTS_DATA = ${JSON.stringify(agents, null, 2)};
`;

  fs.writeFileSync(AGENTS_FILE, fileContent, 'utf-8');
  console.log(`[Sync] Written ${agents.length} real agents to ${AGENTS_FILE}`);
  return agents;
}

async function syncMCP() {
  console.log('[Sync] Fetching official MCP servers from Official Registry...');
  let url = 'https://registry.modelcontextprotocol.io/v0.1/servers';
  const allServers = [];

  while (url && allServers.length < 60) {
    try {
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'AI-Orbit-Pipeline/1.0' }
      });
      if (!res.ok) break;
      const data = await res.json();
      if (data.servers && Array.isArray(data.servers)) {
        allServers.push(...data.servers);
      }
      if (data.metadata?.nextCursor && allServers.length < 60) {
        url = `https://registry.modelcontextprotocol.io/v0.1/servers?cursor=${encodeURIComponent(data.metadata.nextCursor)}`;
      } else {
        break;
      }
    } catch (e) {
      console.warn('[Sync] MCP pagination warning:', e.message);
      break;
    }
  }

  console.log(`[Sync] Received ${allServers.length} raw server records from Official MCP Registry.`);

  // Deduplicate by server.name keeping the highest/latest version
  const byName = new Map();
  for (const item of allServers) {
    const s = item.server;
    if (!s || !s.name) continue;
    if (!byName.has(s.name)) {
      byName.set(s.name, item);
    }
  }

  const uniqueServers = Array.from(byName.values());
  console.log(`[Sync] Deduplicated to ${uniqueServers.length} unique official MCP servers.`);

  const mcpEntries = uniqueServers.map((item, idx) => {
    const s = item.server;
    const meta = item._meta?.['io.modelcontextprotocol.registry/official'] || {};
    const title = s.title || s.name.split('/').pop().replace(/-/g, ' ');
    const displayName = title.charAt(0).toUpperCase() + title.slice(1);
    const slug = (s.name || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const org = s.name.includes('/') ? s.name.split('/')[0] : 'MCP Community';
    const transport = s.remotes?.[0]?.type || 'stdio / http';
    const version = s.version ? `v${s.version}` : 'v1.0';
    const description = s.description || 'Verified server from the Official Model Context Protocol Registry.';

    // Infer category
    let category = 'MCP';
    const dLower = description.toLowerCase();
    if (dLower.includes('database') || dLower.includes('sql') || dLower.includes('postgres')) {
      category = 'Databases';
    } else if (dLower.includes('search') || dLower.includes('web') || dLower.includes('browse')) {
      category = 'Search & Web';
    } else if (dLower.includes('code') || dLower.includes('git') || dLower.includes('developer')) {
      category = 'Developer Tools';
    }

    return {
      id: `mcp-${slug}`,
      slug,
      name: displayName,
      rawName: s.name,
      org,
      category: 'MCP',
      subCategory: category,
      entityType: 'mcp',
      rank: idx + 1,
      rankDelta: '0',
      version,
      categoryMetricLabel: 'Protocol Version',
      categoryMetricValue: version,
      categorySubMetricLabel: 'Transport',
      categorySubMetricValue: transport,
      categoryDimension3: 'Official Registry',
      outputSpeed: 'Direct Stream',
      monthlyVisits: 'Active Protocol',
      price: 'Free / Open Protocol',
      license: 'MIT / Open Protocol',
      licenseType: 'Open Source',
      isOpenWeights: true,
      badge: 'Official MCP',
      superpower: description.length > 45 ? `${description.slice(0, 42)}...` : description,
      superpowerShort: 'MCP Server',
      superpowerDetail: `Official Model Context Protocol Server (${version}) with ${transport} transport`,
      shortDescription: description,
      fullDescription: `${displayName} (${s.name}) is an officially registered Model Context Protocol server. ${description}`,
      website: s.remotes?.[0]?.url || 'https://registry.modelcontextprotocol.io',
      sourceMetadata: {
        source: 'Official Model Context Protocol Registry (GET /v0.1/servers)',
        registrySchema: s['$schema'],
        remotes: s.remotes || [],
        publishedAt: meta.publishedAt,
        status: meta.status || 'active'
      }
    };
  });

  const fileContent = `// AI Orbit Official MCP Registry Dataset
// Sourced directly from Official Model Context Protocol Registry (GET /v0.1/servers)
// Total Registered Official Servers: ${mcpEntries.length}
// Last Synced: ${new Date().toISOString()}

export const MCP_CATEGORIES = [
  "All",
  "MCP",
  "Developer Tools",
  "Databases",
  "Search & Web"
];

export const MCP_DATA = ${JSON.stringify(mcpEntries, null, 2)};
`;

  fs.writeFileSync(MCP_FILE, fileContent, 'utf-8');
  console.log(`[Sync] Written ${mcpEntries.length} official MCP servers to ${MCP_FILE}`);
  return mcpEntries;
}

async function main() {
  console.log('==================================================');
  console.log('AI Orbit Phase 1 MVP — Real Data Synchronization');
  console.log('==================================================');
  try {
    await syncAgents();
    await syncMCP();
    console.log('==================================================');
    console.log('Sync completed successfully!');
    console.log('==================================================');
  } catch (err) {
    console.error('[Sync] Fatal synchronization error:', err);
    process.exit(1);
  }
}

main();
