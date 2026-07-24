import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { BookmarksService } from './bookmarks.service.js';

export class BookmarksController {
  async listBookmarks(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new BookmarksService(prisma);
    try {
      const user = c.get('user');
      const bookmarks = await service.listBookmarks(user.id);
      return c.json(bookmarks);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async createBookmark(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new BookmarksService(prisma);
    try {
      const user = c.get('user');
      const body = await c.req.json();
      if (!body.url) {
        return c.json({ error: 'url is required' }, 400);
      }
      const bookmark = await service.createBookmark(user.id, body.title, body.url);
      return c.json(bookmark);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteBookmark(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new BookmarksService(prisma);
    try {
      const user = c.get('user');
      const id = c.req.param('id');
      if (!id) {
        return c.json({ error: 'id is required' }, 400);
      }
      await service.deleteBookmark(user.id, id);
      return c.json({ success: true });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
