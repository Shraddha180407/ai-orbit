import { z } from "zod";

export const ingestionRunQuerySchema = z.object({
  /** Comma-separated FeedSource names (case-insensitive) to restrict the run to. Omit to run every source in FEED_SOURCES. */
  sources: z.string().optional(),
  /** Entries fetched per source. Capped at 30 to match the old app's own per-source limit. */
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Math.max(1, Math.min(30, parseInt(v, 10) || 5)) : 5)),
  /** "true" to also run Hacker News discovery alongside the RSS sources. */
  includeHackerNews: z.string().optional(),
});

export type IngestionRunQueryInput = z.infer<typeof ingestionRunQuerySchema>;
