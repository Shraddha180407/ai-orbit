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
  return "https://api.aiorbit.club";
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

export async function fetchAllModels(): Promise<any[]> {
  const url = `${API_URL}/api/v1/models`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchAllNews(): Promise<any[]> {
  const url = `${API_URL}/api/v1/news`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

import { Repository, RepositoryListResponse, RepositoryDetailResponse } from "./types";

export interface FetchRepositoriesOptions {
  limit?: number;
  cursor?: string | null;
  sort?: string;
  language?: string;
  topic?: string;
  q?: string;
}

export async function fetchRepositories(options: FetchRepositoriesOptions = {}): Promise<RepositoryListResponse> {
  const { limit, cursor, sort, language, topic, q } = options;

  const url = new URL(`${API_URL}/api/v1/repositories`);
  if (limit) url.searchParams.set("limit", limit.toString());
  if (cursor) url.searchParams.set("cursor", cursor);
  if (sort) url.searchParams.set("sort", sort);
  if (language) url.searchParams.set("language", language);
  if (topic) url.searchParams.set("topic", topic);
  if (q) url.searchParams.set("q", q);

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
    return data.items;
  } catch {
    return [];
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

export async function fetchAllDevices(): Promise<any[]> {
  const url = `${API_URL}/api/v1/devices`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDeviceById(id: string): Promise<any | null> {
  const url = `${API_URL}/api/v1/devices/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } } as RequestInit);
  if (!res.ok) return null;
  return res.json();
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
