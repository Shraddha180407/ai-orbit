import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { SearchService } from './search.service.js';

export class SearchController {
  async autocomplete(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new SearchService(prisma);
    const q = c.req.query('q') || '';

    try {
      const results = await service.autocomplete(q);
      return c.json(results);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async popular(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new SearchService(prisma);

    try {
      const terms = await service.popularSearches();
      return c.json(terms);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
