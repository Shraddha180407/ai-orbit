import { z } from 'zod';
import { PricingModel } from '@prisma/client';

export const GetTasksQuerySchema = z.object({
  q: z.string().optional().default(''),
  category: z.string().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'ADVANCED']).optional(),
  pricing: z.nativeEnum(PricingModel).optional(),
  featuredOnly: z.string().optional(),
  sort: z.enum([
    "newest",
    "oldest",
    "rating",
    "name-asc",
    "name-desc"
]).optional().default('newest'),
  page: z.string().optional().default('1'),
  filter: z.enum(['all', 'for-you', 'following']).optional().default('all'),
});

export const ToggleTaskBookmarkSchema = z.object({
  taskId: z.string().min(1, "taskId is required"),
});