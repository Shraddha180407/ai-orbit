import { z } from "zod";

const taskCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
});

const taskSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  category: taskCategorySchema,
});

export const robotSchema = z.object({
  slug: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  thumbnailUrl: z.string().nullable().optional(),
  company: z.string(),
  country: z.string(),
  category: z.enum([
    "HUMANOID",
    "MOBILE",
    "MANIPULATOR",
    "DRONE",
    "INDUSTRIAL",
    "WAREHOUSE",
    "HEALTHCARE",
    "HOME",
    "AGRICULTURAL",
    "DEFENSE",
    "SERVICE",
    "COMPANION",
    "OTHER"
  ]),
  availability: z.enum([
    "ANNOUNCED",
    "COMMERCIALLY_AVAILABLE",
    "DISCONTINUED",
    "IN_DEVELOPMENT",
    "IN_PRODUCTION",
    "PAUSED",
    "PILOT",
    "PRE_ORDER",
    "PROTOTYPE"
  ]),
  price: z.string().nullable().optional(),
  releaseDate: z.string().nullable().optional(),
  mainTask: z.string().nullable().optional(),
  autonomyLevel: z.enum([
    "TELEOPERATED",
    "ASSISTED",
    "SEMI_AUTONOMOUS",
    "HIGHLY_AUTONOMOUS",
    "FULLY_AUTONOMOUS"
  ]).nullable().optional(),
  primaryUseCases: z.array(z.string()).default([]),
  websiteUrl: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  specs: z.string().nullable().optional(),
  mediaUrls: z.array(z.string()).default([]),
  
  // On-the-fly relations
  tasks: z.array(taskSchema).default([])
});

export const robotsIngestPayloadSchema = z.object({
  robots: z.array(robotSchema)
});

export type RobotIngestInput = z.infer<typeof robotSchema>;
export type RobotsIngestPayload = z.infer<typeof robotsIngestPayloadSchema>;
