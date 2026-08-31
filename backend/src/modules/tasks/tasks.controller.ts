import { Context } from 'hono';
import { getPrisma, getPrismaTx } from '../../lib/prisma.js';
import { TasksService } from './tasks.service.js';
import { getCookie } from 'hono/cookie';
import { verify } from 'jsonwebtoken';
import { logger } from '../../lib/logger.js';
import { GetTasksQuerySchema } from './tasks.schema.js';

export class TasksController {
  async listTasks(c: Context) {
    const query = c.req.query();
    const parsed = GetTasksQuerySchema.safeParse(query);

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    let userId: string | undefined;
    if (parsed.data.filter === 'for-you' || parsed.data.filter === 'following') {
      const token = getCookie(c, 'auth_token');
      if (!token) {
        return c.json({ error: 'Unauthorized', code: 'AUTH_REQUIRED' }, 401);
      }
      try {
        const jwtSecret = (c.env as Record<string, string | undefined>)?.JWT_SECRET || process.env.JWT_SECRET;
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
      const pageSizeNum = Number.parseInt(parsed.data.pageSize, 10) || 20;
      const result = await service.listTasks({
        q: parsed.data.q,
        category: parsed.data.category,
        difficulty: parsed.data.difficulty,
        pricing: parsed.data.pricing,
        featuredOnly: parsed.data.featuredOnly === 'true',
        sort: parsed.data.sort,
        page: pageNum,
        pageSize: pageSizeNum,
        filterMode: parsed.data.filter,
        userId,
      });
      return c.json(result);
    } catch (error: unknown) {
      logger.error('listTasks error:', error);
      return c.json({ error: error instanceof Error ? error.message : String(error) }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async getTaskDetails(c: Context) {
    const slug = c.req.param('slug') || '';
    let prisma;
    try {
      let userId: string | undefined;
      const token = getCookie(c, 'auth_token');
      if (token) {
        try {
          const jwtSecret = (c.env as Record<string, string | undefined>)?.JWT_SECRET || process.env.JWT_SECRET;
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
    } catch (error: unknown) {
      logger.error('getTaskDetails error:', error);
      return c.json({ error: error instanceof Error ? error.message : String(error) }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async toggleBookmark(c: Context) {
  let prisma;
  try {
    const user = c.get('user') as { id: string } | undefined;
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

    const slug = c.req.param('slug') || '';
    prisma = getPrismaTx(c.env); 
    const service = new TasksService(prisma);
    const bookmarked = await service.toggleBookmarkBySlug(slug, user.id);
    if (bookmarked === null) return c.json({ error: 'Task not found' }, 404);
    return c.json({ bookmarked });
  } catch (error: unknown) {
    logger.error('toggleBookmark error:', error);
    return c.json({ error: error instanceof Error ? error.message : String(error) }, 500);
  }
}

async toggleLike(c: Context) {
  let prisma;
  try {
    const user = c.get('user') as { id: string } | undefined;
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

    const slug = c.req.param('slug') || '';   
    prisma = getPrismaTx(c.env); 
    const service = new TasksService(prisma);
    const liked = await service.toggleLikeBySlug(slug, user.id);
    if (liked === null) return c.json({ error: 'Task not found' }, 404);
    return c.json({ liked });
  } catch (error: unknown) {
    logger.error('toggleLike error:', error);
    return c.json({ error: error instanceof Error ? error.message : String(error) }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}

async toggleSubscribe(c: Context) {
  let prisma;
  try {
    const user = c.get('user') as { id: string } | undefined;
    if (!user?.id) return c.json({ error: 'Unauthorized' }, 401);

    const slug = c.req.param('slug') || '';  
    prisma = getPrismaTx(c.env); 
    const service = new TasksService(prisma);
    const subscribed = await service.toggleSubscribeBySlug(slug, user.id);
    if (subscribed === null) return c.json({ error: 'Task not found' }, 404);
    return c.json({ subscribed });
  } catch (error: unknown) {
    logger.error('toggleSubscribe error:', error);
    return c.json({ error: error instanceof Error ? error.message : String(error) }, 500);
  } finally {
    // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
    // it must stay connected across requests, so it is intentionally not
    // disconnected here.
  }
}
}