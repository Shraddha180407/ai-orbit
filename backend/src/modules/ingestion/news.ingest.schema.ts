import { z } from "zod";

export const newsSchema = z.object({
  slug: z.string(),
  title: z.string(),
  dek: z.string(),
  aiSummary: z.string(),
  articleUrl: z.string().url(),

  publisher: z.object({
    name: z.string(),
    domain: z.string(),
    website: z.string().url(),
    logoUrl: z.string().url().optional().nullable(),
    faviconUrl: z.string().url().optional().nullable(),
    colorHex: z.string().optional().nullable(),
    followersLabel: z.string().optional().nullable(),
    credibilityScore: z.number().default(0.8)
  }),

  category: z.string(),
  filterTags: z.array(z.string()).default([]),
  topics: z.array(z.object({
    name: z.string()
  })).default([]),

  publishedAt: z.coerce.date(),
});

export const newsIngestPayloadSchema = z.object({
  news: z.array(newsSchema)
});

export type NewsIngestInput = z.infer<typeof newsSchema>;
export type NewsIngestPayload = z.infer<typeof newsIngestPayloadSchema>;
