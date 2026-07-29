import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompaniesService } from '../companies.service.js';

function createMockPrisma() {
  return {
    company: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };
}

const MOCK_COMPANY = {
  id: 'co-1',
  slug: 'test-company',
  name: 'Test Company',
  logoUrl: 'https://logo.png',
  description: 'A test company',
  createdAt: new Date('2025-01-01'),
};

describe('CompaniesService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: CompaniesService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new CompaniesService(prisma as never);
    vi.clearAllMocks();
  });

  describe('listCompanies', () => {
    it('returns companies ordered by name asc', async () => {
      const companies = [
        { ...MOCK_COMPANY, name: 'Alpha' },
        { ...MOCK_COMPANY, name: 'Beta' },
      ];
      prisma.company.findMany.mockResolvedValue(companies);

      const result = await service.listCompanies();

      expect(prisma.company.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              tools: true,
              aiModels: true,
            }
          }
        }
      });
      expect(result).toEqual(companies);
    });

    it('returns empty array when no companies exist', async () => {
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.listCompanies();

      expect(result).toEqual([]);
    });
  });

  describe('getCompanyDetails', () => {
    it('returns company with tools when found', async () => {
      const companyWithTools = {
        ...MOCK_COMPANY,
        tools: [
          { id: 't-1', slug: 'tool-1', name: 'Tool 1', logoUrl: null, description: 'desc', pricingModel: 'FREE', avgRating: 4.5, _count: { reviews: 3 } },
        ],
      };
      prisma.company.findUnique.mockResolvedValue(companyWithTools);

      const result = await service.getCompanyDetails('test-company');

      expect(prisma.company.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-company' },
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
              _count: { select: { reviews: true } },
            },
          },
          aiModels: {
            select: {
              id: true,
              name: true,
              description: true,
              contextWindow: true,
              parameterSize: true,
              modality: true,
              releaseDate: true,
            },
          },
          _count: {
            select: { tools: true, aiModels: true, collectionCompanies: true },
          },
        },
      });
      expect(result).toEqual(companyWithTools);
      expect(result!.tools).toHaveLength(1);
    });

    it('returns null when not found', async () => {
      prisma.company.findUnique.mockResolvedValue(null);

      const result = await service.getCompanyDetails('nonexistent');

      expect(result).toBeNull();
    });
  });
});
