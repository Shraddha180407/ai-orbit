import { z } from "zod";
import { VideoUpsertSchema } from "../videos/videos.schemas.js";

// Re-using the existing VideoUpsertSchema which already accurately matches the Prisma schema flat structure
export const videoSchema = VideoUpsertSchema;

export const videosIngestPayloadSchema = z.object({
  videos: z.array(videoSchema)
});

export type VideoIngestInput = z.infer<typeof videoSchema>;
export type VideosIngestPayload = z.infer<typeof videosIngestPayloadSchema>;
