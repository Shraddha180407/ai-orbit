import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { AgentsService } from './agents.service.js';
import { GetAgentsQuerySchema } from './agents.schema.js';

export class AgentsController {
  async listAgents(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new AgentsService(prisma);

    const query = c.req.query();
    const parsed = GetAgentsQuerySchema.safeParse(query);

    if (!parsed.success) {
      return c.json({ error: 'Invalid parameters', details: parsed.error.issues }, 400);
    }

    try {
      const pageNum = Number.parseInt(parsed.data.page, 10) || 1;
      const pageSize = Number.parseInt(parsed.data.limit || parsed.data.pageSize, 10) || 12;
      const result = await service.listAgents({
        q: parsed.data.q,
        category: parsed.data.category,
        pricing: parsed.data.pricing,
        sort: parsed.data.sort,
        page: pageNum,
        pageSize,
      });
      return c.json(result);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }

  async listCategories(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new AgentsService(prisma);

    try {
      const categories = await service.listCategories();
      return c.json(categories);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }

  async getAgentBySlug(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new AgentsService(prisma);
    const slug = c.req.param('slug') || '';

    try {
      const agent = await service.getAgentBySlug(slug);
      if (!agent) {
        return c.json({ error: 'Agent not found' }, 404);
      }
      return c.json(agent);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }
}
