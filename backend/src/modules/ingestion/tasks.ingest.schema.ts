import { z } from "zod";

const Difficulty = z.enum(["EASY", "MEDIUM", "ADVANCED"]);
const PricingModel = z.enum(["FREE", "FREEMIUM", "PAID", "FREE_TRIAL"]);

const ResourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  homepage: z.string().url().optional().nullable(),
  source: z.string().optional().nullable(),
  postedAt: z.string().optional().nullable(),
  stars: z.number().optional().nullable(),
});

const PopularToolSchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  tagline: z.string(),
  pricingModel: z.string(),
  rating: z.number().optional().nullable(),
  bookmarkCount: z.number().int().default(0),
  visitUrl: z.string().optional().nullable(),
});

const PopularModelSchema = z.object({
  slug: z.string(),
  name: z.string(),
  provider: z.string(),
  logoUrl: z.string().optional().nullable(),
  modelType: z.string(),
  pricingModel: z.string(),
  benchmarkScore: z.number().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
});

export const taskSchema = z.object({
  id: z.string().optional(),

  title: z.string(),
  slug: z.string(),
  description: z.string(),

  iconUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),

  category: z.object({
    name: z.string(),
    slug: z.string(),
  }),

  difficulty: Difficulty,
  pricingModel: PricingModel,
  isFeatured: z.boolean(),

  toolCount: z.number().int().default(0),
  modelCount: z.number().int().default(0),
  robotCount: z.number().int().default(0),
  deviceCount: z.number().int().default(0),
  saveCount: z.number().int().default(0),

  updatedAt: z.string().optional(),
  shareUrl: z.string().optional().nullable(),

  _toolNames: z.array(z.string()).default([]),

  resources: z.array(ResourceSchema).default([]),

  popularTools: z.array(PopularToolSchema).default([]),

  popularModels: z.array(PopularModelSchema).default([]),
});

export const tasksIngestPayloadSchema = z.object({
  tasks: z.array(taskSchema),
});

export type TaskIngestInput = z.infer<typeof taskSchema>;
export type TasksIngestPayload = z.infer<typeof tasksIngestPayloadSchema>;