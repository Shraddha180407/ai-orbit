import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ingestionRunQuerySchema } from "./ingestion.schemas.js";
import { IngestionController } from "./ingestion.controller.js";
import { requireIngestionToken } from "../../middleware/auth.js";
import { toolsIngestPayloadSchema } from "./tools.ingest.schema.js";
import { ToolsIngestService } from "./tools.ingest.service.js";
import { devicesIngestPayloadSchema } from "./devices.ingest.schema.js";
import { DevicesIngestService } from "./devices.ingest.service.js";
import { getPrisma } from "../../lib/prisma.js";

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

    const prisma = getPrisma(c.env as any);
    const summary = await ToolsIngestService.ingestTools(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: any) {
    console.error("Tools ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred during tools ingestion"
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

    const prisma = getPrisma(c.env as any);
    const summary = await DevicesIngestService.ingestDevices(prisma, parsed.data);
    
    return c.json(summary, 200);
  } catch (err: any) {
    console.error("Devices ingestion error:", err);
    return c.json({
      error: "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred during devices ingestion"
    }, 500);
  }
});

export default router;
