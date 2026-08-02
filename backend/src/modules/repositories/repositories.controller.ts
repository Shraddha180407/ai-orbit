import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { RepositoriesService } from './repositories.service.js';
import { logger } from '../../lib/logger.js';

const VALID_SORTS = ['stars_desc', 'newest', 'name_asc'] as const;
type SortOption = (typeof VALID_SORTS)[number];

export class RepositoriesController {
  async listRepositories(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RepositoriesService(prisma);

    try {
      const sort = c.req.query('sort');
      if (sort && !VALID_SORTS.includes(sort as SortOption)) {
        return c.json(
          { error: `Invalid sort value "${sort}". Valid options: ${VALID_SORTS.join(', ')}` },
          400,
        );
      }

      const limitParam = c.req.query('limit');
      const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined;

      const result = await service.listRepositories({
        cursor: c.req.query('cursor') || undefined,
        limit,
        sort: sort || undefined,
        language: c.req.query('language') || undefined,
        topic: c.req.query('topic') || undefined,
        q: c.req.query('q') || undefined,
        owner: c.req.query('owner') || undefined,
        subCategory: c.req.query('subCategory') || undefined,
      });

      return c.json(result);
    } catch (error: unknown) {
      logger.error('Error listing repositories:', error);
      return c.json({ error: 'Failed to fetch repositories' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRepositoryBySlug(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RepositoriesService(prisma);
    const slug = c.req.param('slug') || '';

    try {
      const repo = await service.getRepositoryBySlug(slug, c.env.GITHUB_TOKEN);
      if (!repo) {
        return c.json({ error: 'Repository not found' }, 404);
      }
      return c.json(repo);
    } catch (error: unknown) {
      logger.error('Error fetching repository:', error);
      return c.json({ error: 'Failed to fetch repository' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async listRepositoryOwners(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RepositoriesService(prisma);

    try {
      const owners = await service.listRepositoryOwners();
      return c.json(owners);
    } catch (error: unknown) {
      logger.error('Error listing repository owners:', error);
      return c.json({ error: 'Failed to fetch repository owners' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async listRepositorySubCategories(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RepositoriesService(prisma);

    try {
      const subCategories = await service.listRepositorySubCategories();
      return c.json(subCategories);
    } catch (error: unknown) {
      logger.error('Error listing repository subcategories:', error);
      return c.json({ error: 'Failed to fetch repository subcategories' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
