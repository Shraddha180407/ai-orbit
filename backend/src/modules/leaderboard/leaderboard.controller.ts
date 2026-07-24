import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { LeaderboardService } from './leaderboard.service.js';

function getPrisma(env: { DATABASE_URL: string }) {
  const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export class LeaderboardController {
  async getTools(c: Context) {
    const prisma = getPrisma(c.env as { DATABASE_URL: string });
    const service = new LeaderboardService(prisma);
    const category = c.req.query('category');

    try {
      const tools = await service.listTools(category);
      return c.json(tools);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }

  async getModels(c: Context) {
    const prisma = getPrisma(c.env as { DATABASE_URL: string });
    const service = new LeaderboardService(prisma);
    const category = c.req.query('category');

    try {
      const models = await service.listModels(category);
      return c.json(models);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }

  async getCompanies(c: Context) {
    const prisma = getPrisma(c.env as { DATABASE_URL: string });
    const service = new LeaderboardService(prisma);

    try {
      const companies = await service.listCompanies();
      return c.json(companies);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }
}
