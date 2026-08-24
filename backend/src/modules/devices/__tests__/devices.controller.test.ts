import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockService = {
  listDevices: vi.fn(),
  getDeviceById: vi.fn(),
  getDeviceBySlug: vi.fn(),
};

vi.mock('../devices.service.js', () => ({
  DevicesService: class DevicesService {
    constructor() {
      return mockService as never;
    }
  },
}));

vi.mock('../../../lib/prisma.js', () => ({
  getPrisma: vi.fn().mockReturnValue({ $disconnect: vi.fn() }),
}));

import { DevicesController } from '../devices.controller.js';
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
    },
    env: {},
    get status() { return status; },
    get jsonBody() { return jsonBody; },
  };
}

describe('DevicesController', () => {
  const controller = new DevicesController();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.values(mockService).forEach(fn => fn.mockReset());
  });

  describe('listDevices', () => {
    it('returns 200 with devices', async () => {
      const devices = [{ id: 'dev-1', name: 'Test Device' }];
      mockService.listDevices.mockResolvedValue(devices);

      const c = mockContext();
      await controller.listDevices(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(devices);
    });

    it('returns 500 on error', async () => {
      mockService.listDevices.mockRejectedValue(new Error('DB failure'));

      const c = mockContext();
      await controller.listDevices(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB failure');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.listDevices.mockRejectedValue(new Error('fail'));

      const c = mockContext();
      await controller.listDevices(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('getDeviceById', () => {
    it('returns 200 with device', async () => {
      const device = { id: 'dev-1', name: 'Test Device' };
      mockService.getDeviceById.mockResolvedValue(device);

      const c = mockContext({ id: 'dev-1' });
      await controller.getDeviceById(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(device);
    });

    it('returns 400 for missing id', async () => {
      const c = mockContext({});
      await controller.getDeviceById(c as never);

      expect(c.status).toBe(400);
      expect(c.jsonBody).toHaveProperty('error', 'Device ID is required');
    });

    it('returns 404 when not found', async () => {
      mockService.getDeviceById.mockResolvedValue(null);

      const c = mockContext({ id: 'nonexistent' });
      await controller.getDeviceById(c as never);

      expect(c.status).toBe(404);
      expect(c.jsonBody).toHaveProperty('error', 'Device not found');
    });

    it('returns 500 on error', async () => {
      mockService.getDeviceById.mockRejectedValue(new Error('DB error'));

      const c = mockContext({ id: 'dev-1' });
      await controller.getDeviceById(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB error');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.getDeviceById.mockRejectedValue(new Error('fail'));

      const c = mockContext({ id: 'dev-1' });
      await controller.getDeviceById(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });

  describe('getDeviceBySlug', () => {
    it('returns 200 with device', async () => {
      const device = { id: 'dev-1', slug: 'test-device', name: 'Test Device' };
      mockService.getDeviceBySlug.mockResolvedValue(device);

      const c = mockContext({ slug: 'test-device' });
      await controller.getDeviceBySlug(c as never);

      expect(c.status).toBe(200);
      expect(c.jsonBody).toEqual(device);
    });

    it('returns 400 for missing slug', async () => {
      const c = mockContext({});
      await controller.getDeviceBySlug(c as never);

      expect(c.status).toBe(400);
      expect(c.jsonBody).toHaveProperty('error', 'Device slug is required');
    });

    it('returns 404 when not found', async () => {
      mockService.getDeviceBySlug.mockResolvedValue(null);

      const c = mockContext({ slug: 'nonexistent' });
      await controller.getDeviceBySlug(c as never);

      expect(c.status).toBe(404);
      expect(c.jsonBody).toHaveProperty('error', 'Device not found');
    });

    it('returns 500 on error', async () => {
      mockService.getDeviceBySlug.mockRejectedValue(new Error('DB error'));

      const c = mockContext({ slug: 'test-device' });
      await controller.getDeviceBySlug(c as never);

      expect(c.status).toBe(500);
      expect(c.jsonBody).toHaveProperty('error', 'DB error');
    });

    it('does not disconnect the shared prisma singleton, even on error', async () => {
      const mockDisconnect = vi.fn();
      vi.mocked(getPrisma).mockReturnValue({ $disconnect: mockDisconnect } as never);
      mockService.getDeviceBySlug.mockRejectedValue(new Error('fail'));

      const c = mockContext({ slug: 'test-device' });
      await controller.getDeviceBySlug(c as never);

      expect(mockDisconnect).not.toHaveBeenCalled();
    });
  });
});