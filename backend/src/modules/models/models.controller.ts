import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { ModelsService } from './models.service.js';
import { modelsListQuerySchema } from './models.schema.js';
import { modelsCompareQuerySchema } from './models.schema.js';

export class ModelsController {
  async getFilterOptions(c: Context) {
  const prisma = getPrisma(c.env);
  const service = new ModelsService(prisma);

  try {
    const options = await service.getFilterOptions();
    return c.json(options);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

  async compareModels(c: Context) {
  const parsed = modelsCompareQuerySchema.safeParse(c.req.query());

  if (!parsed.success) {
    return c.json({ error: "Invalid query parameters", details: parsed.error.flatten() }, 400);
  }

  const prisma = getPrisma(c.env);
  const service = new ModelsService(prisma);

  try {
    const models = await service.compareModels(parsed.data.ids);
    return c.json({ items: models });
  } catch (error: any) {
  const status = error.message.includes("Cannot compare") ? 422
    : error.message.includes("not found") ? 404
    : 500;
  return c.json({ error: error.message }, status);
  }finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

async listModelSubCategories(c: Context) {
  const prisma = getPrisma(c.env);
  const service = new ModelsService(prisma);

  try {
    const subCategories = await service.listModelSubCategories();
    return c.json(subCategories);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}
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
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
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
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }
}