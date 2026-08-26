import { z } from 'zod';

export const AutocompleteQuerySchema = z.object({
  q: z.string().trim().min(1, 'q is required'),
  limit: z.string().optional().default('44'),
});
