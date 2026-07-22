import { z } from "zod";

export const modelsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  sort: z
    .enum(["newest", "oldest", "alphabetical", "releaseDate"])
    .default("newest"),

  search: z.string().trim().min(1).max(100).optional(),

  provider: z.string().trim().optional(),   // matches Company.slug
  modality: z.string().trim().optional(),    // substring match, e.g. "Text"
  creator: z.string().trim().optional(),     // fallback for models without providerId
});

export type ModelsListQuery = z.infer<typeof modelsListQuerySchema>;