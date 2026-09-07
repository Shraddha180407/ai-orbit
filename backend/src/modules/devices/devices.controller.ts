import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { DevicesService } from './devices.service.js';

export class DevicesController {
  private createService(c: Context) {
    const prisma = getPrisma(c.env);
    return { prisma, service: new DevicesService(prisma) };
  }

  async listDevices(c: Context) {
  const { service } = this.createService(c);

  try {
    const devices = await service.listDevices();
    return c.json(devices, 200);
  } catch (error: unknown) {
    // Return empty list on failure so frontend can render static mock data cleanly
    return c.json([], 200);
  }
}

  async getDeviceById(c: Context) {
    const { service } = this.createService(c);
    const id = c.req.param('id');

    if (!id) {
      return c.json({ error: 'Device ID is required' }, 400);
    }

    try {
      const device = await service.getDeviceById(id);

      if (!device) {
        return c.json({ error: 'Device not found', device: null }, 404);
      }

      return c.json(device);
    } catch (error: unknown) {
      // Return 404 instead of 500 to prevent backend crashes on non-existent or category IDs
      return c.json({ error: 'Device not found', device: null }, 404);
    }
  }

  async getDeviceBySlug(c: Context) {
  const { service } = this.createService(c);
  const slug = c.req.param('slug') || c.req.param('id');

  if (!slug) {
    return c.json({ error: 'Device identifier is required' }, 400);
  }

  try {
    const device = await service.getDeviceBySlug(slug);

    if (!device) {
      return c.json({ error: 'Device not found', device: null }, 404);
    }

    return c.json(device, 200);
  } catch (error: unknown) {
    // Return clean 404 instead of 500 when category slugs hit the API
    return c.json({ error: 'Device not found', device: null }, 404);
  }
}

  async listDeviceSubCategories(c: Context) {
    const { service } = this.createService(c);

    try {
      const subCategories = await service.listDeviceSubCategories();
      return c.json(subCategories);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    }
  }
}