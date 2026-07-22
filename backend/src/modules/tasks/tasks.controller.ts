import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { TasksService } from './tasks.service.js';
import { getCookie } from 'hono/cookie';
import { verify } from 'jsonwebtoken';
import { GetTasksQuerySchema, ToggleTaskBookmarkSchema } from './tasks.schema.js';

export class TasksController {
  async listTasks(c: Context) {
    const query = c.req.query();
    const parsed = GetTasksQuerySchema.safeParse(query);

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    // "for-you" and "following" require a logged-in user
    let userId: string | undefined;
    if (parsed.data.filter === 'for-you' || parsed.data.filter === 'following') {
      const token = getCookie(c, 'auth_token');
      if (!token) {
        return c.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, 401);
      }
      try {
        const jwtSecret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET;
        const decoded = verify(token, jwtSecret!) as { id: string };
        userId = decoded.id;
      } catch {
        return c.json({ error: 'Invalid or expired token', code: 'AUTH_INVALID' }, 401);
      }
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
        filterMode: parsed.data.filter,
        userId,
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
      // Optionally authenticated — anonymous visitors still see the task,
      // just without bookmarked/liked/subscribed state.
      let userId: string | undefined;
      const token = getCookie(c, 'auth_token');
      if (token) {
        try {
          const jwtSecret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET;
          const decoded = verify(token, jwtSecret!) as { id: string };
          userId = decoded.id;
        } catch {
          // invalid/expired token — treat as anonymous, don't error
        }
      }

      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const result = await service.getTaskDetails(slug, userId);
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
      const user = c.get('user') as { id: string } | undefined;
      if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const body = await c.req.json();
      const parsed = ToggleTaskBookmarkSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }
      const bookmarked = await service.toggleBookmark(parsed.data.taskId, user.id);
      return c.json({ bookmarked });
    } catch (error: any) {
      console.error('toggleBookmark error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }

  async toggleLike(c: Context) {
    let prisma;
    try {
      const user = c.get('user') as { id: string } | undefined;
      if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const body = await c.req.json();
      const parsed = ToggleTaskBookmarkSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }
      const liked = await service.toggleLike(parsed.data.taskId, user.id);
      return c.json({ liked });
    } catch (error: any) {
      console.error('toggleLike error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }

  async toggleSubscribe(c: Context) {
    let prisma;
    try {
      const user = c.get('user') as { id: string } | undefined;
      if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

      prisma = getPrisma(c.env);
      const service = new TasksService(prisma);
      const body = await c.req.json();
      const parsed = ToggleTaskBookmarkSchema.safeParse(body);
      if (!parsed.success) {
        return c.json({ error: 'Invalid input data', details: parsed.error.issues }, 400);
      }
      const subscribed = await service.toggleSubscribe(parsed.data.taskId, user.id);
      return c.json({ subscribed });
    } catch (error: any) {
      console.error('toggleSubscribe error:', error);
      return c.json({ error: error.message ?? String(error) }, 500);
    } finally {
      if (prisma) await prisma.$disconnect();
    }
  }
}