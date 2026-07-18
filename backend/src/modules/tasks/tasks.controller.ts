import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { TasksService } from './tasks.service.js';
import { GetTasksQuerySchema, ToggleTaskBookmarkSchema } from './tasks.schema.js';

export class TasksController {
  async listTasks(c: Context) {
    const query = c.req.query();
    const parsed = GetTasksQuerySchema.safeParse(query);

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    let prisma;
    try {
      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const pageNum = Number.parseInt(parsed.data.page, 10) || 1;
      const result = await service.listTasks({
        q: parsed.data.q,
        category: parsed.data.category,
        difficulty: parsed.data.difficulty,
        pricing: parsed.data.pricing,
        featuredOnly: parsed.data.featuredOnly === 'true',
        sort: parsed.data.sort,
        page: pageNum,
      });
      return c.json(result);
    } catch (error: any) {
      console.error('listTasks error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }

  async getTaskDetails(c: Context) {
    const slug = c.req.param('slug') || '';
    let prisma;
    try {
      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const result = await service.getTaskDetails(slug);
      if (!result) {
        return c.json({ error: 'Task not found' }, 404);
      }
      return c.json(result);
    } catch (error: any) {
      console.error('getTaskDetails error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }

  async toggleBookmark(c: Context) {
    let prisma;
    try {
      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const body = await c.req.json();
      const parsed = ToggleTaskBookmarkSchema.safeParse(body);

      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }

      const bookmarked = await service.toggleBookmark(parsed.data.taskId);
      return c.json({ bookmarked });
    } catch (error: any) {
      console.error('toggleBookmark error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }
}