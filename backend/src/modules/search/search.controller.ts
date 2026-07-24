import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { SearchService } from './search.service.js';
import { AutocompleteQuerySchema } from './search.schema.js';

export class SearchController {
  async autocomplete(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new SearchService(prisma);

    const parsed = AutocompleteQuerySchema.safeParse(c.req.query());
    if (!parsed.success) {
      // Empty/missing q is a normal "not typing yet" state, not an error.
      return c.json({ suggestions: [] });
    }

    try {
      const limit = Number.parseInt(parsed.data.limit, 10) || 8;
      const suggestions = await service.autocomplete(parsed.data.q, limit);
      return c.json({ suggestions });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async popular(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new SearchService(prisma);

    try {
      const popular = await service.popular();
      return c.json({ popular });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async featured(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new SearchService(prisma);

    try {
      const featured = await service.featured();
      return c.json({ featured });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
