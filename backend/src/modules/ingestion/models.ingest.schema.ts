import { z } from "zod";

const companySchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().url().optional().nullable(),
});

const documentationLinkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
});

const modelTypeSchema = z.enum([
  "TEXT",
  "IMAGE",
  "VIDEO",
  "MULTIMODAL",
  "AUDIO",
  "CODE",
  "THREE_D",
  "STRUCTURED_DATA",
]);

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
  apiAvailable: z.boolean().default(false),
  documentation: z.array(documentationLinkSchema).optional().nullable(),
  promptExamples: z.array(z.string()).default([]),
  openSource: z.boolean().default(false),
  primaryTask: z.string().optional().nullable(),
  modelType: modelTypeSchema.optional().nullable(),
  provider: companySchema.optional().nullable(),
});

export const modelsIngestPayloadSchema = z.object({
  models: z.array(modelSchema).min(1).max(1000),
});

export type ModelIngestInput = z.infer<typeof modelSchema>;
export type ModelsIngestPayload = z.infer<typeof modelsIngestPayloadSchema>;