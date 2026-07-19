import { PrismaClient, Prisma } from '@prisma/client';

const VALID_SORTS = ['stars_desc', 'newest', 'name_asc'] as const;
type SortOption = (typeof VALID_SORTS)[number];

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const LIST_SELECT = {
  id: true,
  slug: true,
  name: true,
  owner: true,
  ownerAvatarUrl: true,
  description: true,
  url: true,
  homepage: true,
  language: true,
  license: true,
  topics: true,
  stars: true,
  forks: true,
  openIssues: true,
  logoUrl: true,
  brandColor: true,
  githubCreatedAt: true,
  syncedAt: true,
} as const;

const DETAIL_SELECT = {
  ...LIST_SELECT,
  readmeHtml: true,
  readmeFetchedAt: true,
  defaultBranch: true,
} as const;

export class RepositoriesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listRepositories(params: {
    cursor?: string;
    limit?: number;
    sort?: string;
    language?: string;
    topic?: string;
    q?: string;
  }) {
    const limit = Math.min(
      Number.isFinite(params.limit) ? Math.max(1, params.limit!) : DEFAULT_LIMIT,
      MAX_LIMIT,
    );
    const sort: SortOption = VALID_SORTS.includes(params.sort as SortOption)
      ? (params.sort as SortOption)
      : 'stars_desc';

    const where = this.buildWhereClause({
      language: params.language,
      topic: params.topic,
      q: params.q,
    });

    const orderBy = this.buildOrderBy(sort);

    const [items, total] = await Promise.all([
      this.prisma.repository.findMany({
        take: limit + 1,
        ...(params.cursor && {
          cursor: { id: params.cursor },
          skip: 1,
        }),
        where,
        orderBy,
        select: LIST_SELECT,
      }),
      this.prisma.repository.count({ where }),
    ]);

    const hasMore = items.length > limit;
    const pageItems = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? pageItems[pageItems.length - 1].id : null;

    return {
      items: pageItems,
      nextCursor,
      hasMore,
      total,
    };
  }

  async getRepositoryBySlug(slug: string) {
    return this.prisma.repository.findUnique({
      where: { slug },
      select: DETAIL_SELECT,
    });
  }

  private buildWhereClause(filters: {
    language?: string;
    topic?: string;
    q?: string;
  }): Prisma.RepositoryWhereInput {
    const conditions: Prisma.RepositoryWhereInput[] = [];

    if (filters.language) {
      conditions.push({
        language: { equals: filters.language, mode: 'insensitive' },
      });
    }

    if (filters.topic) {
      conditions.push({ topics: { has: filters.topic } });
    }

    if (filters.q && filters.q.trim().length > 0) {
      const term = filters.q.trim();
      conditions.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { topics: { has: term } },
        ],
      });
    }

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    return { AND: conditions };
  }

  private buildOrderBy(sort: SortOption): Prisma.RepositoryOrderByWithRelationInput[] {
    switch (sort) {
      case 'newest':
        return [{ githubCreatedAt: 'desc' }, { id: 'asc' }];
      case 'name_asc':
        return [{ name: 'asc' }, { id: 'asc' }];
      case 'stars_desc':
      default:
        return [{ stars: 'desc' }, { id: 'asc' }];
    }
  }
}
