import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  getHomepageData: vi.fn(),
};

vi.mock('../homepage.service.js', () => ({
  HomepageService: class HomepageService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

import { HomepageController } from '../homepage.controller.js';
import { getPrisma } from '../../../lib/prisma.js';

function mockContext() {
  let status: number;
  let jsonBody: unknown;
  return {
    json: (data: unknown, s?: number) => {
      status = s ?? 200;
      jsonBody = data;
      return { status, body: data };
    },
    env: {},
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

describe('HomepageController', () => {
  const controller = new HomepageController();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockService).forEach(fn => fn.mockReset());
  });

  describe('getHomepageData', () => {
    it('returns 200 with homepage data', async () => {
      const data = {
        topCompanies: [],
        topModels: [],
        topRepos: [],
        topNews: [],
      };
      mockService.getHomepageData.mockResolvedValue(data);

      const c = mockContext();
      await controller.getHomepageData(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(data);
    });

    it('returns 500 on error', async () => {
      mockService.getHomepageData.mockRejectedValue(new Error('DB failure'));

      const c = mockContext();
      await controller.getHomepageData(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB failure');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.getHomepageData.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      await controller.getHomepageData(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});