import { z } from "zod";

const TOOL_CATEGORIES = ["multimodal-ai", "robotics", "agents", "llm", "general-ai"] as const;

// GET /api/videos
export const ListQuerySchema = z.object({
  sort: z.enum(["latest", "trending"]).default("latest"),
  limit: z
    .string()
    .optional()
    .transform((val: string | undefined) => {
      if (!val) return undefined;
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? undefined : parsed;
    }),
  offset: z.coerce
    .number()
    .int("offset must be an integer")
    .nonnegative("offset must be >= 0")
    .optional(),
  // Category chip slugs (e.g. "tutorials", "podcasts") — these don't map to
  // the toolCategory enum, they're matched against the `tags` array. Kept
  // as a free-form string (not an enum) since the set of chip slugs lives
  // in the frontend, not here.
  category: z.string().optional(),
  // Per-column table sort — distinct from `sort` (latest/trending feed mode)
  // above, which stays as-is for backward compatibility.
  sortBy: z.enum(["name", "duration", "posted", "views"]).optional(),
  sortDir: z.enum(["asc", "desc"]).optional(),
});
export type ListQueryInput = z.infer<typeof ListQuerySchema>;

// GET /api/videos/count
export const CountQuerySchema = z.object({
  category: z.string().optional(),
});
export type CountQueryInput = z.infer<typeof CountQuerySchema>;

// GET /api/videos/:slug and /:slug/related
export const SlugParamSchema = z.object({
  slug: z.string().min(1),
});
export type SlugParamInput = z.infer<typeof SlugParamSchema>;

export const RelatedQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .default("4")
    .transform((val: string) => {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 4 : parsed;
    }),
});
export type RelatedQueryInput = z.infer<typeof RelatedQuerySchema>;

// Shape written by the crawler's youtube-enrich.ts on upsert
export const VideoUpsertSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  toolName: z.string(),
  toolCategory: z.enum(TOOL_CATEGORIES),
  youtubeId: z.string(),
  thumbnail: z.string(),
  durationSeconds: z.number().int().nonnegative(),
  views: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  publishedAt: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string(),
  }),
  channelId: z.string().nullable().optional(),
  tags: z.array(z.string()),
  accent: z.string(),
});
export type VideoUpsertInput = z.infer<typeof VideoUpsertSchema>;