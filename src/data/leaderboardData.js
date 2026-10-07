// AI Orbit Official Primary Ecosystem Leaderboard Data
// Meticulously separated into AI_MODELS_DATA (modelsData.js) and AI_TOOLS_DATA (toolsData.js)
// Exports all datasets, categories, and perspective configuration options.
// Last Updated: March 2026

import { AI_MODELS_DATA, MODEL_CATEGORIES } from './modelsData.js';
import { AI_TOOLS_DATA, TOOL_CATEGORIES } from './toolsData.js';
import { AI_AGENTS_DATA, AGENT_CATEGORIES } from './agentsData.js';
import { MCP_DATA, MCP_CATEGORIES } from './mcpData.js';

export { AI_MODELS_DATA, MODEL_CATEGORIES };
export { AI_TOOLS_DATA, TOOL_CATEGORIES };
export { AI_AGENTS_DATA, AGENT_CATEGORIES };
export { MCP_DATA, MCP_CATEGORIES };

// Combined unique categories for universal filters
export const LEADERBOARD_CATEGORIES = [
  "All",
  // Core Model Categories
  "Reasoning",
  "Chat / General LLM",
  "Coding",
  "Open Weight",
  "Multimodal",
  "Image",
  "Video",
  "Audio / Voice",
  "Embeddings",
  // Core Tool Categories
  "Coding / Developer",
  "Research",
  "Writing",
  "Image Generation",
  "Voice / Audio",
  "Design",
  "Productivity",
  "Marketing",
  "AI Agents",
  "Automation"
];

// Unified composite ranking for All Ecosystem View
// Ranks cross-domain entities by Domain Percentile Positioning (0-100)
// Ensures top models, flagship tools, premier agents, and key MCP servers are fairly interleaved
const composeLeaderboard = () => {
  const models = AI_MODELS_DATA.map((m, idx) => ({
    ...m,
    domainRank: idx + 1,
    domainType: 'model',
    domainPercentile: Math.max(0.1, Math.min(99.9, Math.round((1 - idx / AI_MODELS_DATA.length) * 1000) / 10))
  }));

  const tools = AI_TOOLS_DATA.map((t, idx) => ({
    ...t,
    domainRank: idx + 1,
    domainType: 'tool',
    domainPercentile: Math.max(0.1, Math.min(99.9, Math.round((1 - idx / AI_TOOLS_DATA.length) * 1000) / 10))
  }));

  const agents = AI_AGENTS_DATA.map((a, idx) => ({
    ...a,
    domainRank: idx + 1,
    domainType: 'agent',
    domainPercentile: Math.max(0.1, Math.min(99.9, Math.round((1 - idx / AI_AGENTS_DATA.length) * 1000) / 10))
  }));

  const mcps = MCP_DATA.map((c, idx) => ({
    ...c,
    domainRank: idx + 1,
    domainType: 'mcp',
    domainPercentile: Math.max(0.1, Math.min(99.9, Math.round((1 - idx / MCP_DATA.length) * 1000) / 10))
  }));

  // Combine and sort by domain percentile descending
  const combined = [...models, ...tools, ...agents, ...mcps];
  combined.sort((a, b) => {
    if (b.domainPercentile !== a.domainPercentile) {
      return b.domainPercentile - a.domainPercentile;
    }
    // Priority tie-breaker: model -> tool -> agent -> mcp
    const priority = { model: 4, tool: 3, agent: 2, mcp: 1 };
    return (priority[b.domainType] || 0) - (priority[a.domainType] || 0);
  });

  // Assign sequential composite ecosystem rank 1..N
  return combined.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

export const LEADERBOARD_DATA = composeLeaderboard();

export const SORT_OPTIONS = [
  { label: "Sort by: Rank (Arena Elo)", value: "rank" },
  { label: "Sort by: Monthly Visits", value: "visits" },
  { label: "Sort by: Growth Rate", value: "growth" },
  { label: "Sort by: Newest Releases", value: "newest" }
];

export const PERSPECTIVE_OPTIONS = [
  { id: "overall", label: "Overall", icon: "Trophy", description: "LMSYS Arena Elo & benchmark evaluation" },
  { id: "risers", label: "Risers & Momentum", icon: "TrendingUp", description: "Fastest growth rate & climbing ranks" },
  { id: "adopted", label: "Most Adopted", icon: "Flame", description: "Highest estimated monthly usage & reach" },
  { id: "speed", label: "Speed & Efficiency", icon: "Zap", description: "Maximum token throughput (tok/s) & low latency" },
  { id: "open_weights", label: "Open Weights", icon: "Unlock", description: "Publicly accessible & self-hostable model weights" }
];
