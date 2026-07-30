import type { PrismaClient, Availability } from "@prisma/client";
import type { DevicesIngestPayload } from "./devices.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class DevicesIngestService {
  static async ingestDevices(prisma: PrismaClient, payload: DevicesIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[]
    };

    for (const deviceData of payload.devices) {
      summary.processed++;
      
      try {
        await prisma.$transaction(async (tx) => {
          
          // 1. Process Tasks and Categories
          const taskIds: string[] = [];
          
          for (const taskData of deviceData.tasks) {
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

          // 2. Check if Device already exists
          const existingDevice = await tx.device.findUnique({
            where: { slug: deviceData.slug }
          });
          
          if (existingDevice) {
            summary.updated++;
            // Delete existing relations to cleanly replace them
            await tx.taskDevice.deleteMany({ where: { deviceId: existingDevice.id } });
          } else {
            summary.created++;
          }
          
          // The Prisma schema maps "Pre-order" Availability to "PreOrder" in the TS enum if generated with @map,
          // but we can pass the string matched by Prisma. Zod enum maps exactly.
          // Wait, in Prisma:
          // enum Availability { Available, PreOrder @map("Pre-order"), Announced, Discontinued }
          // In the Prisma client, "Pre-order" becomes "PreOrder". We should map it if needed.
          const mappedAvailability = deviceData.availability === "Pre-order" ? "PreOrder" : deviceData.availability;

          // 3. Upsert Device and reconnect relations
          await tx.device.upsert({
            where: { slug: deviceData.slug },
            create: {
              slug: deviceData.slug,
              name: deviceData.name,
              manufacturer: deviceData.manufacturer,
              category: deviceData.category,
              availability: mappedAvailability as Availability,
              price: deviceData.price || null,
              year: deviceData.year,
              month: deviceData.month || null,
              description: deviceData.description,
              imageUrl: deviceData.imageUrl,
              images: deviceData.images,
              videoUrl: deviceData.videoUrl || null,
              manufacturerLogoUrl: deviceData.manufacturerLogoUrl,
              mainTask: deviceData.mainTask,
              formFactor: deviceData.formFactor || null,
              country: deviceData.country || null,
              ram: deviceData.ram || null,
              aiFeatures: deviceData.aiFeatures,
              primaryUseCases: deviceData.primaryUseCases,
              additionalInfo: deviceData.additionalInfo || null,
              buyUrl: deviceData.buyUrl || null,
              tasks: {
                create: taskIds.map(tId => ({ taskId: tId }))
              }
            },
            update: {
              name: deviceData.name,
              manufacturer: deviceData.manufacturer,
              category: deviceData.category,
              availability: mappedAvailability as Availability,
              price: deviceData.price || null,
              year: deviceData.year,
              month: deviceData.month || null,
              description: deviceData.description,
              imageUrl: deviceData.imageUrl,
              images: deviceData.images,
              videoUrl: deviceData.videoUrl || null,
              manufacturerLogoUrl: deviceData.manufacturerLogoUrl,
              mainTask: deviceData.mainTask,
              formFactor: deviceData.formFactor || null,
              country: deviceData.country || null,
              ram: deviceData.ram || null,
              aiFeatures: deviceData.aiFeatures,
              primaryUseCases: deviceData.primaryUseCases,
              additionalInfo: deviceData.additionalInfo || null,
              buyUrl: deviceData.buyUrl || null,
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
        logger.error(`Error ingesting device ${deviceData.slug}:`, err);
        summary.errors.push({
          slug: deviceData.slug,
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
