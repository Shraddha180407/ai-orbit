import { PrismaClient } from '@prisma/client';
import {
  transformDeviceForListing,
  transformDeviceForDetail,
} from '../../lib/device-transformations.js';

export class DevicesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listDevices() {
    const devices = await this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return devices.map(transformDeviceForListing);
  }

  async getDeviceById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      return null;
    }

    return transformDeviceForDetail(device);
  }

  async getDeviceBySlug(slug: string) {
    const device = await this.prisma.device.findUnique({
      where: { slug },
    });

    if (!device) {
      return null;
    }

    return transformDeviceForDetail(device);
  }
}
