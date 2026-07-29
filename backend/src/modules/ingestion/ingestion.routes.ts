import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ingestionRunQuerySchema } from "./ingestion.schemas.js";
import { IngestionController } from "./ingestion.controller.js";
import { requireIngestionToken } from "../../middleware/auth.js";
import { logger } from "../../lib/logger.js";
import { toolsIngestPayloadSchema } from "./tools.ingest.schema.js";
import { ToolsIngestService } from "./tools.ingest.service.js";
import { devicesIngestPayloadSchema } from "./devices.ingest.schema.js";
import { DevicesIngestService } from "./devices.ingest.service.js";
import { newsIngestPayloadSchema } from "./news.ingest.schema.js";
import { NewsIngestService } from "./news.ingest.service.js";
import { videosIngestPayloadSchema } from "./videos.ingest.schema.js";
import { VideosIngestService } from "./videos.ingest.service.js";
import { robotsIngestPayloadSchema } from "./robots.ingest.schema.js";
import { RobotsIngestService } from "./robots.ingest.service.js";
import { repositoriesIngestPayloadSchema } from "./repositories.ingest.schema.js";
import { RepositoriesIngestService } from "./repositories.ingest.service.js";
import { getPrisma } from "../../lib/prisma.js";
import { modelsIngestPayloadSchema } from "./models.ingest.schema.js";
import { ModelsIngestService } from "./models.ingest.service.js";

const router = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    GEMINI_API_KEY: string;
    GROQ_API_KEY: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    INGESTION_TOKEN: string;
  };
}>();

router.post("/run", zValidator("query", ingestionRunQuerySchema), IngestionController.run);

router.post("/tools", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = toolsIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await ToolsIngestService.ingestTools(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during tools ingestion";
    logger.error("Tools ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

router.post("/devices", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = devicesIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await DevicesIngestService.ingestDevices(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during devices ingestion";
    logger.error("Devices ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

router.post("/news", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = newsIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await NewsIngestService.ingestNews(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during news ingestion";
    logger.error("News ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

router.post("/videos", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = videosIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await VideosIngestService.ingestVideos(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during videos ingestion";
    logger.error("Videos ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});
router.post("/models", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();

    const parsed = modelsIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await ModelsIngestService.ingestModels(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during models ingestion";
    logger.error("Models ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

router.post("/robots", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = robotsIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await RobotsIngestService.ingestRobots(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during robots ingestion";
    logger.error("Robots ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

router.post("/repositories", requireIngestionToken, async (c) => {
  try {
    const body = await c.req.json();
    
    const parsed = repositoriesIngestPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({
        error: "VALIDATION_FAILED",
        issues: parsed.error.issues
      }, 422);
    }

    const prisma = getPrisma(c.env);
    const summary = await RepositoriesIngestService.ingestRepositories(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred during repositories ingestion";
    logger.error("Repositories ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message
    }, 500);
  }
});

export default router;
