import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { RobotsService } from './robots.service.js';
import { RobotTransformer } from '../../lib/robot.transformer.js';

export class RobotsController {
  
  async listRobots(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);

    try {
      const robots = await service.listRobots();
      const transformedData = RobotTransformer.toListResponse(robots);
      return c.json(transformedData);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRobot(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);
    const identifier = c.req.param('identifier');

    if (!identifier) return c.json({ error: 'ID or Slug is required' }, 400);

    try {
      const robot = await service.getRobotByIdOrSlug(identifier);
      if (!robot) return c.json({ error: 'Robot not found' }, 404);
      
      const transformedData = RobotTransformer.toResponse(robot);
      return c.json(transformedData);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async createRobot(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);

    try {
      const body = await c.req.json();
      const newRobot = await service.createRobot(body);
      return c.json(newRobot, 201);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async updateRobot(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);
    const id = c.req.param('id');

    if (!id) return c.json({ error: 'ID is required' }, 400);

    try {
      const body = await c.req.json();
      const updatedRobot = await service.updateRobot(id, body);
      return c.json(updatedRobot);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async deleteRobot(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);
    const id = c.req.param('id');

    if (!id) return c.json({ error: 'ID is required' }, 400);

    try {
      await service.deleteRobot(id);
      return c.json({ message: 'Robot deleted successfully' });
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}