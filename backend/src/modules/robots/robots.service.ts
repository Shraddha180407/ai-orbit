import { PrismaClient, Prisma } from '@prisma/client';

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
            task: true
          }
        }
      }
    });
  }

  async getRobotByIdOrSlug(identifier: string) {
    return this.prisma.robot.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ]
      },
      include: {
        tasks: {
          include: {
            task: true
          }
        }
      }
    });
  }

  async createRobot(data: Prisma.RobotCreateInput) {
    return this.prisma.robot.create({
      data,
      include: {
        tasks: {
          include: {
            task: true
          }
        }
      }
    });
  }

  async updateRobot(id: string, data: Prisma.RobotUpdateInput) {
    return this.prisma.robot.update({
      where: { id },
      data,
      include: {
        tasks: {
          include: {
            task: true
          }
        }
      }
    });
  }

  async deleteRobot(id: string) {
    return this.prisma.robot.delete({
      where: { id },
    });
  }
}