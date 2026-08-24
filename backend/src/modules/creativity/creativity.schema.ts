import { z } from "zod";

export const CREATIVITY_CATEGORY_VALUES = [
  "IMAGE_GENERATION",
  "WRITING",
  "SOFTWARE_DEVELOPMENT",
  "VIDEO_CREATION",
  "MUSIC",
  "GRAPHIC_DESIGN",
  "DIGITAL_ART",
  "BRAINSTORMING",
  "THREE_D_CREATION",
  "PRESENTATION_DESIGN",
  "STORYTELLING",
  "CONTENT_CREATION",
  "BRANDING",
  "MOTION_GRAPHICS",
  "GAME_CREATION",
] as const;

export const creativityListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["newest", "oldest", "alphabetical", "topRated"]).default("newest"),
  search: z.string().trim().min(1).max(100).optional(),

  category: z.enum(CREATIVITY_CATEGORY_VALUES).optional(), // matches CreativityCategory enum
  pricingModel: z.string().trim().optional(),              // matches Tool.pricingModel
  openSource: z.coerce.boolean().optional(),
  verified: z.coerce.boolean().optional(),
});

export type CreativityListQuery = z.infer<typeof creativityListQuerySchema>;
