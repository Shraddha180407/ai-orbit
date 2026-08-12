import type { Video } from "./video-types";

export type { Video };
export { BLUR_DATA_URL, formatDuration, formatViews, formatRelativeDate } from "./video-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://ai-orbit.palamrendra-pm.workers.dev";
/**
 * All data comes from the backend Worker (/api/videos) over HTTP.
 * `cache: "no-store"` because this is a fast-moving feed — Next's default
 * fetch caching would otherwise serve stale results across requests.
 */
async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[videos-data] failed to fetch ${path}:`, err);
    return null;
  }
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

export async function getVideosPage(limit: number, offset: number): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos?sort=latest&limit=${limit}&offset=${offset}`)) ?? [];
}

export async function getVideosCount(): Promise<number> {
  const result = await fetchJson<{ total: number }>(`/api/videos/count`);
  return result?.total ?? 0;
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  return fetchJson<Video>(`/api/videos/${slug}`);
}

export async function getRelatedVideos(video: Video, limit = 4): Promise<Video[]> {
  return (await fetchJson<Video[]>(`/api/videos/${video.slug}/related?limit=${limit}`)) ?? [];
}