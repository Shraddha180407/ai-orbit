import { PrismaClient, Prisma, PricingModel } from '@prisma/client';

type ToolCard = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  description: string;
  pricingModel: PricingModel;
  pricingAmount: string | null;
  billingFrequency: string | null;
  avgRating: number | null;
  createdAt: Date;
  releaseDate: Date | null;
  isOpenSource: boolean;
  isTrending: boolean;
  verified: boolean;
  upvoteCount: number;
  categories: { category: { slug: string; name: string } }[];
  tags: { tag: { slug: string; name: string } }[];
  ttasks?: { task: { slug: string; title: string } }[];
  _count: { reviews: number; bookmarks: number };
  company: { slug: string; name: string } | null;
};

const CATEGORY_ALIASES: Record<string, { categories: string[]; keywords?: string[] }> = {
  // Main directory modes
  'creativity': {
    categories: ['3d-generation', 'presentations', 'marketing', 'no-code', 'productivity'],
    keywords: ['image', 'video', 'art', 'design', 'music', 'animation', 'render', 'write', 'draw', 'photo', 'code', 'game']
  },
  'personal': {
    categories: ['education', 'chatbots', 'productivity', 'workflow-automation', 'business'],
    keywords: ['learn', 'health', 'fitness', 'wellness', 'travel', 'food', 'fashion', 'mindful', 'habit', 'money', 'finance', 'companion']
  },

  // Creativity subcategories
  'image-generation': { categories: ['3d-generation'], keywords: ['image', 'photo', 'art', 'draw', 'picture', 'design'] },
  'video-creation': { categories: ['presentations'], keywords: ['video', 'animation', 'render', 'movie', 'clip'] },
  'writing': { categories: ['marketing', 'productivity'], keywords: ['write', 'copy', 'content', 'text', 'essay', 'blog'] },
  'software-development': { categories: ['no-code'], keywords: ['code', 'developer', 'programming', 'software', 'git'] },
  'music': { categories: [], keywords: ['music', 'song', 'audio', 'sound', 'melody', 'beat', 'voice'] },
  'graphic-design': { categories: ['marketing', '3d-generation'], keywords: ['design', 'graphic', 'logo', 'banner', 'canvas'] },
  'digital-art': { categories: ['3d-generation'], keywords: ['art', 'illustration', 'draw', 'anime', 'canvas'] },
  'brainstorming': { categories: ['chatbots', 'productivity'], keywords: ['idea', 'brainstorm', 'think', 'mindmap', 'plan'] },
  '3d-creation': { categories: ['3d-generation'], keywords: ['3d', 'model', 'mesh', 'render', 'blender', 'spatial'] },
  'presentation-design': { categories: ['presentations'], keywords: ['presentation', 'slide', 'deck', 'pitch'] },
  'storytelling': { categories: ['marketing'], keywords: ['story', 'novel', 'script', 'narrative', 'character', 'write'] },
  'content-creation': { categories: ['marketing', 'productivity'], keywords: ['content', 'creator', 'social', 'media', 'post'] },
  'branding': { categories: ['marketing'], keywords: ['brand', 'logo', 'identity', 'business'] },
  'motion-graphics': { categories: [], keywords: ['motion', 'animation', 'vfx', 'graphics', 'video'] },
  'game-creation': { categories: ['3d-generation'], keywords: ['game', 'unity', 'unreal', 'gaming', 'engine'] },

  // Personal subcategories
  'relationships': { categories: ['chatbots'], keywords: ['companion', 'dating', 'relationship', 'friend', 'chat'] },
  'education': { categories: ['education'], keywords: ['learn', 'study', 'course', 'tutor', 'student', 'school'] },
  'learning': { categories: ['education'], keywords: ['learn', 'study', 'read', 'knowledge', 'skill'] },
  'health-wellness': { categories: [], keywords: ['health', 'fitness', 'wellness', 'diet', 'workout', 'sleep', 'medical'] },
  'personal-development': { categories: ['productivity', 'workflow-automation'], keywords: ['habit', 'goal', 'routine', 'self-improvement', 'growth'] },
  'travel': { categories: [], keywords: ['travel', 'trip', 'flight', 'hotel', 'itinerary', 'vacation'] },
  'finance-wealth': { categories: ['business'], keywords: ['finance', 'money', 'budget', 'invest', 'crypto', 'wealth'] },
  'entertainment': { categories: ['chatbots'], keywords: ['entertainment', 'game', 'play', 'movie', 'music'] },
  'food-nutrition': { categories: [], keywords: ['food', 'recipe', 'meal', 'diet', 'nutrition', 'cook'] },
  'shopping': { categories: ['business', 'marketing'], keywords: ['shop', 'store', 'buy', 'product', 'deal', 'ecommerce'] },
  'fashion-style': { categories: [], keywords: ['fashion', 'style', 'outfit', 'clothes', 'wear'] },
  'mindfulness': { categories: [], keywords: ['meditation', 'mindful', 'calm', 'peace', 'mental', 'relax'] },
  'life-coaching': { categories: ['chatbots'], keywords: ['coach', 'advice', 'mentor', 'guide', 'career'] },
  'home-decor': { categories: ['3d-generation'], keywords: ['home', 'decor', 'interior', 'room', 'furniture', 'house'] },
  'insurance-advisor': { categories: ['business'], keywords: ['insurance', 'policy', 'claim', 'advisor', 'coverage'] },
};

