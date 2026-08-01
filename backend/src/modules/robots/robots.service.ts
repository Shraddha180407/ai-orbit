import { PrismaClient } from '@prisma/client';

export class RobotsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async listRobots() {
    return this.prisma.robot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: {
          include: {
            task: {
              select: {
                id: true,
                slug: true,
                title: true,
              },
            },
          },
        },
      },
    });
  }

  async getRobotBySlug(slug: string) {
    return this.prisma.robot.findUnique({
      where: { slug },
      include: {
        tasks: {
          include: {
            task: {
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                category: {
                  select: { slug: true, name: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getRobotById(id: string) {
    return this.prisma.robot.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            task: {
              select: {
                id: true,
                slug: true,
                title: true,
                description: true,
                category: {
                  select: { slug: true, name: true },
                },
              },
            },
          },
        },
      },
    });
  }
}
