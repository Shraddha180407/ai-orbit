// AI Orbit Official Primary Ecosystem Leaderboard Data
// Meticulously separated into AI_MODELS_DATA (modelsData.js) and AI_TOOLS_DATA (toolsData.js)
// Exports all datasets, categories, and perspective configuration options.
// Last Updated: March 2026

import { AI_MODELS_DATA, MODEL_CATEGORIES } from './modelsData.js';
import { AI_TOOLS_DATA, TOOL_CATEGORIES } from './toolsData.js';

export { AI_MODELS_DATA, MODEL_CATEGORIES };
export { AI_TOOLS_DATA, TOOL_CATEGORIES };

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
// Combines frontier AI Models and flagship AI Tools into an integrated ecosystem ranking
const composeLeaderboard = () => {
  const models = AI_MODELS_DATA.map((m) => ({
    ...m,
    modelRank: m.rank
  }));

  const tools = AI_TOOLS_DATA.map((t) => ({
    ...t,
    toolRank: t.rank
  }));

  // Flagship tools that sit alongside frontier models in overall prominence
  const flagshipToolIds = [
    "cursor-composer",
    "github-copilot",
    "windsurf-codeium",
    "v0-by-vercel",
    "supermaven",
    "perplexity-pro",
    "google-notebooklm",
    "midjourney-web",
    "elevenlabs-studio",
    "notion-ai",
    "cognition-devin",
    "figma-ai"
  ];

  const flagshipTools = tools.filter((t) => flagshipToolIds.includes(t.id));
  const otherTools = tools.filter((t) => !flagshipToolIds.includes(t.id));

  const combined = [];
  let mIdx = 0;
  let fIdx = 0;

  // Tier 1: Top 6 Models
  while (mIdx < 6 && mIdx < models.length) {
    combined.push(models[mIdx++]);
  }
  // Tier 1 Flagship Tools: Cursor, GitHub Copilot
  while (fIdx < 2 && fIdx < flagshipTools.length) {
    combined.push(flagshipTools[fIdx++]);
  }
  // Tier 2: Next 6 Models (7-12)
  while (mIdx < 12 && mIdx < models.length) {
    combined.push(models[mIdx++]);
  }
  // Tier 2 Flagship Tools: Windsurf, v0, Supermaven
  while (fIdx < 5 && fIdx < flagshipTools.length) {
    combined.push(flagshipTools[fIdx++]);
  }
  // Tier 3: Next 8 Models (13-20)
  while (mIdx < 20 && mIdx < models.length) {
    combined.push(models[mIdx++]);
  }
  // Tier 3 Flagship Tools: Perplexity, NotebookLM, Midjourney, ElevenLabs, Notion, Devin, Figma
  while (fIdx < flagshipTools.length) {
    combined.push(flagshipTools[fIdx++]);
  }
  // Remaining Models
  while (mIdx < models.length) {
    combined.push(models[mIdx++]);
  }
  // Remaining Tools
  otherTools.forEach((t) => combined.push(t));

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
