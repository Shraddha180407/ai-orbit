import type { Video } from "./video-types";
import { cachedFetchJson, getFromCache, prefetchUrl, setInCache } from "./api-cache";

export type { Video };
export { getFromCache, setInCache, prefetchUrl };
export { BLUR_DATA_URL, formatDuration, formatViews, formatRelativeDate } from "./video-types";

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

export const API_URL = resolveApiUrl();

async function fetchJson<T>(path: string): Promise<T | null> {
  return cachedFetchJson<T | null>(`${API_URL}${path}`, null, { ttlMs: 15 * 60 * 1000 });
}

export type VideoSortBy = "name" | "duration" | "posted" | "views";
export type VideoSortDir = "asc" | "desc";

export function buildVideosPageUrl(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): string {
  const params = new URLSearchParams({ sort: "latest", limit: String(limit), offset: String(offset) });
  if (category) params.set("category", category);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortDir) params.set("sortDir", sortDir);
  return `${API_URL}/api/videos?${params.toString()}`;
}

/**
 * Same endpoint as buildVideosPageUrl, but with withCount=true - the
 * backend runs findMany + count in parallel and returns both in one
 * response ({ videos, total }), instead of the category chip flow
 * needing two separate HTTP round trips.
 */
export function buildVideosPageWithCountUrl(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): string {
  const params = new URLSearchParams({
    sort: "latest",
    limit: String(limit),
    offset: String(offset),
    withCount: "true",
  });
  if (category) params.set("category", category);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortDir) params.set("sortDir", sortDir);
  return `${API_URL}/api/videos?${params.toString()}`;
}

export function buildVideosCountUrl(category?: string): string {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const qs = params.toString();
  return `${API_URL}/api/videos/count${qs ? `?${qs}` : ""}`;
}

export interface VideosPageWithCount {
  videos: Video[];
  total: number;
}

export function getCachedVideosPage(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): Video[] | null {
  const url = buildVideosPageWithCountUrl(limit, offset, category, sortBy, sortDir);
  const cached = getFromCache<VideosPageWithCount>(url);
  return cached?.videos ?? null;
}

export function getCachedVideosCount(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): number | null {
  const url = buildVideosPageWithCountUrl(limit, offset, category, sortBy, sortDir);
  const cached = getFromCache<VideosPageWithCount>(url);
  return cached?.total ?? null;
}

export function prefetchVideosCategory(
  category?: string,
  limit = 100,
  offset = 0,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): void {
  // One request warms both the video list and the total count, since
  // the backend now runs findMany + count in parallel for a single
  // withCount=true call - no more doubling up on hover/touch.
  const url = buildVideosPageWithCountUrl(limit, offset, category, sortBy, sortDir);
  prefetchUrl(url, 15 * 60 * 1000);
}

/** Fetches a page of videos and its total count in a single request. */
export async function getVideosPageWithCount(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): Promise<VideosPageWithCount> {
  const url = buildVideosPageWithCountUrl(limit, offset, category, sortBy, sortDir);
  const result = await cachedFetchJson<VideosPageWithCount | null>(url, null, { ttlMs: 15 * 60 * 1000 });
  return result ?? { videos: [], total: 0 };
}

export async function getTrendingVideos(limit = 4): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=trending&limit=${limit}`)) ?? [];
}

export async function getLatestVideos(limit = 6): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=latest&limit=${limit}`)) ?? [];
}

export async function getAllVideos(): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=latest`)) ?? [];
}

export async function getVideosPage(
  limit: number,
  offset: number,
  category?: string,
  sortBy?: VideoSortBy,
  sortDir?: VideoSortDir
): Promise<Video[]> {
  const params = new URLSearchParams({ sort: "latest", limit: String(limit), offset: String(offset) });
  if (category) params.set("category", category);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortDir) params.set("sortDir", sortDir);
  return (await fetchJson<Video[]>(`/api/videos?${params.toString()}`)) ?? [];
}

export async function getVideosCount(category?: string): Promise<number> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  const qs = params.toString();
  const result = await fetchJson<{ total: number }>(`/api/videos/count${qs ? `?${qs}` : ""}`);
  return result?.total ?? 0;
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  return fetchJson<Video>(`/api/videos/${slug}`);
}

export async function getRelatedVideos(video: Video, limit = 4): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos/${video.slug}/related?limit=${limit}`)) ?? [];
}