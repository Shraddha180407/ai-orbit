import { PrismaClient, Prisma, MCPItemType, MCPPricingType, BillingCycle, EditorialGrade } from '@prisma/client';
import type { MCPItemWithRelations, ReviewResponseDTO, DiscussionResponseDTO } from '../types/index.js';
import { MCPError } from '../middleware/error.js';

export class MCPService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private transformMCPItem(item: {
    id: string;
    itemType: MCPItemType;
    name: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    providerName: string;
    pricingType: MCPPricingType;
    isFeatured: boolean;
    isVerified: boolean;
    viewCount: number;
    monthlyVisits: number;
    upvoteCount: number;
    saveCount: number;
    createdAt: Date;
    updatedAt: Date;
    lastUpdatedDate: Date;
    categories?: Array<{
      category: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        icon?: string | null;
        color?: string | null;
      };
    }>;
    subCategories?: Array<{
      subCategory: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        categoryId: string;
      };
    }>;
    tags?: Array<{
      tag: {
        id: string;
        slug: string;
        name: string;
      };
    }>;
    features?: Array<{
      id: string;
      title: string;
      icon?: string | null;
      description: string;
      badge?: string | null;
    }>;
    pricingPlans?: Array<{
      id: string;
      planName: string;
      price: unknown;
      billingCycle: BillingCycle;
      featuresList: string[];
    }>;
    reviews?: Array<{
      id: string;
      rating: number;
      comment?: string | null;
      createdAt: Date;
      updatedAt: Date;
      mcpItemId: string;
      userId: string;
      user: {
        id: string;
        name?: string | null;
        email: string;
      };
    }>;
    editorialReviews?: Array<{
      id: string;
      grade: EditorialGrade;
      verdict: string;
      reviewDate: Date;
      badge?: string | null;
      notes?: string | null;
    }>;
    discussions?: Array<{
      id: string;
      title: string;
      content: string;
      upvotes: number;
      createdAt: Date;
      updatedAt: Date;
      mcpItemId: string;
      userId: string;
      user: {
        id: string;
        name?: string | null;
        email: string;
      };
      replies?: Array<{
        id: string;
        content: string;
        upvotes: number;
        createdAt: Date;
        updatedAt: Date;
        discussionId: string;
        userId: string;
        user: {
          id: string;
          name?: string | null;
          email: string;
        };
      }>;
    }>;
    faqs?: Array<{
      id: string;
      question: string;
      answer: string;
    }>;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    providerUrl?: string | null;
    license?: string | null;
    websiteUrl?: string | null;
    documentationUrl?: string | null;
    repositoryUrl?: string | null;
    startingPrice?: unknown;
    launchDate?: Date | null;
  }): MCPItemWithRelations {
    const {
      categories: _rawCategories,
      subCategories: _rawSubCategories,
      tags: _rawTags,
      features: _rawFeatures,
      pricingPlans: _rawPricingPlans,
      reviews: _rawReviews,
      editorialReviews: _rawEditorialReviews,
      discussions: _rawDiscussions,
      faqs: _rawFaqs,
      ...baseFields
    } = item;

    return {
      ...baseFields,
      categories: _rawCategories?.map((c) => ({
        ...c.category,
        description: c.category.description || undefined,
        icon: c.category.icon || undefined,
        color: c.category.color || undefined,
      })),
      subCategories: _rawSubCategories?.map((s) => ({
        ...s.subCategory,
        description: s.subCategory.description || undefined,
      })),
      tags: _rawTags?.map((t) => t.tag),
      features: _rawFeatures?.map((f) => ({
        ...f,
        icon: f.icon || undefined,
        badge: f.badge || undefined,
      })),
      pricingPlans: _rawPricingPlans?.map((p) => ({
        ...p,
        price: Number(p.price),
        billingCycle: p.billingCycle as BillingCycle,
      })),
      reviews: _rawReviews?.map((r) => ({
        ...r,
        comment: r.comment || undefined,
        user: {
          ...r.user,
          name: r.user.name || undefined,
        },
      })),
      logoUrl: item.logoUrl || undefined,
      coverImageUrl: item.coverImageUrl || undefined,
      providerUrl: item.providerUrl || undefined,
      license: item.license || undefined,
      websiteUrl: item.websiteUrl || undefined,
      documentationUrl: item.documentationUrl || undefined,
      repositoryUrl: item.repositoryUrl || undefined,
      editorialReviews: _rawEditorialReviews?.map((er) => ({
        ...er,
        badge: er.badge || undefined,
        notes: er.notes || undefined,
        grade: er.grade as EditorialGrade,
      })),
      discussions: _rawDiscussions?.map((d) => ({
        ...d,
        user: {
          ...d.user,
          name: d.user.name || undefined,
        },
        replies: d.replies?.map((r) => ({
          ...r,
          user: {
            ...r.user,
            name: r.user.name || undefined,
          },
        })),
      })),
      faqs: _rawFaqs,
      startingPrice: item.startingPrice ? Number(item.startingPrice) : undefined,
      launchDate: item.launchDate || undefined,
    };
  }

  async getMCPItems(query: {
    type?: MCPItemType;
    category?: string;
    subCategory?: string;
    pricingType?: MCPPricingType;
    search?: string;
    sortBy?: 'trending' | 'top-rated' | 'most-upvoted' | 'recently-updated';
    page?: number;
    limit?: number;
  }): Promise<{
    items: MCPItemWithRelations[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      type,
      category,
      subCategory,
      pricingType,
      search,
      sortBy = 'recently-updated',
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.MCPItemWhereInput = {};

    if (type) {
      where.itemType = type;
    }

    if (pricingType) {
      where.pricingType = pricingType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
        { providerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    if (subCategory) {
      where.subCategories = {
        some: {
          subCategory: {
            slug: subCategory,
          },
        },
      };
    }

    // Build orderBy clause based on sortBy parameter
    let orderBy: Prisma.MCPItemOrderByWithRelationInput[] = [];
    
    switch (sortBy) {
      case 'trending':
        orderBy = [
          { monthlyVisits: 'desc' },
          { viewCount: 'desc' },
        ];
        break;
      case 'top-rated':
        orderBy = [
          { qualityScore: 'desc' },
          { reviews: { _count: 'desc' } },
        ];
        break;
      case 'most-upvoted':
        orderBy = [
          { upvoteCount: 'desc' },
        ];
        break;
      case 'recently-updated':
      default:
        orderBy = [
          { lastUpdatedDate: 'desc' },
        ];
        break;
    }

    // Add featured items first
    orderBy.unshift({ isFeatured: 'desc' });

    const [items, total] = await Promise.all([
      this.prisma.mCPItem.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          subCategories: {
            include: {
              subCategory: true,
            },
          },
          tags: {
            include: {
              tag: true,
            },
          },
          technicalSpecs: true,
          installationGuides: {
            orderBy: {
              stepNumber: 'asc',
            },
          },
          features: true,
          useCases: true,
          pricingPlans: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 5, // Only get latest 5 reviews
          },
          editorialReviews: true,
          discussions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              replies: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: 'asc',
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 3, // Only get latest 3 discussions
          },
          faqs: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.mCPItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(item => this.transformMCPItem(item)),
      total,
      page,
      totalPages,
    };
  }

  async getMCPItemBySlug(slug: string): Promise<MCPItemWithRelations | null> {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        subCategories: {
          include: {
            subCategory: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        technicalSpecs: true,
        installationGuides: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
        features: true,
        useCases: true,
        pricingPlans: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        editorialReviews: true,
        discussions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        faqs: true,
      },
    });

    // Transform categories to match the expected type
    if (item) {
      return this.transformMCPItem(item);
    }

    return null;
  }

  async getMCPItemAlternatives(slug: string): Promise<MCPItemWithRelations[]> {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    // Get items from same categories and tags
    const categoryIds = item.categories?.map((c) => c.category.id) || [];
    const tagIds = item.tags?.map((t) => t.tag.id) || [];

    const alternatives = await this.prisma.mCPItem.findMany({
      where: {
        id: {
          not: item.id,
        },
        OR: [
          {
            categories: {
              some: {
                categoryId: {
                  in: categoryIds,
                },
              },
            },
          },
          {
            tags: {
              some: {
                tagId: {
                  in: tagIds,
                },
              },
            },
          },
        ],
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        subCategories: {
          include: {
            subCategory: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        features: true,
      },
      orderBy: [
        { upvoteCount: 'desc' },
        { qualityScore: 'desc' },
      ],
      take: 5,
    });

    return alternatives.map(item => ({
      ...item,
      categories: item.categories?.map(c => ({
        ...c.category,
        description: c.category.description || undefined,
        icon: c.category.icon || undefined,
        color: c.category.color || undefined,
      })),
      subCategories: item.subCategories?.map((s) => ({
        ...s.subCategory,
        description: s.subCategory.description || undefined,
      })),
      tags: item.tags?.map(t => t.tag),
      features: item.features?.map((f) => ({
        ...f,
        icon: f.icon || undefined,
        badge: f.badge || undefined,
      })),
      itemType: item.itemType as MCPItemType,
      logoUrl: item.logoUrl || undefined,
      coverImageUrl: item.coverImageUrl || undefined,
      providerUrl: item.providerUrl || undefined,
      license: item.license || undefined,
      websiteUrl: item.websiteUrl || undefined,
      documentationUrl: item.documentationUrl || undefined,
      repositoryUrl: item.repositoryUrl || undefined,
      qualityScore: item.qualityScore || undefined,
      easeOfUseScore: item.easeOfUseScore || undefined,
      globalRank: item.globalRank || undefined,
      leaderboardRank: item.leaderboardRank || undefined,
      editorialVerdict: item.editorialVerdict || undefined,
      pricingType: item.pricingType as MCPPricingType,
      startingPrice: item.startingPrice ? Number(item.startingPrice) : undefined,
      launchDate: item.launchDate || undefined,
    }));
  }

  async getReviews(slug: string, page: number = 1, limit: number = 20): Promise<ReviewResponseDTO> {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    const skip = (page - 1) * limit;
    const [reviews, total, aggregateResult] = await Promise.all([
      this.prisma.mCPDirectoryReview.findMany({
        where: { mcpItemId: item.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.mCPDirectoryReview.count({
        where: { mcpItemId: item.id },
      }),
      this.prisma.mCPDirectoryReview.aggregate({
        where: { mcpItemId: item.id },
        _avg: {
          rating: true,
        },
        _count: {
          rating: true,
        },
      }),
    ]);

    // Calculate review statistics from aggregate (all reviews, not just current page)
    const avgRating = aggregateResult._avg.rating || 0;
    
    // Get all reviews to calculate distribution
    const allReviews = await this.prisma.mCPDirectoryReview.findMany({
      where: { mcpItemId: item.id },
      select: { rating: true },
    });

    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length,
    };

    return {
      reviews: reviews.map(r => ({
        ...r,
        comment: r.comment || undefined,
        user: {
          ...r.user,
          name: r.user.name || undefined,
        },
      })),
      statistics: {
        totalReviews: total,
        averageRating: avgRating,
        ratingDistribution,
      },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDiscussions(slug: string, page: number = 1, limit: number = 20): Promise<DiscussionResponseDTO> {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    const skip = (page - 1) * limit;
    const [discussions, total] = await Promise.all([
      this.prisma.mCPDirectoryDiscussion.findMany({
        where: { mcpItemId: item.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.mCPDirectoryDiscussion.count({
        where: { mcpItemId: item.id },
      }),
    ]);

    return {
      discussions: discussions.map(d => ({
        ...d,
        user: {
          ...d.user,
          name: d.user.name || undefined,
        },
        replies: d.replies?.map(r => ({
          ...r,
          user: {
            ...r.user,
            name: r.user.name || undefined,
          },
        })),
      })),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async incrementViews(slug: string): Promise<void> {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) return;

    await this.prisma.mCPItem.update({
      where: { id: item.id },
      data: {
        viewCount: {
          increment: 1,
        },
        monthlyVisits: {
          increment: 1,
        },
      },
    });
  }

  async toggleUpvote(slug: string, userId: string): Promise<{ success: boolean; count: number }> {
    const result = await this.prisma.$transaction(async (tx) => {
      const item = await tx.mCPItem.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!item) {
        throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
      }

      const existingUpvote = await tx.mCPDirectoryUpvote.findUnique({
        where: {
          mcpItemId_userId: {
            mcpItemId: item.id,
            userId,
          },
        },
      });

      if (existingUpvote) {
        // Remove upvote
        await tx.mCPDirectoryUpvote.delete({
          where: {
            id: existingUpvote.id,
          },
        });

        // Decrement upvote count
        await tx.mCPItem.update({
          where: { id: item.id },
          data: {
            upvoteCount: {
              decrement: 1,
            },
          },
        });

        const updatedItem = await tx.mCPItem.findUnique({ where: { id: item.id } });
        return { success: true, count: updatedItem?.upvoteCount || 0 };
      } else {
        // Add upvote
        await tx.mCPDirectoryUpvote.create({
          data: {
            userId,
            mcpItemId: item.id,
          },
        });

        // Increment upvote count
        await tx.mCPItem.update({
          where: { id: item.id },
          data: {
            upvoteCount: {
              increment: 1,
            },
          },
        });

        const updatedItem = await tx.mCPItem.findUnique({ where: { id: item.id } });
        return { success: true, count: updatedItem?.upvoteCount || 0 };
      }
    });

    return result;
  }

  async toggleSave(slug: string, userId: string): Promise<{ success: boolean; saved: boolean }> {
    const result = await this.prisma.$transaction(async (tx) => {
      const item = await tx.mCPItem.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!item) {
        throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
      }

      const existingSave = await tx.mCPDirectorySavedMCP.findUnique({
        where: {
          mcpItemId_userId: {
            mcpItemId: item.id,
            userId,
          },
        },
      });

      if (existingSave) {
        // Remove save
        await tx.mCPDirectorySavedMCP.delete({
          where: {
            id: existingSave.id,
          },
        });

        // Decrement save count
        await tx.mCPItem.update({
          where: { id: item.id },
          data: {
            saveCount: {
              decrement: 1,
            },
          },
        });

        return { success: true, saved: false };
      } else {
        // Add save
        await tx.mCPDirectorySavedMCP.create({
          data: {
            userId,
            mcpItemId: item.id,
          },
        });

        // Increment save count
        await tx.mCPItem.update({
          where: { id: item.id },
          data: {
            saveCount: {
              increment: 1,
            },
          },
        });

        return { success: true, saved: true };
      }
    });

    return result;
  }

  async submitReview(slug: string, userId: string, rating: number, comment?: string) {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    return this.prisma.mCPDirectoryReview.upsert({
      where: {
        mcpItemId_userId: {
          mcpItemId: item.id,
          userId,
        },
      },
      update: {
        rating,
        comment,
        updatedAt: new Date(),
      },
      create: {
        rating,
        comment,
        userId,
        mcpItemId: item.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async submitDiscussion(slug: string, userId: string, title: string, content: string) {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    return this.prisma.mCPDirectoryDiscussion.create({
      data: {
        title,
        content,
        userId,
        mcpItemId: item.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async submitDiscussionReply(discussionId: string, userId: string, content: string) {
    return this.prisma.mCPDirectoryDiscussionReply.create({
      data: {
        content,
        userId,
        discussionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async submitClaim(slug: string, data: {
    name: string;
    email: string;
    relationship: string;
    message: string;
  }) {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    return this.prisma.mCPDirectoryClaim.create({
      data: {
        ...data,
        mcpItemId: item.id,
        // userId is optional now, so we don't need to provide it
      },
    });
  }

  async submitReport(slug: string, userId: string, reason: string, description?: string) {
    const item = await this.prisma.mCPItem.findUnique({
      where: { slug },
      select: { id: true }
    });

    if (!item) {
      throw new MCPError('MCP item not found', 'NOT_FOUND', 404);
    }

    return this.prisma.mCPDirectoryReport.create({
      data: {
        reporterId: userId,
        reportedMCPItemId: item.id,
        reason,
        description,
      },
    });
  }

  async listMCPSubCategories() {
    return this.prisma.mCPSubCategory.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    });
  }
}