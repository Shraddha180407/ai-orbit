import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { DevicesService } from './devices.service.js';

export class DevicesController {
  private createService(c: Context) {
    const prisma = getPrisma(c.env);
    return { prisma, service: new DevicesService(prisma) };
  }

  async listDevices(c: Context) {
    const { prisma, service } = this.createService(c);

    try {
      const devices = await service.listDevices();
      return c.json(devices);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getDeviceById(c: Context) {
    const { prisma, service } = this.createService(c);
    const id = c.req.param('id');

    if (!id) {
      return c.json({ error: 'Device ID is required' }, 400);
    }

    try {
      const device = await service.getDeviceById(id);

      if (!device) {
        return c.json({ error: 'Device not found' }, 404);
      }

      return c.json(device);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getDeviceBySlug(c: Context) {
    const { prisma, service } = this.createService(c);
    const slug = c.req.param('slug');

    if (!slug) {
      return c.json({ error: 'Device slug is required' }, 400);
    }

    try {
      const device = await service.getDeviceBySlug(slug);

      if (!device) {
        return c.json({ error: 'Device not found' }, 404);
      }

      return c.json(device);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async listDeviceSubCategories(c: Context) {
    const { prisma, service } = this.createService(c);

    try {
      const subCategories = await service.listDeviceSubCategories();
      return c.json(subCategories);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
