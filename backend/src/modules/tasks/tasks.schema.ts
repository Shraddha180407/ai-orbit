import { z } from 'zod';
import type { PricingModel } from '@prisma/client';

export const GetTasksQuerySchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'ADVANCED']).optional(),
  pricing: z.enum(['FREE', 'FREEMIUM', 'PAID', 'FREE_TRIAL']).optional(),
  featuredOnly: z.string().optional(),
  sort: z.enum([
    "newest", "oldest",
    "name-asc", "name-desc", "alphabetical",
    "rating", "popular",
    "tools-asc", "tools-desc",
    "models-asc", "models-desc",
    "robots-asc", "robots-desc",
    "devices-asc", "devices-desc",
  ]).optional().default('newest'),
  page: z.string().optional().default('1'),
  pageSize: z.string().optional().default('20'),
  filter: z.enum(['all', 'for-you', 'following']).optional().default('all'),
});

export const ToggleTaskBookmarkSchema = z.object({
  taskId: z.string().min(1, "taskId is required"),
});