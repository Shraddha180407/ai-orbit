import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { RobotsService } from './robots.service.js';

function flattenTasks(robot: any) {
  if (!robot) return robot;
  const { tasks: taskRelations, ...rest } = robot;
  const tasks = (taskRelations || []).map((tr: any) => ({
    id: tr.task.id,
    title: tr.task.title,
    slug: tr.task.slug,
    ...(tr.task.description && { description: tr.task.description }),
    ...(tr.task.category && { category: tr.task.category }),
  }));
  return { ...rest, tasks };
}

export class RobotsController {
  async listRobots(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);

    try {
      const robots = await service.listRobots();
      return c.json(robots.map(flattenTasks));
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getRobot(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new RobotsService(prisma);

    try {
      const { idOrSlug } = c.req.param();
      // Try slug first, then fall back to id
      let robot = await service.getRobotBySlug(idOrSlug);
      if (!robot) {
        robot = await service.getRobotById(idOrSlug);
      }
      if (!robot) {
        return c.json({ error: 'Robot not found' }, 404);
      }
      return c.json(flattenTasks(robot));
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
