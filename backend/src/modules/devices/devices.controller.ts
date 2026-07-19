import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { DevicesService } from './devices.service.js';

export class DevicesController {
  async listDevices(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new DevicesService(prisma);

    try {
      const devices = await service.listDevices();
      return c.json(devices);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getDeviceById(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new DevicesService(prisma);
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
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getDeviceBySlug(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new DevicesService(prisma);
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
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
