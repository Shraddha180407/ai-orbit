import { z } from "zod";

const Availability = z.enum(["Available", "Pre-order", "Announced", "Discontinued"]).default("Announced");

export const deviceSchema = z.object({
  slug: z.string(),
  name: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  availability: Availability,
  price: z.string().optional().nullable(),
  year: z.string(),
  month: z.string().optional().nullable(),
  description: z.string(),
  imageUrl: z.string().url(),
  images: z.array(z.string().url()).default([]),
  videoUrl: z.string().url().optional().nullable(),
  manufacturerLogoUrl: z.string().url(),
  mainTask: z.string(),
  formFactor: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  ram: z.string().optional().nullable(),
  aiFeatures: z.array(z.string()).default([]),
  primaryUseCases: z.array(z.string()).default([]),
  additionalInfo: z.string().optional().nullable(),
  buyUrl: z.string().url().optional().nullable(),
  tasks: z.array(z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.object({
      slug: z.string(),
      name: z.string()
    })
  })).default([])
});

export const devicesIngestPayloadSchema = z.object({
  devices: z.array(deviceSchema)
});

export type DeviceIngestInput = z.infer<typeof deviceSchema>;
export type DevicesIngestPayload = z.infer<typeof devicesIngestPayloadSchema>;
