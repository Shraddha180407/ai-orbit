import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchController } from '../search.controller.js';

const mockService = {
  autocomplete: vi.fn(),
  popular: vi.fn(),
  featured: vi.fn(),
};

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

vi.mock('../search.service.js', () => ({
  SearchService: class SearchService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../search.schema.js', () => ({
  AutocompleteQuerySchema: {
    safeParse: vi.fn((data: Record<string, unknown>) => {
      if (data.q && typeof data.q === 'string' && data.q.trim().length > 0) {
        return { success: true, data: { q: data.q.trim(), limit: data.limit || '8' } };
      }
      return { success: false, error: { issues: [{ message: 'q is required' }] } };
    }),
  },
}));

function createContext(query: Record<string, string> = {}) {
  const json = vi.fn().mockReturnThis();
  return {
    req: { query: () => query },
    json,
    _json: json,
  };
}

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new SearchController();
  });

  describe('autocomplete', () => {
    it('returns suggestions on success', async () => {
      mockService.autocomplete.mockResolvedValue([
        { id: '1', type: 'tool', title: 'React', category: 'Framework', slug: 'react' },
      ]);

      const c = createContext({ q: 'react' });
      await controller.autocomplete(c as never);

      expect(mockService.autocomplete).toHaveBeenCalledWith('react', 8);
      expect(c.json).toHaveBeenCalledWith({
        suggestions: [{ id: '1', type: 'tool', title: 'React', category: 'Framework', slug: 'react' }],
      });
    });

    it('returns empty suggestions for invalid q', async () => {
      const c = createContext({});
      await controller.autocomplete(c as never);

      expect(c.json).toHaveBeenCalledWith({ suggestions: [] });
      expect(mockService.autocomplete).not.toHaveBeenCalled();
    });

    it('returns 500 on service error', async () => {
      mockService.autocomplete.mockRejectedValue(new Error('DB error'));

      const c = createContext({ q: 'test' });
      await controller.autocomplete(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'DB error' }, 500);
    });

    it('does not disconnect the shared prisma singleton', async () => {
      mockService.autocomplete.mockResolvedValue([]);
      const c = createContext({ q: 'test' });
      await controller.autocomplete(c as never);

      const { getPrisma } = await import('../../../lib/prisma.js');
      const prisma = (getPrisma as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(prisma.$disconnect).not.toHaveBeenCalled();
    });
  });

  describe('popular', () => {
    it('returns popular terms on success', async () => {
      mockService.popular.mockResolvedValue(['React', 'Vue']);

      const c = createContext();
      await controller.popular(c as never);

      expect(c.json).toHaveBeenCalledWith({ popular: ['React', 'Vue'] });
    });

    it('returns 500 on service error', async () => {
      mockService.popular.mockRejectedValue(new Error('fail'));

      const c = createContext();
      await controller.popular(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'fail' }, 500);
    });

    it('does not disconnect the shared prisma singleton', async () => {
      mockService.popular.mockResolvedValue([]);
      const c = createContext();
      await controller.popular(c as never);

      const { getPrisma } = await import('../../../lib/prisma.js');
      const prisma = (getPrisma as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(prisma.$disconnect).not.toHaveBeenCalled();
    });
  });

  describe('featured', () => {
    it('returns featured tools on success', async () => {
      mockService.featured.mockResolvedValue([
        { id: '1', type: 'tool', title: 'Tool1', category: 'AI', slug: 'tool1' },
      ]);

      const c = createContext();
      await controller.featured(c as never);

      expect(c.json).toHaveBeenCalledWith({
        featured: [{ id: '1', type: 'tool', title: 'Tool1', category: 'AI', slug: 'tool1' }],
      });
    });

    it('returns 500 on service error', async () => {
      mockService.featured.mockRejectedValue(new Error('oops'));

      const c = createContext();
      await controller.featured(c as never);

      expect(c.json).toHaveBeenCalledWith({ error: 'oops' }, 500);
    });

    it('does not disconnect the shared prisma singleton', async () => {
      mockService.featured.mockResolvedValue([]);
      const c = createContext();
      await controller.featured(c as never);

      const { getPrisma } = await import('../../../lib/prisma.js');
      const prisma = (getPrisma as ReturnType<typeof vi.fn>).mock.results[0].value;
      expect(prisma.$disconnect).not.toHaveBeenCalled();
    });
  });
});