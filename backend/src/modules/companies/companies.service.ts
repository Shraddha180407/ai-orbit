import { PrismaClient, Prisma } from '@prisma/client';

export class CompaniesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listCompanies(typeFilter?: string) {
    const where: Prisma.CompanyWhereInput = {};

    if (typeFilter) {
      where.type = { has: typeFilter };
    }

    const companies = await this.prisma.company.findMany({
      where,
      orderBy: { name: 'asc' },
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
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
          }
        },
        aiModels: {
          select: {
            id: true,
            slug: true,
            name: true,
          }
        },
        _count: {
          select: {
            tools: true,
            aiModels: true,
          }
        }
      }
    });

    // Convert BigInt to string for JSON serialization
    return companies.map((c) => ({
      ...c,
      valuation: c.valuation !== null ? c.valuation.toString() : null,
      fundingRaised: c.fundingRaised !== null ? c.fundingRaised.toString() : null,
    }));
  }

  async getCompanyDetails(slug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug },
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
            _count: { select: { reviews: true } }
          }
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
          }
        },
        _count: {
          select: { tools: true, aiModels: true, collectionCompanies: true }
        }
      }
    });

    if (!company) return null;

    return {
      ...company,
      valuation: company.valuation !== null ? company.valuation.toString() : null,
      fundingRaised: company.fundingRaised !== null ? company.fundingRaised.toString() : null,
    };
  }
}
