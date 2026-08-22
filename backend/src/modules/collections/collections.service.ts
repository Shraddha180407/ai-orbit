import { Prisma, PrismaClient } from '@prisma/client';

const PAGE_SIZE = 12;
/** Categories with at least this many tools get the "Featured" ribbon. */
const FEATURED_THRESHOLD = 6;

const TOOL_CARD_SELECT = {
  id: true,
  slug: true,
  name: true,
  logoUrl: true,
  description: true,
  pricingModel: true,
  pricingAmount: true,
  billingFrequency: true,
  avgRating: true,
  updatedAt: true,
  categories: { select: { category: { select: { slug: true, name: true } } } },
  tags: { select: { tag: { select: { slug: true, name: true } } } },
  _count: { select: { reviews: true, bookmarks: true } },
  company: { select: { slug: true, name: true } },
};

function serializeTool(t: Prisma.ToolGetPayload<{ select: typeof TOOL_CARD_SELECT }>) {
  return {
    ...t,
    pricingAmount: t.pricingAmount?.toString() ?? null,
    avgRating: t.avgRating > 0 ? t.avgRating : null,
  };
}

export class CollectionsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * There's no standalone Collection model in the schema — this project
   * groups tools by Category instead, and treats every category that has
   * tools in it as one curated "collection" (matching TAAFT's collections
   * concept: a named, described bundle of tools for a specific job).
   */
  async listCollections(params: { category?: string; page?: number }) {
    const page = Math.max(1, params.page ?? 1);

    // 1. Check if DB has explicit collections
    let explicitCollections: any[] = [];
    try {
      explicitCollections = await this.prisma.collection.findMany({
        orderBy: { updatedAt: 'desc' },
        include: {
          creator: { select: { name: true, image: true } },
          categories: true,
          subCategories: { include: { subCategory: true } },
          tools: { include: { tool: { select: { id: true, name: true, logoUrl: true, slug: true } } } },
        },
      });
    } catch {}

    if (explicitCollections.length > 0) {
      const allItems = explicitCollections.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        title: c.name,
        description: c.description || `Curated bundle of ${c.name} tools.`,
        creatorName: c.creator?.name || 'AI Orbit Curators',
        creatorAvatar: c.creator?.image || '',
        creatorType: c.creatorType || 'EDITORIAL',
        isFeatured: c.isFeatured,
        isCurated: c.isCurated,
        category: c.categories?.[0]?.categoryName || 'General',
        categories: c.categories || [],
        subCategories: c.subCategories || [],
        toolCount: c.tools?.length || c.toolCount || 0,
        updatedAt: (c.updatedAt || new Date()).toISOString(),
        tools: c.tools?.map((t: any) => t.tool) || [],
      }));

      const filtered = params.category
        ? allItems.filter((item) => item.category.toLowerCase() === params.category!.toLowerCase())
        : allItems;

      const total = filtered.length;
      const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

      return {
        items,
        pagination: { total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) },
      };
    }

    // 2. If no explicit collections in DB, build collections dynamically from all Categories
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        slug: true,
        name: true,
        tools: {
          orderBy: { tool: { avgRating: 'desc' } },
          take: 8,
          select: {
            tool: { select: { id: true, slug: true, name: true, logoUrl: true, updatedAt: true } },
          },
        },
        _count: { select: { tools: true } },
      },
    });

    const allItems = categories.map((cat) => {
      const previewTools = cat.tools.map((t) => ({
        id: t.tool.id,
        slug: t.tool.slug,
        name: t.tool.name,
        logoUrl: t.tool.logoUrl,
      }));
      const latestUpdate = cat.tools.reduce<Date | null>((max, t) => {
        const updated = t.tool.updatedAt;
        return !max || updated > max ? updated : max;
      }, null);

      return {
        id: cat.id,
        slug: cat.slug,
        name: `Best ${cat.name} Tools`,
        title: `Best ${cat.name} Tools`,
        description: `A curated bundle of top ${cat.name.toLowerCase()} tools and AI solutions.`,
        creatorName: 'AI Orbit Curators',
        creatorType: 'EDITORIAL' as const,
        isFeatured: cat._count.tools >= FEATURED_THRESHOLD || true,
        isCurated: true,
        category: cat.name,
        categories: [{ categoryName: cat.name }],
        subCategories: [{ subCategory: { slug: cat.slug, name: cat.name } }],
        updatedAt: (latestUpdate ?? new Date()).toISOString(),
        toolCount: Math.max(cat._count.tools, previewTools.length, 1),
        tools: previewTools,
      };
    });

    const categoryCounts: Record<string, number> = {};
    for (const item of allItems) {
      categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
    }

    const filtered = params.category
      ? allItems.filter((item) => item.category.toLowerCase() === params.category!.toLowerCase())
      : allItems;

    const total = filtered.length;
    const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return {
      items,
      pagination: { total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) },
      categoryCounts,
    };
  }

  async getCollectionBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        tools: {
          orderBy: { tool: { avgRating: 'desc' } },
          select: { tool: { select: TOOL_CARD_SELECT } },
        },
      },
    });

    if (!category) return null;

    const tools = category.tools.map((t) => serializeTool(t.tool));
    const latestUpdate = category.tools.reduce<Date | null>((max, t) => {
      const updated = t.tool.updatedAt;
      return updated && (!max || updated > max) ? updated : max;
    }, null);

    return {
      id: category.id,
      slug: category.slug,
      title: `Best ${category.name} Tools`,
      description: `A curated bundle of the top ${category.name.toLowerCase()} tools, ranked by rating.`,
      curatedBy: 'AI Orbit Team',
      category: category.name,
      featured: tools.length >= FEATURED_THRESHOLD,
      updatedAt: (latestUpdate ?? new Date()).toISOString(),
      toolCount: tools.length,
      tools,
    };
  }
}
