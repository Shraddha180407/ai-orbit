/**
 * leaderboardData.ts
 * Adapts the real AI Orbit datasets (models, tools, agents, mcp, companies)
 * into the shapes expected by LeaderboardClient.tsx.
 *
 * Source data files are plain .js — imported via allowJs / require.
 * No production DB credentials needed: this is the local-dev real dataset.
 */

// ─── Raw imports from the real data files ────────────────────────────────────
// @ts-ignore – JS data files without type declarations
import { AI_MODELS_DATA } from "@/data/modelsData.js";
// @ts-ignore
import { AI_TOOLS_DATA } from "@/data/toolsData.js";
// @ts-ignore
import { AI_AGENTS_DATA } from "@/data/agentsData.js";
// @ts-ignore
import { MCP_DATA } from "@/data/mcpData.js";
// @ts-ignore
import { COMPANIES_DATA } from "@/data/companiesData.js";

// ─── LeaderboardClient type shapes ───────────────────────────────────────────

export type LeaderboardTool = {
  id: string;
  name: string;
  category: string;
  tags: string;
  rank: number;
  growth: number;
  votes: number;
  rating: number;
  saves: number;
  url: string;
  description: string;
  pricing: string;
  visits: string;
  addedDate: string;
  logoUrl?: string;
};

export type LeaderboardModel = {
  id: string;
  name: string;
  provider: string;
  category: string;
  rank: number;
  growth: number;
  contextWindow: string;
  pricing: string;
  eloRating: number;
  benchmarkScore: number;
  openSource: boolean;
  votes: number;
  rating: number;
  saves: number;
  description: string;
  visits: string;
  url: string;
  logoUrl?: string;
};

export type LeaderboardCompany = {
  id: string;
  name: string;
  rank: number;
  growth: number;
  funding: string;
  headquarters: string;
  productsCount: number;
  modelsCount: number;
  votes: number;
  rating: number;
  saves: number;
  description: string;
  visits: string;
  url: string;
  logoUrl?: string;
};

// ─── Helper: parse "+12.5%" / "-3%" → number ─────────────────────────────────
function parseGrowthPct(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (!raw) return 0;
  const str = String(raw).replace(/[^0-9.\-]/g, "");
  return parseFloat(str) || 0;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

export function getLeaderboardModels(): LeaderboardModel[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (AI_MODELS_DATA as any[]).map((m) => ({
    id: m.id ?? m.slug,
    name: m.name,
    provider: m.org ?? "",
    category: m.category ?? "LLM",
    rank: m.rank ?? 0,
    growth: parseGrowthPct(m.growth),
    contextWindow: m.contextWindow ?? "N/A",
    pricing: m.price ?? "N/A",
    eloRating: m.arenaElo ?? 0,
    benchmarkScore: parseFloat(String(m.codingScore ?? "0").replace("%", "")) || 0,
    openSource: m.isOpenWeights === true,
    votes: 0,
    rating: 5,
    saves: 0,
    description: m.shortDescription ?? "",
    visits: m.monthlyVisits ?? "N/A",
    url: m.website ?? "#",
    logoUrl: undefined,
  }));
}

export function getLeaderboardTools(entityType: "tool" | "agent" | "mcp" = "tool"): LeaderboardTool[] {
  let source: unknown[];
  if (entityType === "agent") source = AI_AGENTS_DATA as unknown[];
  else if (entityType === "mcp") source = MCP_DATA as unknown[];
  else source = AI_TOOLS_DATA as unknown[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (source as any[]).map((t) => ({
    id: t.id ?? t.slug,
    name: t.name ?? t.rawName,
    category: t.category ?? "AI Tool",
    tags: JSON.stringify(
      Array.from(new Set([t.badge, t.superpowerShort].filter(Boolean)))
    ),
    rank: t.rank ?? 0,
    growth: parseGrowthPct(t.growth ?? t.growthRate),
    votes: 0,
    rating: 4,
    saves: 0,
    url: t.website ?? "#",
    description: t.shortDescription ?? "",
    pricing: t.price ?? t.licenseType ?? "Free",
    visits: t.monthlyVisits ?? "N/A",
    addedDate: new Date().toISOString(),
    logoUrl: undefined,
  }));
}

export function getLeaderboardCompanies(): LeaderboardCompany[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (COMPANIES_DATA as any[]).map((c) => ({
    id: c.id ?? c.slug,
    name: c.name,
    rank: c.rank ?? 0,
    growth: parseGrowthPct(c.growthRate ?? c.growth),
    funding: c.funding ?? "N/A",
    headquarters: c.headquarters ?? "N/A",
    productsCount: 0,
    modelsCount: 0,
    votes: 0,
    rating: 5,
    saves: 0,
    description: c.shortDescription ?? "",
    visits: c.webVisits ?? "N/A",
    url: c.website ?? "#",
    logoUrl: undefined,
  }));
}
