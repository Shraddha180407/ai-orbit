import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { ModelsService } from './models.service.js';
import { modelsListQuerySchema } from './models.schema.js';

export class ModelsController {
  async listModels(c: Context) {
    const parsed = modelsListQuerySchema.safeParse(c.req.query());

    if (!parsed.success) {
      return c.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        400
      );
    }

    const prisma = getPrisma(c.env);
    const service = new ModelsService(prisma);

    try {
      const result = await service.listModels(parsed.data);
      return c.json(result);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getModel(c: Context) {
    const id = c.req.param('id');
    
    if (!id) {
      return c.json({ error: "Model ID is required" }, 400);
    }

    const prisma = getPrisma(c.env);
    const service = new ModelsService(prisma);

    try {
      const model = await service.getModelById(id);

      if (!model) {
        return c.json({ error: "Model not found" }, 404);
      }

      return c.json(model);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}