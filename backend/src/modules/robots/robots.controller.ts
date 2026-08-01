import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { RobotsService } from './robots.service.js';
import type { Robot } from '@prisma/client';

type TaskData = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  category?: { slug: string; name: string } | null;
};

type FlattenableRobot = Robot & {
  tasks: Array<{ task: TaskData }>;
};

function flattenTasks(robot: FlattenableRobot | null | undefined) {
  if (!robot) return robot;
  const { tasks: taskRelations, ...rest } = robot;
  const tasks = (taskRelations || []).map((tr) => ({
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
    } catch (error: unknown) {
      return c.json({ error: (error as { message: string }).message }, 500);
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
    } catch (error: unknown) {
      return c.json({ error: (error as { message: string }).message }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
