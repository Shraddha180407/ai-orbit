import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { CollectionsService } from './collections.service.js';

export class CollectionsController {
  async listCollections(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CollectionsService(prisma);

    const category = c.req.query('category') || undefined;
    const pageParam = c.req.query('page');
    const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1);

    try {
      const result = await service.listCollections({ category, page });
      return c.json(result);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getCollectionDetails(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CollectionsService(prisma);
    const slug = c.req.param('slug') || '';

    try {
      const collection = await service.getCollectionBySlug(slug);
      if (!collection) {
        return c.json({ error: 'Collection not found' }, 404);
      }
      return c.json(collection);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
