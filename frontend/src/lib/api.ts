/**
 * The Hono/Workers backend's origin — every real data fetch and mutation
 * goes here, never direct DB access from this app.
 *
 * Falls back to the production API, same as frontend/src/app/page.tsx's
 * own API_URL — that fallback is what's kept the homepage working
 * whether or not NEXT_PUBLIC_API_URL is actually configured in Cloudflare
 * Pages' dashboard. This was the only code path in the app that didn't
 * have it, and was throwing at module load on every /news request in
 * production as a result.
 */
function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url.startsWith("http") && url !== "undefined") {
    return url.replace(/\/$/, "");
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}

/** Used by the client components (CommentBox, PublisherIcon, SaveButton, VoteButtons) — unchanged. */
export const API_URL = resolveApiUrl();

// ---------------------------------------------------------------------------
// Leaderboard API helpers
// ---------------------------------------------------------------------------

export async function fetchLeaderboardTools(category?: string): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/leaderboard/tools`);
  if (category && category !== "All Categories") url.searchParams.set("category", category);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchLeaderboardModels(category?: string): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/leaderboard/models`);
  if (category && category !== "All Categories") url.searchParams.set("category", category);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchLeaderboardCompanies(): Promise<any[]> {
  const url = `${API_URL}/api/v1/leaderboard/companies`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllCompanies(): Promise<any[]> {
  const url = `${API_URL}/api/v1/companies`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchCompanyDetails(slug: string): Promise<any> {
  const url = `${API_URL}/api/v1/companies/${slug}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return null;
  return res.json();
}

import type { AIModel, ModelsListResponse, ModelsSortOption } from "./types";

export interface ModelsQuery {
  search?: string;
  provider?: string;
  modality?: string;
  creator?: string;
  subCategory?: string;
  sort?: ModelsSortOption;
  page?: number;
  limit?: number;
}

export async function fetchModels(params: ModelsQuery = {}): Promise<ModelsListResponse> {
  const url = new URL(`${API_URL}/api/v1/models`);
  if (params.search) url.searchParams.set("search", params.search);
  if (params.provider) url.searchParams.set("provider", params.provider);
  if (params.modality) url.searchParams.set("modality", params.modality);
  if (params.creator) url.searchParams.set("creator", params.creator);
  if (params.subCategory) url.searchParams.set("subCategory", params.subCategory);
  if (params.sort) url.searchParams.set("sort", params.sort);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));

  const empty: ModelsListResponse = {
    items: [],
    pagination: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,
      total: 0,
      totalPages: 1,
      hasMore: false,
    },
    filters: { providers: [], modalities: [] },
  };

  const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return empty;

  const data = await res.json();
  // Tolerate legacy array responses during rollout.
  if (Array.isArray(data)) {
    return {
      items: data as AIModel[],
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
        hasMore: false,
      },
      filters: { providers: [], modalities: [] },
    };
  }
  return data as ModelsListResponse;
}

/** @deprecated Prefer fetchModels — kept for callers that only need the first page's items. */
export async function fetchAllModels(): Promise<AIModel[]> {
  const data = await fetchModels({ page: 1, limit: 100 });
  return data.items;
}

export async function fetchModelById(id: string): Promise<import("./types").ModelDetail | null> {
  const url = `${API_URL}/api/v1/models/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load model (${res.status})`);
  }
  return res.json();
}

export async function fetchAllNews(): Promise<any[]> {
  const url = `${API_URL}/api/v1/news`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

import { Repository, RepositoryListResponse, RepositoryDetailResponse, RepositoryOwnerListItem, RepositorySubCategory } from "./types";
import type { ModelSubCategory } from "./types";

export interface FetchRepositoriesOptions {
  limit?: number;
  cursor?: string | null;
  sort?: string;
  language?: string;
  topic?: string;
  q?: string;
  owner?: string;
  subCategory?: string;
}

export async function fetchRepositories(options: FetchRepositoriesOptions = {}): Promise<RepositoryListResponse> {
  const { limit, cursor, sort, language, topic, q, owner, subCategory } = options;

  const url = new URL(`${API_URL}/api/v1/repositories`);
  if (limit) url.searchParams.set("limit", limit.toString());
  if (cursor) url.searchParams.set("cursor", cursor);
  if (sort) url.searchParams.set("sort", sort);
  if (language) url.searchParams.set("language", language);
  if (topic) url.searchParams.set("topic", topic);
  if (q) url.searchParams.set("q", q);
  if (owner) url.searchParams.set("owner", owner);
  if (subCategory) url.searchParams.set("subCategory", subCategory);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) {
    return {
      items: [],
      nextCursor: null,
      hasMore: false,
      total: 0
    };
  }
  return res.json();
}

export async function fetchRepositoryBySlug(slug: string): Promise<RepositoryDetailResponse | null> {
  const url = `${API_URL}/api/v1/repositories/${slug}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllRepos(): Promise<Repository[]> {
  try {
    const data = await fetchRepositories();
    // Defensive: fetchRepositories() should always resolve to
    // { items: [...] }, but guard against a malformed/unexpected response
    // shape so this can never crash repos.forEach() downstream again.
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.error("Failed to fetch repositories:", e);
    return [];
  }
}

export async function fetchRepositorySubCategories(): Promise<RepositorySubCategory[]> {
  const url = `${API_URL}/api/v1/repositories/subcategories`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchModelSubCategories(): Promise<ModelSubCategory[]> {
  const url = `${API_URL}/api/v1/models/subcategories`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMCPSubCategories(): Promise<import("./types").MCPSubCategory[]> {
  const url = `${API_URL}/api/v1/mcps/subcategories`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDeviceSubCategories(): Promise<import("./types").DeviceSubCategory[]> {
  const url = `${API_URL}/api/v1/devices/subcategories`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export interface FetchMCPOptions {
  subCategory?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  type?: string;
}

export async function fetchMCPItems(options: FetchMCPOptions = {}): Promise<{ items: any[]; total: number; page: number; totalPages: number }> {
  const url = new URL(`${API_URL}/api/v1/mcps`);
  if (options.subCategory) url.searchParams.set("subCategory", options.subCategory);
  if (options.category) url.searchParams.set("category", options.category);
  if (options.search) url.searchParams.set("search", options.search);
  if (options.sortBy) url.searchParams.set("sortBy", options.sortBy);
  if (options.type) url.searchParams.set("type", options.type);
  if (options.page) url.searchParams.set("page", String(options.page));
  if (options.limit) url.searchParams.set("limit", String(options.limit));

  const empty = { items: [], total: 0, page: options.page ?? 1, totalPages: 1 };
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
    if (!res.ok) return empty;
    const data = await res.json();
    return data.data || empty;
  } catch {
    return empty;
  }
}

export async function fetchAllVideos(): Promise<any[]> {
  const url = `${API_URL}/api/v1/videos`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllRobots(): Promise<any[]> {
  const url = `${API_URL}/api/v1/robots`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchRobotById(idOrSlug: string): Promise<any | null> {
  const url = `${API_URL}/api/v1/robots/${idOrSlug}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return null;
  return res.json();
}

export async function fetchAllDevices(options: { subCategory?: string } = {}): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/devices`);
  if (options.subCategory) url.searchParams.set("subCategory", options.subCategory);
  const res = await fetch(url.toString(), { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDeviceById(id: string): Promise<any | null> {
  const url = `${API_URL}/api/v1/devices/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return null;
  return res.json();
}

// ---------------------------------------------------------------------------
// Global search API helpers (cross-entity autocomplete + popular terms)
// ---------------------------------------------------------------------------

export interface RealSearchSuggestion {
  id: string;
  type: "tool" | "company" | "model" | "repository" | "robot" | "device";
  title: string;
  category: string;
  slug: string | null;
  logoUrl?: string | null;
}

export async function fetchSearchAutocomplete(q: string): Promise<RealSearchSuggestion[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];
  const url = `${API_URL}/api/v1/search/autocomplete?q=${encodeURIComponent(trimmed)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return data.suggestions ?? [];
}

export async function fetchPopularSearches(): Promise<string[]> {
  const url = `${API_URL}/api/v1/search/popular`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  const data = await res.json();
  return data.popular ?? [];
}

/** Featured tools for the search dropdown's empty-query "Featured" section. */
export async function fetchFeaturedTools(): Promise<RealSearchSuggestion[]> {
  const url = `${API_URL}/api/v1/search/featured`;
  const res = await fetch(url, { next: { revalidate: 300 } } as RequestInit);
  if (!res.ok) return [];
  const data = await res.json();
  return data.featured ?? [];
}

/**
 * Server-side-only origin, for the two News page.tsx server components.
 * api.aiorbit.club is a Cloudflare-proxied custom domain; a Pages Function
 * (this app's server-side render) fetching another Cloudflare-proxied zone
 * on the same account hits Cloudflare's same-account loop-prevention and
 * fails — confirmed via the news module's own build succeeding while every
 * server-side render of it failed in production. The Worker's own
 * `*.workers.dev` subdomain bypasses that proxy layer entirely (same
 * pattern already proven working in GraphOne's production app). Client-side
 * calls (API_URL above) are unaffected — a real browser request, not a
 * same-account Cloudflare-to-Cloudflare hop — so they're left untouched.
 */
function resolveServerApiUrl(): string {
  const raw = process.env.NEWS_SERVER_API_URL;
  if (raw && raw !== "undefined") {
    const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
    return withScheme.replace(/\/$/, "");
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}

export const SERVER_API_URL = resolveServerApiUrl();

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function fetchTasks(category?: string): Promise<any> {
  const url = new URL(`${API_URL}/api/v1/tasks`);
  if (category) url.searchParams.set("category", category);
  
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return { tasks: [], total: 0 };
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return { tasks: [], total: 0 };
  }
}

export async function toggleTaskSubscription(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tasks/${slug}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.ok;
  } catch (err) {
    console.error("Failed to subscribe to task:", err);
    return false;
  }
}

export async function fetchRepositoryOwners(): Promise<RepositoryOwnerListItem[]> {
  const url = `${API_URL}/api/v1/repositories/owners`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

// ---------------------------------------------------------------------------
// MCP API Fetch Helpers
// ---------------------------------------------------------------------------
import type { MCPListResponse } from "./types";

export interface MCPQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  type?: "SERVER" | "CLIENT";
}

export async function fetchMCPItems(params: MCPQuery = {}): Promise<MCPListResponse> {
  const url = new URL(`${API_URL}/api/v1/mcps`);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.type) url.searchParams.set("type", params.type);

  const empty: MCPListResponse = {
    items: [],
    total: 0,
    page: params.page ?? 1,
    totalPages: 1,
  };

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return empty;
    const responseJson = await res.json();
    if (responseJson && responseJson.success && responseJson.data) {
      return responseJson.data;
    }
    return empty;
  } catch (err) {
    console.error("Failed to fetch MCP items:", err);
    return empty;
  }
}

export async function fetchMCPItemBySlug(slug: string): Promise<MCPItem | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/mcps/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const responseJson = await res.json();
    if (responseJson && responseJson.success && responseJson.data) {
      return responseJson.data;
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch MCP item ${slug}:`, err);
    return null;
  }
}
