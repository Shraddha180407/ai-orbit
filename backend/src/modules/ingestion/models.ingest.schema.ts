import { z } from "zod";

const companySchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().url().optional().nullable(),
});

export const modelSchema = z.object({
  slug: z.string(),
  name: z.string(),
  creator: z.string(),
  contextWindow: z.string(),
  parameterSize: z.string(),
  modality: z.string(),
  releaseDate: z.string(),
  description: z.string(),
  websiteUrl: z.string().url().optional().nullable(),
  capabilities: z.array(z.string()).default([]),
  provider: companySchema.optional().nullable(),
});

export const modelsIngestPayloadSchema = z.object({
  models: z.array(modelSchema),
});

export type ModelIngestInput = z.infer<typeof modelSchema>;
export type ModelsIngestPayload = z.infer<typeof modelsIngestPayloadSchema>;