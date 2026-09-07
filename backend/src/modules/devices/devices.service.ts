import { PrismaClient } from '@prisma/client';
import {
  transformDeviceForListing,
  transformDeviceForDetail,
} from '../../lib/device-transformations.js';
import { logger } from '../../lib/logger.js';

export class DevicesService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listDevices() {
    try {
      const devices = await this.prisma.device.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (!devices || devices.length === 0) {
        return [];
      }

      // flatMap allows us to return an array of 1 item (success) or 0 items (error).
      // This safely removes broken database records from the API response.
      return devices.flatMap((device) => {
        try {
          return [transformDeviceForListing(device)];
        } catch (error: unknown) {
          logger.error(
            `Error transforming device ${device.id}:`,
            error instanceof Error ? error.message : 'Unknown error'
          );
          return [];
        }
      });
    } catch (error) {
      logger.error('Error fetching devices list:', error);
      return [];
    }
  }

  async getDeviceById(id: string) {
    if (!id) return null;

    try {
      const device = await this.prisma.device.findUnique({
        where: { id },
        // Fetch related tasks through the TaskDevice join table
        include: {
          tasks: {
            include: {
              task: true,
            },
          },
        },
      });

      if (!device) {
        return null;
      }

      return transformDeviceForDetail(device);
    } catch (error) {
      logger.error(`Error in getDeviceById for ID ${id}:`, error);
      return null;
    }
  }

  async getDeviceBySlug(slug: string) {
    if (!slug) return null;

    try {
      // Fetch from Prisma using findFirst
      const device = await this.prisma.device.findFirst({
        where: {
          OR: [{ slug: slug }, { id: slug }],
        },
      });

      if (!device) {
        return null;
      }

      return transformDeviceForDetail(device);
    } catch (error) {
      logger.error(`Error in getDeviceBySlug for slug ${slug}:`, error);
      return null;
    }
  }

  async listDeviceSubCategories() {
    try {
      return await this.prisma.deviceSubCategory.findMany({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, slug: true, description: true },
      });
    } catch (error) {
      logger.error('Error listing subcategories:', error);
      return [];
    }
  }
}