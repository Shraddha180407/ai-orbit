import type { PrismaClient } from "@prisma/client";
import type { RobotsIngestPayload } from "./robots.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class RobotsIngestService {
  static async ingestRobots(prisma: PrismaClient, payload: RobotsIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[]
    };

    for (const robotData of payload.robots) {
      summary.processed++;
      
      try {
        await prisma.$transaction(async (tx) => {
          
          // 1. Process Tasks and Categories
          const taskIds: string[] = [];
          
          for (const taskData of robotData.tasks) {
            // Upsert Category
            const category = await tx.category.upsert({
              where: { slug: taskData.category.slug },
              create: { slug: taskData.category.slug, name: taskData.category.name },
              update: { name: taskData.category.name }
            });

            // Upsert Task
            const task = await tx.task.upsert({
              where: { slug: taskData.slug },
              create: {
                slug: taskData.slug,
                title: taskData.title,
                description: taskData.description,
                categoryId: category.id
              },
              update: {
                title: taskData.title,
                description: taskData.description,
                categoryId: category.id
              }
            });
            
            taskIds.push(task.id);
          }

          // 2. Check if Robot already exists
          const existingRobot = await tx.robot.findUnique({
            where: { slug: robotData.slug }
          });
          
          if (existingRobot) {
            summary.updated++;
            // Delete existing relations to cleanly replace them
            await tx.taskRobot.deleteMany({ where: { robotId: existingRobot.id } });
          } else {
            summary.created++;
          }
          
          // 3. Upsert Robot and reconnect relations
          await tx.robot.upsert({
            where: { slug: robotData.slug },
            create: {
              slug: robotData.slug,
              name: robotData.name,
              logoUrl: robotData.logoUrl,
              thumbnailUrl: robotData.thumbnailUrl,
              company: robotData.company,
              country: robotData.country,
              category: robotData.category,
              availability: robotData.availability,
              price: robotData.price,
              releaseDate: robotData.releaseDate,
              mainTask: robotData.mainTask,
              autonomyLevel: robotData.autonomyLevel,
              primaryUseCases: robotData.primaryUseCases,
              websiteUrl: robotData.websiteUrl,
              about: robotData.about,
              specs: robotData.specs,
              mediaUrls: robotData.mediaUrls,
              tasks: {
                create: taskIds.map(tId => ({ taskId: tId }))
              }
            },
            update: {
              name: robotData.name,
              logoUrl: robotData.logoUrl,
              thumbnailUrl: robotData.thumbnailUrl,
              company: robotData.company,
              country: robotData.country,
              category: robotData.category,
              availability: robotData.availability,
              price: robotData.price,
              releaseDate: robotData.releaseDate,
              mainTask: robotData.mainTask,
              autonomyLevel: robotData.autonomyLevel,
              primaryUseCases: robotData.primaryUseCases,
              websiteUrl: robotData.websiteUrl,
              about: robotData.about,
              specs: robotData.specs,
              mediaUrls: robotData.mediaUrls,
              tasks: {
                create: taskIds.map(tId => ({ taskId: tId }))
              }
            }
          });
        }, {
          timeout: 10000 
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting robot ${robotData.slug}:`, err);
        summary.errors.push({
          slug: robotData.slug,
          message
        });
        
        // Adjust counts since it failed
        if (summary.created > 0 && message.includes('create')) summary.created--;
        if (summary.updated > 0 && !message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
