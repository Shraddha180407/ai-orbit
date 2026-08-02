import { PrismaClient, Prisma } from '@prisma/client';
import { marked } from 'marked';

const VALID_SORTS = ['stars_desc', 'newest', 'name_asc'] as const;
type SortOption = (typeof VALID_SORTS)[number];

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

// Cloudflare Workers extends CacheStorage with a `default` property that the
// DOM's CacheStorage interface (lib.dom.d.ts) does not include.  We declare a
// narrow local type so we can access it without `any`.
interface CfCacheStorage {
  readonly default: Cache;
}

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
  subCategories: {
    select: {
      subCategory: {
        select: { id: true, name: true, slug: true },
      },
    },
  },
} as const;

const DETAIL_SELECT = {
  ...LIST_SELECT,
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
    owner?: string;
    subCategory?: string;
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
      owner: params.owner,
      subCategory: params.subCategory,
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

    // Resolve company slugs dynamically to avoid N+1 query overhead
    const owners = [...new Set(pageItems.map(item => item.owner))];
    const companies = await this.prisma.company.findMany({
      where: {
        OR: [
          { slug: { in: owners, mode: 'insensitive' } },
          { name: { in: owners, mode: 'insensitive' } }
        ]
      },
      select: {
        slug: true,
        name: true
      }
    });

    const companyMap = new Map<string, string>();
    for (const c of companies) {
      companyMap.set(c.slug.toLowerCase(), c.slug);
      companyMap.set(c.name.toLowerCase(), c.slug);
    }

    const itemsWithCompany = pageItems.map(item => ({
      ...item,
      subCategories: item.subCategories.map(sc => sc.subCategory),
      companySlug: companyMap.get(item.owner.toLowerCase()) || null
    }));

    return {
      items: itemsWithCompany,
      nextCursor,
      hasMore,
      total,
    };
  }

  async getRepositoryBySlug(slug: string, githubToken?: string) {
    const repo = await this.prisma.repository.findUnique({
      where: { slug },
      select: DETAIL_SELECT,
    });

    if (!repo) return null;

    const company = await this.prisma.company.findFirst({
      where: {
        OR: [
          { slug: { equals: repo.owner, mode: 'insensitive' } },
          { name: { equals: repo.owner, mode: 'insensitive' } }
        ]
      },
      select: {
        slug: true
      }
    });

    const readmeHtml = await this.fetchReadmeFromGitHub(
      repo.owner,
      repo.name,
      githubToken,
    );

    return {
      ...repo,
      readmeHtml,
      readmeFetchedAt: readmeHtml !== null ? new Date().toISOString() : null,
      companySlug: company?.slug || null
    };
  }

  private async fetchReadmeFromGitHub(
    owner: string,
    name: string,
    githubToken?: string,
  ): Promise<string | null> {
    const cacheKey = new Request(`https://internal-cache/readme/${owner}/${name}`);
    const cache = (caches as unknown as CfCacheStorage).default;

    // Check cache first
    try {
      const cached = await cache.match(cacheKey);
      if (cached) {
        const cachedData = (await cached.json()) as { readmeHtml: string };
        return cachedData.readmeHtml;
      }
    } catch {
      // Cache read failure — fall through to live fetch
    }

    try {
      const url = `https://api.github.com/repos/${owner}/${name}/readme`;
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'aiorbit-backend',
      };

      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
      }

      const res = await fetch(url, { headers });

      if (!res.ok) return null;

      const data: { content: string; encoding: string } = await res.json();

      if (data.encoding !== 'base64') return null;

      const markdown = Buffer.from(data.content, 'base64').toString('utf-8');
      const html = await marked.parse(markdown) as string;

      // Cache successful fetch (do NOT cache null/empty results)
      if (html) {
        try {
          const response = new Response(
            JSON.stringify({ readmeHtml: html, fetchedAt: new Date().toISOString() }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'max-age=86400',
              },
            },
          );
          await cache.put(cacheKey, response.clone());
        } catch {
          // Cache write failure — non-critical, ignore
        }
      }

      return html;
    } catch {
      return null;
    }
  }

  private buildWhereClause(filters: {
    language?: string;
    topic?: string;
    q?: string;
    owner?: string;
    subCategory?: string;
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

    if (filters.owner) {
      conditions.push({
        OR: [
          { owner: { equals: filters.owner, mode: 'insensitive' } },
          { owner: { equals: `${filters.owner}-ai`, mode: 'insensitive' } }
        ]
      });
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

    if (filters.subCategory) {
      conditions.push({
        subCategories: {
          some: {
            subCategory: { slug: filters.subCategory },
          },
        },
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

  async listRepositoryOwners() {
    // 1. Group by owner and retrieve counts
    const ownersGrouped = await this.prisma.repository.groupBy({
      by: ['owner'],
      _count: {
        id: true,
      },
    });

    // 2. Query all curated companies
    const companies = await this.prisma.company.findMany({
      select: {
        slug: true,
        name: true,
        logoUrl: true,
      },
    });

    // 3. Map owners and enrich with company info
    const ownersMap = ownersGrouped.map((group) => {
      const owner = group.owner;
      const repositoryCount = group._count.id;

      // Clean owner suffix logic (e.g. suno-ai -> suno)
      const cleanOwner = owner.replace(/-ai$/, '').toLowerCase();

      // Find matching company
      const matchingCompany = companies.find(
        (c) => c.slug.toLowerCase() === cleanOwner || c.name.toLowerCase() === cleanOwner
      );

      if (matchingCompany) {
        return {
          owner,
          displayName: matchingCompany.name,
          companySlug: matchingCompany.slug,
          logoUrl: matchingCompany.logoUrl,
          repositoryCount,
        };
      }

      return {
        owner,
        displayName: owner,
        companySlug: null,
        logoUrl: null,
        repositoryCount,
      };
    });

    // 4. Sort by repositoryCount desc
    return ownersMap.sort((a, b) => b.repositoryCount - a.repositoryCount);
  }

  async listRepositorySubCategories() {
    return this.prisma.repositorySubCategory.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    });
  }
}
