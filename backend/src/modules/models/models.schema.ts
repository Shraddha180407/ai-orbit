import { z } from "zod";

export const modelsListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["newest", "oldest", "alphabetical", "releaseDate"]).default("newest"),
  search: z.string().trim().min(1).max(100).optional(),
  provider: z.string().trim().optional(),
  modality: z.string().trim().optional(),
  creator: z.string().trim().optional(),

  modelType: z.enum(["TEXT", "IMAGE", "VIDEO", "MULTIMODAL", "AUDIO", "CODE", "THREE_D", "STRUCTURED_DATA"]).optional(),
  openSource: z.coerce.boolean().optional(),
  primaryTask: z.string().trim().optional(),
});

export const modelsCompareQuerySchema = z.object({
  ids: z.string().transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean)),
});

export type ModelsListQuery = z.infer<typeof modelsListQuerySchema>;
export type ModelsCompareQuery = z.infer<typeof modelsCompareQuerySchema>;