import { PrismaClient } from '@prisma/client';

export type SuggestionType = 'tool' | 'company' | 'model' | 'repository' | 'robot' | 'device';

export interface Suggestion {
  id: string;
  type: SuggestionType;
  title: string;
  category: string;
  slug: string | null;
  logoUrl: string | null;
}

const PER_TYPE_LIMIT = 4;

export class SearchService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Cross-entity "as you type" suggestions. Queries Tool/Company/AIModel/
   * Repository/Robot/Device in parallel with a case-insensitive `contains`
   * on name, then merges + ranks so exact/prefix matches float to the top
   * regardless of which table they came from.
   */
  async autocomplete(q: string, limit = 8): Promise<Suggestion[]> {
    const term = q.trim();
    if (!term) return [];

    const [tools, companies, models, repositories, robots, devices] = await Promise.all([
      this.prisma.tool.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { avgRating: 'desc' },
        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          categories: { take: 1, select: { category: { select: { name: true } } } },
        },
      }),
      this.prisma.company.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { name: 'asc' },
        select: { id: true, slug: true, name: true, logoUrl: true },
      }),
      this.prisma.aIModel.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          creator: true,
          provider: { select: { logoUrl: true } },
        },
      }),
      this.prisma.repository.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { stars: 'desc' },
        select: { id: true, slug: true, name: true, language: true, logoUrl: true },
      }),
      this.prisma.robot.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { name: 'asc' },
        select: { id: true, slug: true, name: true, category: true, logoUrl: true },
      }),
      this.prisma.device.findMany({
        where: { name: { contains: term, mode: 'insensitive' } },
        take: PER_TYPE_LIMIT,
        orderBy: { name: 'asc' },
        select: { id: true, slug: true, name: true, category: true, imageUrl: true },
      }),
    ]);

    const suggestions: Suggestion[] = [
      ...tools.map((t) => ({
        id: t.id,
        type: 'tool' as const,
        title: t.name,
        category: t.categories[0]?.category?.name ?? 'Tool',
        slug: t.slug,
        logoUrl: t.logoUrl,
      })),
      ...companies.map((c) => ({
        id: c.id,
        type: 'company' as const,
        title: c.name,
        category: 'Company',
        slug: c.slug,
        logoUrl: c.logoUrl,
      })),
      ...models.map((m) => ({
        id: m.id,
        type: 'model' as const,
        title: m.name,
        category: m.creator || 'Model',
        slug: m.slug,
        logoUrl: m.provider?.logoUrl ?? null,
      })),
      ...repositories.map((r) => ({
        id: r.id,
        type: 'repository' as const,
        title: r.name,
        category: r.language || 'Repository',
        slug: r.slug,
        logoUrl: r.logoUrl,
      })),
      ...robots.map((r) => ({
        id: r.id,
        type: 'robot' as const,
        title: r.name,
        category: r.category || 'Robot',
        slug: r.slug,
        logoUrl: r.logoUrl,
      })),
      ...devices.map((d) => ({
        id: d.id,
        type: 'device' as const,
        title: d.name,
        category: d.category || 'Device',
        slug: d.slug,
        logoUrl: d.imageUrl,
      })),
    ];

    const lowerTerm = term.toLowerCase();
    suggestions.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(lowerTerm) ? 0 : 1;
      const bStarts = b.title.toLowerCase().startsWith(lowerTerm) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;
      return a.title.length - b.title.length;
    });

    return suggestions.slice(0, limit);
  }

  /** Popular search terms — proxied by the highest-rated, most-reviewed tool names. */
  async popular(limit = 6): Promise<string[]> {
    const topTools = await this.prisma.tool.findMany({
      orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
      select: { name: true },
    });

    if (topTools.length > 0) return topTools.map((t) => t.name);

    // Fallback for a freshly-seeded DB with no ratings yet.
    const newestTools = await this.prisma.tool.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { name: true },
    });
    return newestTools.map((t) => t.name);
  }

  /**
   * Featured tools for the empty-query state of the search dropdown —
   * same ranking as popular(), but returns enough (slug/category) to
   * render a real row + link instead of just a plain search term.
   */
  async featured(limit = 6): Promise<Suggestion[]> {
    const select = {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      categories: { take: 1, select: { category: { select: { name: true } } } },
    } as const;

    const topTools = await this.prisma.tool.findMany({
      orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
      take: limit,
      select,
    });

    const rows = topTools.length > 0
      ? topTools
      : await this.prisma.tool.findMany({
          orderBy: { createdAt: 'desc' },
          take: limit,
          select,
        });

    return rows.map((t) => ({
      id: t.id,
      type: 'tool' as const,
      title: t.name,
      category: t.categories[0]?.category?.name ?? 'Tool',
      slug: t.slug,
      logoUrl: t.logoUrl,
    }));
  }
}