export class ToolsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listTools(filters: {
    q?: string;
    category?: string;
    pricing?: PricingModel;
    sort?: string;
    page?: number;
    pageSize?: number;
  }) {
    const pageNum = Math.max(1, filters.page || 1);
    const limit = filters.pageSize || 100;
    const skip = (pageNum - 1) * limit;

    const where: Prisma.ToolWhereInput = {};

    if (filters.q && filters.q.trim().length > 0) {
      where.OR = [
        { name: { contains: filters.q.trim(), mode: 'insensitive' } },
        { description: { contains: filters.q.trim(), mode: 'insensitive' } },
      ];
    }

    if (filters.category) {
      const catSlug = filters.category.toLowerCase().trim();
      const aliasConfig = CATEGORY_ALIASES[catSlug];
      if (aliasConfig) {
        const categoryConditions: Prisma.ToolWhereInput[] = [
          { categories: { some: { category: { slug: { in: [catSlug, ...aliasConfig.categories] } } } } },
          { tags: { some: { tag: { slug: { in: [catSlug, ...aliasConfig.categories] } } } } },
        ];
        if (aliasConfig.keywords && aliasConfig.keywords.length > 0) {
          categoryConditions.push({
            OR: aliasConfig.keywords.map(kw => ({
              OR: [
                { name: { contains: kw, mode: 'insensitive' as const } },
                { description: { contains: kw, mode: 'insensitive' as const } },
              ]
            }))
          });
        }
        where.AND = [
          ...(where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : []),
          { OR: categoryConditions }
        ];
      } else {
        where.categories = { some: { category: { slug: catSlug } } };
      }
    }

    if (filters.pricing) {
      where.pricingModel = filters.pricing;
    }

    // 🔥 1. Define the normal sort from the UI dropdown
    let userSort: Prisma.ToolOrderByWithRelationInput = { createdAt: 'desc' };

    switch (filters.sort) {
      case 'oldest': userSort = { createdAt: 'asc' }; break;
      case 'newest': userSort = { createdAt: 'desc' }; break;
      case 'name-asc': userSort = { name: 'asc' }; break;
      case 'name-desc': userSort = { name: 'desc' }; break;
      case 'rating':
      case 'top-rated': userSort = { avgRating: 'desc' }; break;
      case 'popular': userSort = { upvoteCount: 'desc' }; break;
      case 'trending': userSort = { isTrending: 'desc' }; break;
    }

    // 🔥 2. Force Prisma to prioritize tools with tasks first!
    const orderBy: Prisma.ToolOrderByWithRelationInput[] = [
      { ttasks: { _count: 'desc' } }, // Priority 1: Highest task count goes to the top
      userSort                        // Priority 2: Then apply the dropdown sort (Newest, Popular, etc.)
    ];

    const selectFields = {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      description: true,
      pricingModel: true,
      pricingAmount: true,
      billingFrequency: true,
      avgRating: true,
      createdAt: true,
      releaseDate: true,
      isOpenSource: true,
      isTrending: true,
      verified: true,
      upvoteCount: true,
      compatibility: true,
      launchDate: true,
      hasApi: true,
      useCases: true,
      categories: { select: { category: { select: { slug: true, name: true } } } },
      tags: { select: { tag: { select: { slug: true, name: true } } } },
      ttasks: { select: { task: { select: { slug: true, title: true } } } },
      _count: { select: { reviews: true, bookmarks: true } },
      company: { select: { slug: true, name: true } }
    };

    const [tools, total, categoriesList] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: selectFields,
      }),
      this.prisma.tool.count({ where }),
      this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          slug: true,
          name: true,
          _count: { select: { tools: true } },
        },
      }),
    ]);

    return {
      tools: tools.map((t) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      })),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      sort: filters.sort || 'newest',
      categories: categoriesList,
    };
  }

  async getToolDetails(slug: string, userId?: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        screenshots: true,
        features: true,
        pros: true,
        cons: true,
        releaseDate: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        reviewCount: true,
        upvoteCount: true,
        isOpenSource: true,
        isTrending: true,
        verified: true,
        compatibility: true,
        targetUsers: true,
        hasApi: true,
        apiDocsUrl: true,
        performanceScore: true,
        createdAt: true,

        longDescription: true,
        videoUrl: true,
        releasedBy: true,
        country: true,
        launchDate: true,
        views: true,
        useCases: true,
        pricingTiers: true,
        verdict: true,
        linkedInUrl: true,
        twitterUrl: true,
        githubUrl: true,
        alternativeIds: true,

        company: { select: { slug: true, name: true, logoUrl: true } },
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        ttasks: { select: { task: { select: { slug: true, title: true } } } },
        integrations: { select: { integration: { select: { slug: true, name: true, logoUrl: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    });

    if (!tool) return null;

    const withRelations = await this.prisma.tool.findUnique({
      where: { id: tool.id },
      select: {
        alternatives: { select: { id: true } },
        categories: { select: { categoryId: true } },
      },
    });

    let similarTools: ToolCard[] = [];
    if (withRelations) {
      const alternativeIds = withRelations.alternatives.map((a) => a.id);
      const categoryIds = withRelations.categories.map((cat) => cat.categoryId);

      const cardSelect = {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        createdAt: true,
        releaseDate: true,
        isOpenSource: true,
        isTrending: true,
        verified: true,
        upvoteCount: true,
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        ttasks: { select: { task: { select: { slug: true, title: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
        company: { select: { slug: true, name: true } }
      };

      const curated = alternativeIds.length
        ? await this.prisma.tool.findMany({ where: { id: { in: alternativeIds } }, select: cardSelect })
        : [];

      similarTools = curated.map((t) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      }));

      if (similarTools.length < 4 && categoryIds.length > 0) {
        const excludeIds = [tool.id, ...similarTools.map((t) => t.id)];
        const fillers = await this.prisma.tool.findMany({
          where: {
            id: { notIn: excludeIds },
            categories: { some: { categoryId: { in: categoryIds } } },
          },
          orderBy: { avgRating: 'desc' },
          take: 4 - similarTools.length,
          select: cardSelect,
        });
        similarTools = [
          ...similarTools,
          ...fillers.map((t) => ({
            ...t,
            pricingAmount: t.pricingAmount?.toString() ?? null,
            avgRating: t.avgRating > 0 ? t.avgRating : null,
          }))
        ];
      }
    }

    const reviews = await this.prisma.review.findMany({
      where: { toolId: tool.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    let bookmarked = false;
    if (userId) {
      const bookmark = await this.prisma.bookmark.findUnique({
        where: { toolId_userId: { toolId: tool.id, userId } },
        select: { id: true },
      });
      bookmarked = Boolean(bookmark);
    }

    return {
      tool: {
        ...tool,
        pricingAmount: tool.pricingAmount?.toString() ?? null,
        avgRating: tool.avgRating > 0 ? tool.avgRating : null,
      },
      similarTools,
      reviews: reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      bookmarked,
    };
  }

  async createOrUpdateReview(toolId: string, userId: string, rating: number, comment: string) {
    await this.prisma.review.upsert({
      where: { toolId_userId: { toolId, userId } },
      update: { rating, comment },
      create: { toolId, userId, rating, comment },
    });

    await this.recomputeToolRating(toolId);
  }

  async toggleBookmark(toolId: string, userId: string) {
    const existing = await this.prisma.bookmark.findUnique({
      where: { toolId_userId: { toolId, userId } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.bookmark.delete({ where: { id: existing.id } });
      return false;
    } else {
      await this.prisma.bookmark.create({ data: { toolId, userId } });
      return true;
    }
  }

  private async recomputeToolRating(toolId: string) {
    const reviews = await this.prisma.review.findMany({ where: { toolId }, select: { rating: true } });
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    await this.prisma.tool.update({ where: { id: toolId }, data: { avgRating: avg, reviewCount: count } });
  }
}