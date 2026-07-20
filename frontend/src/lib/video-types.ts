// Replaces the old apps/web "@video-module/shared" package import.
// Mirrors backend/crawler/types.ts and the Prisma Video model — keep in sync.

export type ToolCategory = "multimodal-ai" | "llm" | "agents" | "robotics" | "general-ai";

export type Video = {
  id: string;
  slug: string;
  title: string;
  description: string;
  toolName: string;
  toolCategory: ToolCategory;
  youtubeId: string;
  thumbnail: string;
  durationSeconds: number;
  views: number;
  likes: number;
  publishedAt: string; // ISO date
  author: { name: string; avatar: string };
  channelId: string | null;
  tags: string[];
  /** Deterministic fallback gradient shown if the thumbnail URL ever fails to load. */
  accent: string;
};

export const TOOL_CATEGORIES = [
  "multimodal-ai",
  "llm",
  "agents",
  "robotics",
  "general-ai",
] as const;

/** Human-readable labels for category chips/badges in the UI. */
export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  "multimodal-ai": "Multimodal AI",
  llm: "LLM",
  agents: "Agents",
  robotics: "Robotics",
  "general-ai": "General AI",
};

/** Deterministic accent colors per category, used for filter chips/badges. */
export const CATEGORY_COLORS: Record<ToolCategory, string> = {
  "multimodal-ai": "#5e6ad2",
  llm: "#1d9e75",
  agents: "#d4537e",
  robotics: "#ba7517",
  "general-ai": "#378add",
};

/** 8x8 solid-gray base64 placeholder — swapped for the real image once it loads. */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#151619"/></svg>'
  ).toString("base64");

// Shared by VideoTable.tsx and app/videos/[slug]/page.tsx — both linked to the
// channel directly when we have a channelId, else fell back to a YouTube
// search for the author name. Previously duplicated inline in both places.
export function getChannelUrl(channelId: string | null | undefined, authorName: string): string {
  return channelId
    ? `https://www.youtube.com/channel/${channelId}`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(authorName)}`;
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatViews(views: number) {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(0)}K views`;
  return `${views} views`;
}

export function formatRelativeDate(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}