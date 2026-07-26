import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DevicesService } from '../devices.service.js';

vi.mock('../../../lib/device-transformations.js', () => ({
  transformDeviceForListing: vi.fn((device: unknown) => device),
  transformDeviceForDetail: vi.fn((device: unknown) => device),
}));

vi.mock('../../../lib/logger.js', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import { transformDeviceForListing, transformDeviceForDetail } from '../../../lib/device-transformations.js';

function createMockPrisma() {
  return {
    device: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  };
}

const MOCK_DEVICE = {
  id: 'dev-1',
  slug: 'test-device',
  name: 'Test Device',
  manufacturer: 'TestCorp',
  category: 'Smartphone',
  availability: 'Available',
  price: 999,
  year: 2025,
  month: 'Jan',
  description: 'A test device',
  imageUrl: 'https://example.com/device.png',
  mainTask: 'Productivity',
  formFactor: 'Bar',
  country: 'US',
  aiFeatures: ['Voice Assistant'],
  primaryUseCases: ['Work'],
  buyUrl: 'https://buy.example.com',
  manufacturerLogoUrl: null,
  ram: '8GB',
  additionalInfo: 'Extra info',
  createdAt: new Date('2025-01-01'),
  tasks: [],
};

describe('DevicesService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: DevicesService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new DevicesService(prisma as never);
    vi.clearAllMocks();
    vi.mocked(transformDeviceForListing).mockImplementation((d: unknown) => d as never);
    vi.mocked(transformDeviceForDetail).mockImplementation((d: unknown) => d as never);
  });

  describe('listDevices', () => {
    it('returns transformed devices', async () => {
      prisma.device.findMany.mockResolvedValue([MOCK_DEVICE]);

      const result = await service.listDevices();

      expect(prisma.device.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(transformDeviceForListing).toHaveBeenCalledWith(MOCK_DEVICE);
      expect(result).toHaveLength(1);
    });

    it('skips broken ones with flatMap', async () => {
      const brokenDevice = { ...MOCK_DEVICE, id: 'broken-1', imageUrl: null };
      const goodDevice = { ...MOCK_DEVICE, id: 'good-1' };
      prisma.device.findMany.mockResolvedValue([brokenDevice, goodDevice]);

      vi.mocked(transformDeviceForListing)
        .mockImplementationOnce(() => { throw new Error('Transform failed'); })
        .mockImplementationOnce((d: unknown) => d as never);

      const result = await service.listDevices();

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(goodDevice);
    });

    it('returns empty array when no devices exist', async () => {
      prisma.device.findMany.mockResolvedValue([]);

      const result = await service.listDevices();

      expect(result).toEqual([]);
    });
  });

  describe('getDeviceById', () => {
    it('returns transformed device with tasks', async () => {
      const deviceWithTasks = { ...MOCK_DEVICE, tasks: [{ id: 'td-1', task: { id: 't-1', name: 'Task 1' } }] };
      prisma.device.findUnique.mockResolvedValue(deviceWithTasks);

      const result = await service.getDeviceById('dev-1');

      expect(prisma.device.findUnique).toHaveBeenCalledWith({
        where: { id: 'dev-1' },
        include: { tasks: { include: { task: true } } },
      });
      expect(transformDeviceForDetail).toHaveBeenCalledWith(deviceWithTasks);
      expect(result).toEqual(deviceWithTasks);
    });

    it('returns null when not found', async () => {
      prisma.device.findUnique.mockResolvedValue(null);

      const result = await service.getDeviceById('nonexistent');

      expect(result).toBeNull();
      expect(transformDeviceForDetail).not.toHaveBeenCalled();
    });
  });

  describe('getDeviceBySlug', () => {
    it('returns transformed device with tasks', async () => {
      const deviceWithTasks = { ...MOCK_DEVICE, tasks: [] };
      prisma.device.findUnique.mockResolvedValue(deviceWithTasks);

      const result = await service.getDeviceBySlug('test-device');

      expect(prisma.device.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-device' },
        include: { tasks: { include: { task: true } } },
      });
      expect(transformDeviceForDetail).toHaveBeenCalledWith(deviceWithTasks);
      expect(result).toEqual(deviceWithTasks);
    });

    it('returns null when not found', async () => {
      prisma.device.findUnique.mockResolvedValue(null);

      const result = await service.getDeviceBySlug('nonexistent');

      expect(result).toBeNull();
      expect(transformDeviceForDetail).not.toHaveBeenCalled();
    });
  });
});
