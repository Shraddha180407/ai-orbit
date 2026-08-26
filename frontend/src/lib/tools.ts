import type { ToolsSearchParams } from "@/lib/types";
import { API_URL } from "@/lib/api";
import { cachedFetchJson } from "@/lib/api-cache";

export async function getTools(rawParams: ToolsSearchParams) {
  const query = new URLSearchParams();
  if (rawParams.q) query.set('q', rawParams.q);
  if (rawParams.category) query.set('category', rawParams.category);
  if (rawParams.pricing) query.set('pricing', rawParams.pricing);
  if (rawParams.sort) query.set('sort', rawParams.sort);
  if (rawParams.page) query.set('page', rawParams.page);

  const fallback = {
    tools: [],
    total: 0,
    page: Number(rawParams.page ?? "1") || 1,
    totalPages: 1,
    sort: rawParams.sort || 'newest',
    categories: []
  };

  return cachedFetchJson(`${API_URL}/api/v1/tools?${query.toString()}`, fallback, { ttlMs: 15 * 60 * 1000 });
}

export async function getAllCategories() {
  const data = await cachedFetchJson<any>(`${API_URL}/api/v1/tools`, { categories: [] }, { ttlMs: 30 * 60 * 1000 });
  return data?.categories || [];
}

export async function getToolDetails(slug: string) {
  if (!slug) return null;
  return cachedFetchJson<any>(`${API_URL}/api/v1/tools/${encodeURIComponent(slug)}`, null, { ttlMs: 15 * 60 * 1000 });
}

export async function getToolBySlug(slug: string) {
  const data = await getToolDetails(slug);
  return data?.tool || null;
}
