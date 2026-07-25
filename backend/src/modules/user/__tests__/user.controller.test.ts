import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserController } from '../user.controller.js';

const mockService = {
  getSavedTools: vi.fn(),
  removeSavedTool: vi.fn(),
  getHistory: vi.fn(),
  recordHistory: vi.fn(),
};

vi.mock('../../lib/error.js', () => ({
  AppError: {
    BadRequest: (msg: string) => new Error(msg),
    NotFound: (msg: string) => new Error(msg),
  },
}));

function createContext(user?: { id: string }, params: Record<string, string> = {}, body?: unknown) {
  const json = vi.fn().mockReturnThis();
  return {
    req: {
      param: (key: string) => params[key],
      json: vi.fn().mockResolvedValue(body ?? {}),
    },
    json,
    _json: json,
    get: vi.fn().mockReturnValue(user),
  };
}

describe('UserController', () => {
  let controller: UserController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new UserController(mockService as never);
  });

  describe('getSavedTools', () => {
    it('returns saved tools on success', async () => {
      mockService.getSavedTools.mockResolvedValue([
        { id: 'bm1', toolId: 't1', name: 'React', category: 'Framework', createdAt: '2024-01-01' },
      ]);

      const c = createContext({ id: 'u1' });
      await controller.getSavedTools(c as never);

      expect(mockService.getSavedTools).toHaveBeenCalledWith('u1');
      expect(c.json).toHaveBeenCalledWith({
        savedTools: [{ id: 'bm1', toolId: 't1', name: 'React', category: 'Framework', createdAt: '2024-01-01' }],
      });
    });

    it('propagates service errors', async () => {
      mockService.getSavedTools.mockRejectedValue(new Error('DB error'));

      const c = createContext({ id: 'u1' });
      await expect(controller.getSavedTools(c as never)).rejects.toThrow('DB error');
    });
  });

  describe('removeSavedTool', () => {
    it('removes saved tool on success', async () => {
      mockService.removeSavedTool.mockResolvedValue({ success: true });

      const c = createContext({ id: 'u1' }, { id: 'bm1' });
      await controller.removeSavedTool(c as never);

      expect(mockService.removeSavedTool).toHaveBeenCalledWith('bm1', 'u1');
      expect(c.json).toHaveBeenCalledWith({ success: true });
    });

    it('throws when id is missing', async () => {
      const c = createContext({ id: 'u1' }, {});
      await expect(controller.removeSavedTool(c as never)).rejects.toThrow('id is required');
    });
  });

  describe('getHistory', () => {
    it('returns history on success', async () => {
      mockService.getHistory.mockResolvedValue([
        { id: 'h1', toolId: 't1', viewedAt: '2024-01-01T00:00:00.000Z', tool: { name: 'React' } },
      ]);

      const c = createContext({ id: 'u1' });
      await controller.getHistory(c as never);

      expect(mockService.getHistory).toHaveBeenCalledWith('u1');
      expect(c.json).toHaveBeenCalledWith([
        { id: 'h1', toolId: 't1', viewedAt: '2024-01-01T00:00:00.000Z', tool: { name: 'React' } },
      ]);
    });
  });

  describe('recordHistory', () => {
    it('records history on success', async () => {
      mockService.recordHistory.mockResolvedValue({ success: true });

      const c = createContext({ id: 'u1' }, {}, { toolId: 't1' });
      await controller.recordHistory(c as never);

      expect(mockService.recordHistory).toHaveBeenCalledWith('t1', 'u1');
      expect(c.json).toHaveBeenCalledWith({ success: true });
    });

    it('throws when toolId is missing', async () => {
      const c = createContext({ id: 'u1' }, {}, {});
      await expect(controller.recordHistory(c as never)).rejects.toThrow('toolId is required');
    });
  });
});
