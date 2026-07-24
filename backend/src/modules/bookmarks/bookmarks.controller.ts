import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { BookmarksService } from './bookmarks.service.js';
import { AppError } from '../../lib/error.js';

export class BookmarksController {
  async listBookmarks(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new BookmarksService(prisma);
    try {
      const user = c.get('user');
      const bookmarks = await service.listBookmarks(user.id);
      return c.json(bookmarks);

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
        throw AppError.BadRequest('url is required');
      }
      const bookmark = await service.createBookmark(user.id, body.title, body.url);
      return c.json(bookmark);

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
        throw AppError.BadRequest('id is required');
      }
      await service.deleteBookmark(user.id, id);
      return c.json({ success: true });

    } finally {
      await prisma.$disconnect();
    }
  }
}
