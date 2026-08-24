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
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
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
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
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
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }
}