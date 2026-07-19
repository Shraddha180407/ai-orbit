// Replaces the old apps/server "@video-module/shared" package import.
// Keep in sync with the Prisma Video model / videos.schemas.ts VideoUpsertSchema.

export type ToolCategory = "multimodal-ai" | "robotics" | "agents" | "llm" | "general-ai";

export const TOOL_CATEGORIES: ToolCategory[] = [
  "multimodal-ai",
  "llm",
  "agents",
  "robotics",
  "general-ai",
];

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
  publishedAt: string; // ISO date, YYYY-MM-DD
  author: { name: string; avatar: string };
  channelId: string | null;
  tags: string[];
  accent: string;
};