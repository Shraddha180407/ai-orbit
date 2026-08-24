import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { ToolsService } from './tools.service.js';
import { GetToolsQuerySchema, CreateReviewSchema, BookmarkToggleSchema } from './tools.schema.js';

export class ToolsController {
  async listTools(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new ToolsService(prisma);

    const query = c.req.query();
    const parsed = GetToolsQuerySchema.safeParse(query);

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    try {
      const pageNum = Number.parseInt(parsed.data.page, 10) || 1;
      const result = await service.listTools({
        q: parsed.data.q,
        category: parsed.data.category,
        pricing: parsed.data.pricing,
        sort: parsed.data.sort,
        page: pageNum,
      });
      return c.json(result);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }
  async listToolsByCategory(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new ToolsService(prisma);

    const query = c.req.query();
    const parsed = GetToolsQuerySchema.safeParse(query);
    const category = c.req.param('category');

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    try {
      const pageNum = Number.parseInt(parsed.data.page, 10) || 1;
      const result = await service.listTools({
        q: parsed.data.q,
        category: category,
        pricing: parsed.data.pricing,
        sort: parsed.data.sort,
        page: pageNum,
      });
      return c.json(result);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async getToolDetails(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new ToolsService(prisma);
    const slug = c.req.param('slug') || '';

    try {
      const user = c.get('user');
      const result = await service.getToolDetails(slug, user?.id);
      if (!result) {
        return c.json({ error: 'Tool not found' }, 404);
      }
      return c.json(result);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async submitReview(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new ToolsService(prisma);

    try {
      const body = await c.req.json();
      const parsed = CreateReviewSchema.safeParse(body);

      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }

      const user = c.get('user');
      await service.createOrUpdateReview(parsed.data.toolId, user.id, parsed.data.rating, parsed.data.comment);
      return c.json({ status: 'success', message: 'Thanks — your review is live.' });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async toggleBookmark(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new ToolsService(prisma);

    try {
      const body = await c.req.json();
      const parsed = BookmarkToggleSchema.safeParse(body);

      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }

      const user = c.get('user');
      const bookmarked = await service.toggleBookmark(parsed.data.toolId, user.id);
      return c.json({ bookmarked });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }
}