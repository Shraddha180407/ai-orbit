import { PrismaClient, Prisma, CompanyType } from '@prisma/client';

export class CompaniesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listCompanies(filters: {
    page?: number;
    pageSize?: number;
    q?: string;
    type?: CompanyType;
    country?: string;
    sort?: string;
  } = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(200, Math.max(1, filters.pageSize || 100));
    const skip = (page - 1) * limit;

    const where: Prisma.CompanyWhereInput = {};

    if (filters.type) {
      where.type = { has: filters.type };
    }

    if (filters.q && filters.q.trim().length > 0) {
      const query = filters.q.trim();

      where.OR = [
        {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          sector: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (filters.country && filters.country !== 'all') {
      where.country = {
        equals: filters.country,
        mode: 'insensitive',
      };
    }

    let orderBy: Prisma.CompanyOrderByWithRelationInput = {
      name: 'asc',
    };

    switch (filters.sort) {
      case 'valuation':
      case 'valuation-desc':
        orderBy = { valuation: 'desc' };
        break;

      case 'valuation-asc':
        orderBy = { valuation: 'asc' };
        break;

      case 'funding':
      case 'funding-desc':
        orderBy = { fundingRaised: 'desc' };
        break;

      case 'name-asc':
        orderBy = { name: 'asc' };
        break;

      case 'name-desc':
        orderBy = { name: 'desc' };
        break;

      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;

      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;

      case 'views':
        orderBy = { views: 'desc' };
        break;

      case 'upvotes':
        orderBy = { upvotes: 'desc' };
        break;

      default:
        orderBy = { name: 'asc' };
        break;
    }

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy,
        skip,
        take: limit,

        select: {
          id: true,
          slug: true,
          name: true,
          logoUrl: true,
          description: true,
          website: true,
          country: true,
          city: true,
          foundedYear: true,
          type: true,
          sector: true,
          verified: true,
          featured: true,
          valuation: true,
          fundingRaised: true,
          latestFundingRound: true,
          employeeCount: true,
          linkedinUrl: true,
          twitterUrl: true,
          views: true,
          upvotes: true,
          impressions: true,
          createdAt: true,
          updatedAt: true,

          tools: {
            take: 3,
            select: {
              id: true,
              slug: true,
              name: true,
              logoUrl: true,
            },
          },

          aiModels: {
            take: 3,
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },

          _count: {
            select: {
              tools: true,
              aiModels: true,
            },
          },
        },
      }),

      this.prisma.company.count({
        where,
      }),
    ]);

    // Convert BigInt to string for JSON serialization
    const formattedCompanies = companies.map((c) => ({
      ...c,
      valuation:
        c.valuation !== null
          ? c.valuation.toString()
          : null,

      fundingRaised:
        c.fundingRaised !== null
          ? c.fundingRaised.toString()
          : null,
    }));

    return {
      companies: formattedCompanies,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(
        1,
        Math.ceil(total / limit)
      ),
    };
  }

  async getCompanyDetails(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: {
        slug,
      },

      include: {
        tools: {
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
            description: true,
            pricingModel: true,
            avgRating: true,
            websiteUrl: true,

            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },

        aiModels: {
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            contextWindow: true,
            parameterSize: true,
            modality: true,
            releaseDate: true,
            websiteUrl: true,
            capabilities: true,
          },
        },

         news: true,

        videos: true,

       _count: {
  select: {
    tools: true,
    aiModels: true,
    collectionCompanies: true,
    news: true,
    videos: true,
  },
},
      },
    });

    if (!company) {
      return null;
    }

    /*
     * These entities don't have direct Prisma relations
     * with Company, so we match them using the existing
     * string fields in the database.
     */

    const [robots, devices, repositories] = await Promise.all([
      // Robots → Robot.company matches Company.name
      this.prisma.robot.findMany({
        where: {
          company: {
            equals: company.name,
            mode: 'insensitive',
          },
        },
      }),

      // Devices → Device.manufacturer matches Company.name
      this.prisma.device.findMany({
        where: {
          manufacturer: {
            equals: company.name,
          mode: 'insensitive',
          },
        },
      }),

      // Repositories → Repository.owner matches Company.slug
      // GitHub owners are generally stored as slugs/usernames.
      this.prisma.repository.findMany({
        where: {
          owner: {
            equals: company.slug,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      ...company,

      robots,
      devices,
      repositories,

      valuation:
        company.valuation !== null
          ? company.valuation.toString()
          : null,

      fundingRaised:
        company.fundingRaised !== null
          ? company.fundingRaised.toString()
          : null,
    };
  }
}