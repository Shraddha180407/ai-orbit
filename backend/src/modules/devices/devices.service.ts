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

    // flatMap allows us to return an array of 1 item (success) or 0 items (error).
    // This safely removes broken database records from the API response.
    return devices.flatMap(device => {
      try {
        return [transformDeviceForListing(device)];
      } catch (error: any) {
        console.error(`Error transforming device ${device.id}:`, error.message);
        return []; 
      }
    });
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