import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { CreativityService } from './creativity.service.js';
import { creativityListQuerySchema } from './creativity.schema.js';

export class CreativityController {
  async listCreativityCategories(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CreativityService(prisma);

    try {
      const categories = await service.listCreativityCategories();
      return c.json(categories);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getFilterOptions(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CreativityService(prisma);

    try {
      const options = await service.getFilterOptions();
      return c.json(options);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async listCreativityTools(c: Context) {
    const parsed = creativityListQuerySchema.safeParse(c.req.query());

    if (!parsed.success) {
      return c.json(
        { error: "Invalid query parameters", details: parsed.error.flatten() },
        400
      );
    }

    const prisma = getPrisma(c.env);
    const service = new CreativityService(prisma);

    try {
      const result = await service.listCreativityTools(parsed.data);
      return c.json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getCreativityTool(c: Context) {
    const slug = c.req.param('slug');

    if (!slug) {
      return c.json({ error: "Tool slug is required" }, 400);
    }

    const prisma = getPrisma(c.env);
    const service = new CreativityService(prisma);

    try {
      const tool = await service.getCreativityToolBySlug(slug);

      if (!tool) {
        return c.json({ error: "Creativity tool not found" }, 404);
      }

      return c.json(tool);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return c.json({ error: message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
