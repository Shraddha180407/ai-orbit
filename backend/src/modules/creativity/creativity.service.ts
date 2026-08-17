import { PrismaClient, Prisma, CreativityCategory } from '@prisma/client';
import type { CreativityListQuery } from './creativity.schema.js';

const RELATED_LIMIT = 6;

const companySelect = {
  id: true,
  slug: true,
  name: true,
  logoUrl: true,
} as const;

// Static metadata for the 15 Creativity subcategories.
// These map 1:1 to the CreativityCategory enum in schema.prisma.
// No dedicated table exists for these (Creativity is a tag layer on Tool),
// so this list is the source of truth for names/descriptions shown in the UI.
const CREATIVITY_CATEGORY_META: Record<CreativityCategory, { name: string; slug: string; description: string }> = {
  IMAGE_GENERATION: {
    name: 'Image Generation',
    slug: 'image-generation',
    description: 'AI tools for creating images, illustrations, artwork, and graphics.',
  },
  WRITING: {
    name: 'Writing',
    slug: 'writing',
    description: 'AI tools for writing, rewriting, summarization, translation, and proofreading.',
  },
  SOFTWARE_DEVELOPMENT: {
    name: 'Software Development',
    slug: 'software-development',
    description: 'AI tools for coding, website building, app development, and DevOps.',
  },
  VIDEO_CREATION: {
    name: 'Video Creation',
    slug: 'video-creation',
    description: 'AI tools for video generation, editing, animation, captions, and dubbing.',
  },
  MUSIC: {
    name: 'Music',
    slug: 'music',
    description: 'AI tools for music generation, voice cloning, speech synthesis, and audio editing.',
  },
  GRAPHIC_DESIGN: {
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'AI tools for logos, posters, UI/UX, branding, and creative design.',
  },
  DIGITAL_ART: {
    name: 'Digital Art',
    slug: 'digital-art',
    description: 'AI tools for concept art, illustrations, painting, and digital creativity.',
  },
  BRAINSTORMING: {
    name: 'Brainstorming',
    slug: 'brainstorming',
    description: 'AI tools for idea generation, mind mapping, naming, and creative thinking.',
  },
  THREE_D_CREATION: {
    name: '3D Creation',
    slug: '3d-creation',
    description: 'AI tools for 3D models, rendering, animation, and game assets.',
  },
  PRESENTATION_DESIGN: {
    name: 'Presentation Design',
    slug: 'presentation-design',
    description: 'AI tools for creating presentations, slide decks, and visual storytelling.',
  },
  STORYTELLING: {
    name: 'Storytelling',
    slug: 'storytelling',
    description: 'AI tools for story writing, script generation, books, and storytelling.',
  },
  CONTENT_CREATION: {
    name: 'Content Creation',
    slug: 'content-creation',
    description: 'AI tools for blogs, social media, marketing content, and copywriting.',
  },
  BRANDING: {
    name: 'Branding',
    slug: 'branding',
    description: 'AI tools for brand identity, slogans, naming, and brand assets.',
  },
  MOTION_GRAPHICS: {
    name: 'Motion Graphics',
    slug: 'motion-graphics',
    description: 'AI tools for motion design, VFX, transitions, and animated graphics.',
  },
  GAME_CREATION: {
    name: 'Game Creation',
    slug: 'game-creation',
    description: 'AI tools for game development, asset generation, level design, and game content.',
  },
};

export class CreativityService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listCreativityCategories() {
    return (Object.keys(CREATIVITY_CATEGORY_META) as CreativityCategory[]).map((key) => ({
      value: key,
      ...CREATIVITY_CATEGORY_META[key],
    }));
  }

  async listCreativityTools(query: CreativityListQuery) {
    const { page, limit, sort, search, category, pricingModel, openSource, verified } = query;

    const and: Prisma.ToolWhereInput[] = [
      // Only tools tagged with at least one Creativity category belong in this module
      { creativityCategories: { isEmpty: false } },
    ];

    if (search && search.trim().length > 0) {
      const term = search.trim();
      and.push({
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    if (category) {
      and.push({ creativityCategories: { has: category as CreativityCategory } });
    }

    if (pricingModel) {
      and.push({ pricingModel: pricingModel as Prisma.EnumPricingModelFilter['equals'] });
    }

    if (openSource !== undefined) {
      and.push({ isOpenSource: openSource });
    }

    if (verified !== undefined) {
      and.push({ verified });
    }

    const where: Prisma.ToolWhereInput = { AND: and };

    let orderBy: Prisma.ToolOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'alphabetical':
        orderBy = { name: 'asc' };
        break;
      case 'topRated':
        orderBy = { avgRating: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const [items, total, categoryCounts] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          company: { select: companySelect },
        },
      }),
      this.prisma.tool.count({ where }),
      this.getCategoryCounts(),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasMore: page * limit < total,
      },
      filters: {
        categories: categoryCounts,
      },
    };
  }

  async getCreativityToolBySlug(slug: string) {
    const tool = await this.prisma.tool.findUnique({
      where: { slug },
      include: {
        company: { select: companySelect },
      },
    });

    if (!tool || tool.creativityCategories.length === 0) return null;

    const relatedTools = await this.prisma.tool.findMany({
      where: {
        id: { not: tool.id },
        creativityCategories: { hasSome: tool.creativityCategories },
      },
      take: RELATED_LIMIT,
      orderBy: { avgRating: 'desc' },
      include: {
        company: { select: companySelect },
      },
    });

    return { ...tool, relatedTools };
  }

  async getFilterOptions() {
    const [categoryCounts, pricingModels] = await Promise.all([
      this.getCategoryCounts(),
      this.prisma.tool.findMany({
        where: { creativityCategories: { isEmpty: false } },
        select: { pricingModel: true },
        distinct: ['pricingModel'],
      }),
    ]);

    return {
      categories: categoryCounts,
      pricingModels: pricingModels.map((t) => t.pricingModel),
    };
  }

  private async getCategoryCounts() {
    const categories = Object.keys(CREATIVITY_CATEGORY_META) as CreativityCategory[];

    const counts = await Promise.all(
      categories.map((cat) =>
        this.prisma.tool.count({ where: { creativityCategories: { has: cat } } }),
      ),
    );

    return categories.map((cat, i) => ({
      value: cat,
      ...CREATIVITY_CATEGORY_META[cat],
      count: counts[i],
    }));
  }
}
