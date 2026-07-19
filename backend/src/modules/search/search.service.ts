import { PrismaClient } from '@prisma/client';

export type AutocompleteEntityType =
  | 'tool'
  | 'company'
  | 'model'
  | 'news'
  | 'video'
  | 'repository'
  | 'robot'
  | 'device';

export interface AutocompleteSuggestion {
  id: string;
  type: AutocompleteEntityType;
  title: string;
  category: string;
}

const PER_TABLE_LIMIT = 5;
const TOTAL_LIMIT = 8;

export class SearchService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Fans a single query out across every real entity table and merges the
   * results into one ranked list. This is the live replacement for the
   * frontend's MOCK_ENTITIES catalog — same AutocompleteSuggestion shape
   * (id/type/title/category) the UI already expects, just sourced from
   * Postgres instead of an in-memory array.
   */
  async autocomplete(rawQuery: string): Promise<AutocompleteSuggestion[]> {
    const q = rawQuery.trim();
    if (!q) return [];

    const [tools, companies, models, news, videos, repositories, robots, devices] = await Promise.all([
      this.prisma.tool.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { avgRating: 'desc' },
        select: {
          id: true,
          name: true,
          categories: { take: 1, select: { category: { select: { name: true } } } },
        },
      }),
      this.prisma.company.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true },
      }),
      this.prisma.aIModel.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, creator: true },
      }),
      this.prisma.news.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, category: true },
      }),
      this.prisma.video.findMany({
        where: { title: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { views: 'desc' },
        select: { id: true, title: true, toolCategory: true },
      }),
      this.prisma.repository.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { stars: 'desc' },
        select: { id: true, name: true, language: true },
      }),
      this.prisma.robot.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, category: true },
      }),
      this.prisma.device.findMany({
        where: { name: { contains: q, mode: 'insensitive' } },
        take: PER_TABLE_LIMIT,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, category: true },
      }),
    ]);

    const results: AutocompleteSuggestion[] = [
      ...tools.map((t) => ({
        id: t.id,
        type: 'tool' as const,
        title: t.name,
        category: t.categories[0]?.category.name ?? 'AI Tool',
      })),
      ...companies.map((c) => ({ id: c.id, type: 'company' as const, title: c.name, category: 'Company' })),
      ...models.map((m) => ({ id: m.id, type: 'model' as const, title: m.name, category: m.creator })),
      ...news.map((n) => ({ id: n.id, type: 'news' as const, title: n.title, category: n.category })),
      ...videos.map((v) => ({ id: v.id, type: 'video' as const, title: v.title, category: v.toolCategory })),
      ...repositories.map((r) => ({ id: r.id, type: 'repository' as const, title: r.name, category: r.language })),
      ...robots.map((r) => ({ id: r.id, type: 'robot' as const, title: r.name, category: r.category })),
      ...devices.map((d) => ({ id: d.id, type: 'device' as const, title: d.name, category: d.category })),
    ];

    // Rank so exact/starts-with title matches surface first, matching the
    // relevance behavior the mock implementation used to have.
    const lowerQ = q.toLowerCase();
    results.sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(lowerQ) ? 1 : 0;
      const bStarts = b.title.toLowerCase().startsWith(lowerQ) ? 1 : 0;
      if (aStarts !== bStarts) return bStarts - aStarts;
      return a.title.length - b.title.length;
    });

    return results.slice(0, TOTAL_LIMIT);
  }

  /**
   * Shown when the search box is empty. Real proxy for "popular searches":
   * the highest-rated tool names plus the categories with the most tools,
   * instead of a hardcoded term list.
   */
  async popularSearches(): Promise<string[]> {
    const [topTools, topCategories] = await Promise.all([
      this.prisma.tool.findMany({
        take: 5,
        orderBy: [{ avgRating: 'desc' }, { reviewCount: 'desc' }],
        where: { avgRating: { gt: 0 } },
        select: { name: true },
      }),
      this.prisma.category.findMany({
        take: 4,
        orderBy: { tools: { _count: 'desc' } },
        select: { name: true },
      }),
    ]);

    const terms = [...topTools.map((t) => t.name), ...topCategories.map((c) => c.name)];
    return Array.from(new Set(terms)).slice(0, 6);
  }
}
