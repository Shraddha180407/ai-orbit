import type { Video } from "./video-types";
import { cachedFetchJson } from "./api-cache";

export type { Video };
export { BLUR_DATA_URL, formatDuration, formatViews, formatRelativeDate } from "./video-types";

function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url.startsWith("http") && url !== "undefined") {
    return url.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8787";
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}

const API_URL = resolveApiUrl();

async function fetchJson<T>(path: string): Promise<T | null> {
  return cachedFetchJson<T | null>(`${API_URL}${path}`, null, { ttlMs: 15 * 60 * 1000 });
}

export type VideoSortBy = "name" | "duration" | "posted" | "views";
export type VideoSortDir = "asc" | "desc";

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