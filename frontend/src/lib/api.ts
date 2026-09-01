import { cachedFetchJson, prefetchUrl, setInCache, getFromCache } from "./api-cache";
export { cachedFetchJson, prefetchUrl, setInCache, getFromCache };

/**
 * The Hono/Workers backend's origin — every real data fetch and mutation
 * goes here, never direct DB access from this app.
 */
function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url.startsWith("http") && url !== "undefined") {
    const isLocalUrl = url.includes("localhost") || url.includes("127.0.0.1");
    const isNonLocalClient = typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1";
    if (!(isLocalUrl && isNonLocalClient)) {
      return url.replace(/\/$/, "");
    }
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8787";
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}

/** Used by the client components (CommentBox, PublisherIcon, SaveButton, VoteButtons). */
export const API_URL = resolveApiUrl();

export async function fetchJsonSafe<T>(url: string | URL, fallback: T): Promise<T> {
  return cachedFetchJson<T>(url, fallback, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchToolDetails(slug: string): Promise<any> {
  if (!slug) return null;
  const safeSlug = encodeURIComponent(slug.trim());
  const url = `${API_URL}/api/v1/tools/${safeSlug}`;
  return cachedFetchJson<any>(url, null, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchAllTools(page = 1, category?: string): Promise<any> {
  const url = new URL(`${API_URL}/api/v1/tools`);
  url.searchParams.set("page", String(page));
  if (category) url.searchParams.set("category", category);
  return cachedFetchJson<any>(url.toString(), { tools: [], totalPages: 1, page }, { ttlMs: 15 * 60 * 1000 });
}

// ---------------------------------------------------------------------------
// Leaderboard API helpers
// ---------------------------------------------------------------------------

export async function fetchLeaderboardTools(category?: string): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/leaderboard/tools`);
  if (category && category !== "All Categories") url.searchParams.set("category", category);
  return cachedFetchJson<any[]>(url.toString(), [], { ttlMs: 15 * 60 * 1000 });
}

export async function fetchLeaderboardModels(category?: string): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/leaderboard/models`);
  if (category && category !== "All Categories") url.searchParams.set("category", category);
  return cachedFetchJson<any[]>(url.toString(), [], { ttlMs: 15 * 60 * 1000 });
}

export async function fetchLeaderboardCompanies(): Promise<any[]> {
  return cachedFetchJson<any[]>(`${API_URL}/api/v1/leaderboard/companies`, [], { ttlMs: 15 * 60 * 1000 });
}

export interface FetchCompaniesOptions {
  page?: number;
  pageSize?: number;
  limit?: number;
  q?: string;
  type?: string;
  category?: string;
  country?: string;
  sort?: string;
}

export interface CompaniesListResponse {
  companies: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchCompanies(options: FetchCompaniesOptions = {}): Promise<CompaniesListResponse> {
  const url = new URL(`${API_URL}/api/v1/companies`);
  if (options.page) url.searchParams.set("page", options.page.toString());
  if (options.pageSize || options.limit) url.searchParams.set("pageSize", (options.pageSize || options.limit)!.toString());
  if (options.q) url.searchParams.set("q", options.q);
  if (options.type || options.category) url.searchParams.set("type", (options.type || options.category)!);
  if (options.country && options.country !== "all") url.searchParams.set("country", options.country);
  if (options.sort) url.searchParams.set("sort", options.sort);

  const fallback: CompaniesListResponse = { companies: [], total: 0, page: 1, pageSize: 100, totalPages: 1 };
  const raw = await cachedFetchJson<any>(url.toString(), fallback, { ttlMs: 60 * 1000 });

  if (Array.isArray(raw)) {
    return { companies: raw, total: raw.length, page: 1, pageSize: raw.length, totalPages: 1 };
  }
  return raw as CompaniesListResponse;
}

export async function fetchAllCompanies(): Promise<any[]> {
  const data = await fetchCompanies({ page: 1, pageSize: 100 });
  return data.companies || [];
}

function sanitizeSlug(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/^!\[+/, '')
    .replace(/\]\(.*?\)/g, '')
    .replace(/[\!\[\]]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function fetchCompanyDetails(slug: string): Promise<any> {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug);
  const targetSlug = sanitizeSlug(decoded);
  if (!targetSlug) return null;

  const safeSlug = encodeURIComponent(targetSlug);
  const primaryUrl = `${API_URL}/api/v1/companies/${safeSlug}`;
  const res = await cachedFetchJson<any>(primaryUrl, null, { ttlMs: 15 * 60 * 1000 });
  if (res && !res.error && res.id) return res;

  if (API_URL !== "https://ai-orbit.palamrendra-pm.workers.dev") {
    const prodRes = await cachedFetchJson<any>(`https://ai-orbit.palamrendra-pm.workers.dev/api/v1/companies/${safeSlug}`, null, { ttlMs: 15 * 60 * 1000 });
    if (prodRes && !prodRes.error && prodRes.id) return prodRes;
  }

  try {
    const all = await fetchAllCompanies();
    const match = all.find((c: any) => {
      const cSlug = sanitizeSlug(c.slug || "");
      const cNameSlug = sanitizeSlug(c.name || "");
      return cSlug === targetSlug || cNameSlug === targetSlug || (cSlug && targetSlug.includes(cSlug)) || (cNameSlug && targetSlug.includes(cNameSlug));
    });
    if (match) return match;
  } catch {}

  return (res && !res.error) ? res : null;
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
      limit: params.limit ?? 100,
      total: 0,
      totalPages: 1,
      hasMore: false,
    },
    filters: { providers: [], modalities: [] },
  };

  const data = await cachedFetchJson<any>(url.toString(), empty, { ttlMs: 15 * 60 * 1000 });
  if (!data) return empty;
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
  return cachedFetchJson(url, null, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchAllNews(): Promise<any[]> {
  return cachedFetchJson(`${API_URL}/api/v1/news`, [], { ttlMs: 10 * 60 * 1000 });
}

import { Repository, RepositoryListResponse, RepositoryDetailResponse, RepositoryOwnerListItem, RepositorySubCategory } from "./types";
import type { ModelSubCategory } from "./types";

export interface FetchRepositoriesOptions {
  page?: number;
  limit?: number;
  pageSize?: number;
  cursor?: string | null;
  sort?: string;
  language?: string;
  topic?: string;
  q?: string;
  owner?: string;
  subCategory?: string;
}

export async function fetchRepositories(options: FetchRepositoriesOptions = {}): Promise<RepositoryListResponse> {
  const { page, limit, pageSize, cursor, sort, language, topic, q, owner, subCategory } = options;

  const url = new URL(`${API_URL}/api/v1/repositories`);
  if (page) url.searchParams.set("page", page.toString());
  if (limit || pageSize) url.searchParams.set("limit", (limit || pageSize)!.toString());
  if (cursor) url.searchParams.set("cursor", cursor);
  if (sort) url.searchParams.set("sort", sort);
  if (language) url.searchParams.set("language", language);
  if (topic) url.searchParams.set("topic", topic);
  if (q) url.searchParams.set("q", q);
  if (owner) url.searchParams.set("owner", owner);
  if (subCategory) url.searchParams.set("subCategory", subCategory);

  const fallback: RepositoryListResponse = { items: [], nextCursor: null, hasMore: false, total: 0 };
  return cachedFetchJson(url.toString(), fallback, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchRepositoryBySlug(slug: string): Promise<RepositoryDetailResponse | null> {
  return cachedFetchJson(`${API_URL}/api/v1/repositories/${slug}`, null, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchAllRepos(): Promise<Repository[]> {
  try {
    const data = await fetchRepositories();
    return Array.isArray(data?.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function fetchRepositorySubCategories(): Promise<RepositorySubCategory[]> {
  return cachedFetchJson(`${API_URL}/api/v1/repositories/subcategories`, [], { ttlMs: 30 * 60 * 1000 });
}

export async function fetchModelSubCategories(): Promise<ModelSubCategory[]> {
  return cachedFetchJson(`${API_URL}/api/v1/models/subcategories`, [], { ttlMs: 30 * 60 * 1000 });
}

export async function fetchMCPCategories(): Promise<import("./types").MCPCategory[]> {
  return cachedFetchJson(`${API_URL}/api/v1/mcps/categories`, [], { ttlMs: 30 * 60 * 1000 });
}

export async function fetchMCPSubCategories(categorySlug?: string): Promise<import("./types").MCPSubCategory[]> {
  const url = new URL(`${API_URL}/api/v1/mcps/subcategories`);
  if (categorySlug) url.searchParams.set("category", categorySlug);
  return cachedFetchJson(url.toString(), [], { ttlMs: 30 * 60 * 1000 });
}

export async function fetchDeviceSubCategories(): Promise<import("./types").DeviceSubCategory[]> {
  return cachedFetchJson(`${API_URL}/api/v1/devices/subcategories`, [], { ttlMs: 30 * 60 * 1000 });
}

export async function fetchAllVideos(): Promise<any[]> {
  return cachedFetchJson(`${API_URL}/api/v1/videos`, [], { ttlMs: 15 * 60 * 1000 });
}

export async function fetchAllRobots(): Promise<any[]> {
  return cachedFetchJson(`${API_URL}/api/v1/robots`, [], { ttlMs: 15 * 60 * 1000 });
}

export async function fetchRobotById(idOrSlug: string): Promise<any | null> {
  return cachedFetchJson(`${API_URL}/api/v1/robots/${idOrSlug}`, null, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchAllDevices(options: { subCategory?: string } = {}): Promise<any[]> {
  const url = new URL(`${API_URL}/api/v1/devices`);
  if (options.subCategory) url.searchParams.set("subCategory", options.subCategory);
  return cachedFetchJson(url.toString(), [], { ttlMs: 15 * 60 * 1000 });
}

export async function fetchDeviceById(id: string): Promise<any | null> {
  return cachedFetchJson(`${API_URL}/api/v1/devices/${id}`, null, { ttlMs: 15 * 60 * 1000 });
}

// ---------------------------------------------------------------------------
// Global search API helpers (cross-entity autocomplete + popular terms)
// ---------------------------------------------------------------------------

export interface RealSearchSuggestion {
  id: string;
  type: "tool" | "company" | "model" | "repository" | "robot" | "device" | "news" | "video" | "collection" | "task" | "mcp";
  title: string;
  category: string;
  slug: string | null;
  logoUrl?: string | null;
}

export async function fetchSearchAutocomplete(q: string): Promise<RealSearchSuggestion[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];
  const url = `${API_URL}/api/v1/search/autocomplete?q=${encodeURIComponent(trimmed)}`;
  const data = await cachedFetchJson<{ suggestions?: RealSearchSuggestion[] }>(url, { suggestions: [] }, { ttlMs: 10 * 60 * 1000 });
  return data.suggestions ?? [];
}

export async function fetchPopularSearches(): Promise<string[]> {
  const url = `${API_URL}/api/v1/search/popular`;
  const data = await cachedFetchJson<{ popular?: string[] }>(url, { popular: [] }, { ttlMs: 30 * 60 * 1000 });
  return data.popular ?? [];
}

/** Featured tools for the search dropdown's empty-query "Featured" section. */
export async function fetchFeaturedTools(): Promise<RealSearchSuggestion[]> {
  const url = `${API_URL}/api/v1/search/featured`;
  const data = await cachedFetchJson<{ featured?: RealSearchSuggestion[] }>(url, { featured: [] }, { ttlMs: 30 * 60 * 1000 });
  return data.featured ?? [];
}

function resolveServerApiUrl(): string {
  const raw = process.env.NEWS_SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (raw && raw !== "undefined") {
    const withScheme = /^https?:\/\//.test(raw) ? raw : (raw.includes("localhost") || raw.includes("127.0.0.1") ? `http://${raw}` : `https://${raw}`);
    return withScheme.replace(/\/$/, "");
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}

export const SERVER_API_URL = resolveServerApiUrl();

export interface FetchTasksOptions {
  category?: string;
  q?: string;
  sort?: string;
  filter?: string;
  difficulty?: string;
  pricing?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export async function fetchTasks(optionsOrCategory?: string | FetchTasksOptions): Promise<any> {
  const url = new URL(`${API_URL}/api/v1/tasks`);
  if (typeof optionsOrCategory === "string") {
    if (optionsOrCategory) url.searchParams.set("category", optionsOrCategory);
  } else if (optionsOrCategory && typeof optionsOrCategory === "object") {
    if (optionsOrCategory.category) url.searchParams.set("category", optionsOrCategory.category);
    if (optionsOrCategory.q) url.searchParams.set("q", optionsOrCategory.q);
    if (optionsOrCategory.sort) url.searchParams.set("sort", optionsOrCategory.sort);
    if (optionsOrCategory.filter) url.searchParams.set("filter", optionsOrCategory.filter);
    if (optionsOrCategory.difficulty) url.searchParams.set("difficulty", optionsOrCategory.difficulty);
    if (optionsOrCategory.pricing) url.searchParams.set("pricing", optionsOrCategory.pricing);
    if (optionsOrCategory.page) url.searchParams.set("page", String(optionsOrCategory.page));
    if (optionsOrCategory.pageSize || optionsOrCategory.limit) {
      url.searchParams.set("pageSize", String(optionsOrCategory.pageSize || optionsOrCategory.limit));
    }
  }
  return cachedFetchJson(url.toString(), { tasks: [], total: 0, totalPages: 1 }, { ttlMs: 15 * 60 * 1000 });
}

export async function toggleTaskSubscription(slug: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/v1/tasks/${slug}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRepositoryOwners(): Promise<RepositoryOwnerListItem[]> {
  const url = `${API_URL}/api/v1/repositories/owners`;
  return cachedFetchJson(url, [], { ttlMs: 30 * 60 * 1000 });
}

// ---------------------------------------------------------------------------
// MCP API Fetch Helpers
// ---------------------------------------------------------------------------
import type { MCPListResponse, MCPItem } from "./types";

export interface MCPQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subCategory?: string;
  type?: "SERVER" | "CLIENT";
  sortBy?: string;
}

export async function fetchMCPItems(params: MCPQuery = {}): Promise<MCPListResponse> {
  const url = new URL(`${API_URL}/api/v1/mcps`);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.limit) url.searchParams.set("limit", String(params.limit));
  if (params.search) url.searchParams.set("search", params.search);
  if (params.category) url.searchParams.set("category", params.category);
  if (params.subCategory) url.searchParams.set("subCategory", params.subCategory);
  if (params.type) url.searchParams.set("type", params.type);
  if (params.sortBy) url.searchParams.set("sortBy", params.sortBy);

  const empty: MCPListResponse = {
    items: [],
    total: 0,
    page: params.page ?? 1,
    totalPages: 1,
  };

  const responseJson = await cachedFetchJson<any>(url.toString(), null, { ttlMs: 15 * 60 * 1000 });
  if (responseJson && responseJson.success && responseJson.data) {
    return responseJson.data;
  }
  return empty;
}

export async function fetchMCPItemBySlug(slug: string): Promise<MCPItem | null> {
  const url = `${API_URL}/api/v1/mcps/${encodeURIComponent(slug)}`;
  const responseJson = await cachedFetchJson<any>(url, null, { ttlMs: 15 * 60 * 1000 });
  if (responseJson && responseJson.success && responseJson.data) {
    return responseJson.data;
  }
  // Fall back to hardcoded data when API returns nothing (e.g. local dev with empty DB)
  const { FALLBACK_MCP_ITEMS } = await import("@/data/mcp");
  return FALLBACK_MCP_ITEMS.find((item) => item.slug === slug) ?? null;
}

export async function fetchMCPItemAlternatives(slug: string): Promise<MCPItem[]> {
  const url = `${API_URL}/api/v1/mcps/${encodeURIComponent(slug)}/alternatives`;
  const responseJson = await cachedFetchJson<any>(url, null, { ttlMs: 15 * 60 * 1000 });
  if (responseJson && responseJson.success && responseJson.data) {
    return responseJson.data;
  }
  return [];
}