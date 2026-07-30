import { RobotCategory, RobotAvailability, AutonomyLevel, Prisma } from '@prisma/client';

type RobotWithTasks = Prisma.RobotGetPayload<{
  include: {
    tasks: {
      include: {
        task: true
      }
    }
  }
}>;

export class RobotTransformer {
  static formatCategory(category: RobotCategory): string {
    const map: Record<RobotCategory, string> = {
      HUMANOID: 'Humanoid',
      MOBILE: 'Mobile',
      MANIPULATOR: 'Manipulator',
      DRONE: 'Drone',
      INDUSTRIAL: 'Industrial',
      WAREHOUSE: 'Warehouse',
      HEALTHCARE: 'Healthcare',
      HOME: 'Home',
      AGRICULTURAL: 'Agricultural',
      DEFENSE: 'Defense',
      SERVICE: 'Service',
      COMPANION: 'Companion',
      OTHER: 'Other',
    };
    return map[category];
  }

  static formatAvailability(availability: RobotAvailability): string {
    const map: Record<RobotAvailability, string> = {
      ANNOUNCED: 'Announced',
      COMMERCIALLY_AVAILABLE: 'Commercially available',
      DISCONTINUED: 'Discontinued',
      IN_DEVELOPMENT: 'In development',
      IN_PRODUCTION: 'In production',
      PAUSED: 'Paused',
      PILOT: 'Pilot',
      PRE_ORDER: 'Pre-order',
      PROTOTYPE: 'Prototype',
    };
    return map[availability];
  }

  static formatAutonomy(level: AutonomyLevel | null): string | null {
    if (!level) return null;
    const map: Record<AutonomyLevel, string> = {
      TELEOPERATED: 'Teleoperated',
      ASSISTED: 'Assisted',
      SEMI_AUTONOMOUS: 'Semi-autonomous',
      HIGHLY_AUTONOMOUS: 'Highly autonomous',
      FULLY_AUTONOMOUS: 'Fully autonomous',
    };
    return map[level];
  }

  static toResponse(robot: RobotWithTasks) {
    return {
      id: robot.id,
      slug: robot.slug,
      name: robot.name,
      company: robot.company,
      country: robot.country,
      category: this.formatCategory(robot.category),
      availability: this.formatAvailability(robot.availability),
      price: robot.price ? robot.price : 'N/A', 
      releaseDate: robot.releaseDate ? robot.releaseDate : '-',
      mainTask: robot.mainTask,
      logoUrl: robot.logoUrl,
      thumbnailUrl: robot.thumbnailUrl,
      autonomyLevel: this.formatAutonomy(robot.autonomyLevel),
      primaryUseCases: robot.primaryUseCases,
      websiteUrl: robot.websiteUrl,
      about: robot.about,
      specs: robot.specs,
      mediaUrls: robot.mediaUrls,
      tasks: robot.tasks.map(tr => {
        return {
          id: tr.task.id,
          title: tr.task.title,
          slug: tr.task.slug
        }
      }),
      createdAt: robot.createdAt,
      updatedAt: robot.updatedAt,
    };
  }

  static toListResponse(robots: RobotWithTasks[]) {
    return robots.map(robot => this.toResponse(robot));
  }
}