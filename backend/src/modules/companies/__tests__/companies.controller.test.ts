import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  listCompanies: vi.fn(),
  getCompanyDetails: vi.fn(),
};

vi.mock('../companies.service.js', () => ({
  CompaniesService: class CompaniesService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

import { CompaniesController } from '../companies.controller.js';
import { getPrisma } from '../../../lib/prisma.js';

function mockContext(params: Record<string, string> = {}) {
  let status: number;
  let jsonBody: unknown;
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      jsonBody = data;
      return { status, body: data };
    },
    req: {
      param: (key: string) => params[key] || '',
      query: (_key: string) => undefined,
    },
    env: {},
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

describe('CompaniesController', () => {
  const controller = new CompaniesController();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockService).forEach(fn => fn.mockReset());
  });

  describe('listCompanies', () => {
    it('returns 200 with companies', async () => {
      const companies = [{ id: 'co-1', name: 'Test' }];
      mockService.listCompanies.mockResolvedValue(companies);

      const c = mockContext();
      await controller.listCompanies(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(companies);
    });

    it('returns 500 on error', async () => {
      mockService.listCompanies.mockRejectedValue(new Error('DB failure'));

      const c = mockContext();
      await controller.listCompanies(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB failure');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.listCompanies.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      await controller.listCompanies(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('getCompanyDetails', () => {
    it('returns 200 with company', async () => {
      const company = { id: 'co-1', slug: 'test', name: 'Test' };
      mockService.getCompanyDetails.mockResolvedValue(company);

      const c = mockContext({ slug: 'test' });
      await controller.getCompanyDetails(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(company);
    });

    it('returns 404 when not found', async () => {
      mockService.getCompanyDetails.mockResolvedValue(null);

      const c = mockContext({ slug: 'nonexistent' });
      await controller.getCompanyDetails(c as never);

      expect(c.status).toBe(404);
      expect(c.jsonBody).toHaveProperty('error', 'Company not found');
    });

    it('returns 500 on error', async () => {
      mockService.getCompanyDetails.mockRejectedValue(new Error('DB error'));

      const c = mockContext({ slug: 'test' });
      await controller.getCompanyDetails(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB error');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.getCompanyDetails.mockRejectedValue(new Error('fail'));

      const c = mockContext({ slug: 'test' });
      await controller.getCompanyDetails(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});