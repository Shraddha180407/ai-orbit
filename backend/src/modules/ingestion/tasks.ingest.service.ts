import type { PrismaClient } from "@prisma/client";
import type { TasksIngestPayload } from "./tasks.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class TasksIngestService {
    static async deleteTask(prisma: PrismaClient, slug: string) {
  const task = await prisma.task.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!task) {
    return null;
  }

  await prisma.task.delete({
    where: { id: task.id },
  });

  return {
    deleted: 1,
    slug,
  };
}
  static async ingestTasks(
    prisma: PrismaClient,
    payload: TasksIngestPayload
  ) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[],
    };

    // Same aliases used by the existing task seed.
    const TOOL_NAME_ALIASES: Record<string, string> = {
      canva: "canva magic studio",
      "canva ai": "canva magic studio",
      "canva color palette generator": "canva magic studio",
      "canva magic write": "canva magic studio",
      framer: "framer ai",
      grammarly: "grammarly ai",
      replit: "replit agent",
    };

    // Load tools once instead of querying the DB for every task.
    const tools = await prisma.tool.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    const toolByName = new Map<string, { id: string }>();

    for (const tool of tools) {
      toolByName.set(tool.name.toLowerCase(), {
        id: tool.id,
      });
    }

    for (const taskData of payload.tasks) {
      summary.processed++;

      try {
        await prisma.$transaction(
          async (tx) => {
            // 1. Upsert task category
            const category = await tx.taskCategory.upsert({
              where: {
                slug: taskData.category.slug,
              },
              update: {
                name: taskData.category.name,
              },
              create: {
                name: taskData.category.name,
                slug: taskData.category.slug,
              },
            });

            // 2. Resolve tools from _toolNames
            const resolvedToolIds = new Set<string>();

            for (const toolName of taskData._toolNames ?? []) {
              const key = toolName.toLowerCase();

              const tool =
                toolByName.get(key) ??
                toolByName.get(TOOL_NAME_ALIASES[key] ?? "");

              if (tool) {
                resolvedToolIds.add(tool.id);
              } else {
                logger.warn(
                  `Tool not found for task "${taskData.slug}": ${toolName}`
                );
              }
            }

            const resolvedToolCount = resolvedToolIds.size;

            // 3. Check whether task already exists
            const existingTask = await tx.task.findUnique({
              where: {
                slug: taskData.slug,
              },
              select: {
                id: true,
              },
            });

            if (existingTask) {
              summary.updated++;
            } else {
              summary.created++;
            }

            // 4. Upsert Task
            const task = await tx.task.upsert({
              where: {
                slug: taskData.slug,
              },
              update: {
                title: taskData.title,
                description: taskData.description,
                iconUrl: taskData.iconUrl ?? null,
                bannerUrl: taskData.bannerUrl ?? null,
                difficulty: taskData.difficulty,
                pricingModel: taskData.pricingModel,
                isFeatured: taskData.isFeatured,
                shareUrl: taskData.shareUrl ?? null,

                toolCount: resolvedToolCount,
                modelCount: taskData.modelCount,
                robotCount: taskData.robotCount,
                deviceCount: taskData.deviceCount,
                saveCount: taskData.saveCount,
                likeCount: taskData.likeCount,
                subscriberCount: taskData.subscriberCount,

                categoryId: category.id,
              },

              create: {
                slug: taskData.slug,
                title: taskData.title,
                description: taskData.description,
                iconUrl: taskData.iconUrl ?? null,
                bannerUrl: taskData.bannerUrl ?? null,
                difficulty: taskData.difficulty,
                pricingModel: taskData.pricingModel,
                isFeatured: taskData.isFeatured,
                shareUrl: taskData.shareUrl ?? null,

                toolCount: resolvedToolCount,
                modelCount: taskData.modelCount,
                robotCount: taskData.robotCount,
                deviceCount: taskData.deviceCount,
                saveCount: taskData.saveCount,
                likeCount: taskData.likeCount,
                subscriberCount: taskData.subscriberCount,

                categoryId: category.id,
              },
            });

            // 5. Refresh resources
            await tx.taskResource.deleteMany({
              where: {
                taskId: task.id,
              },
            });

            if (taskData.resources.length > 0) {
              await tx.taskResource.createMany({
                data: taskData.resources.map((resource) => ({
                  taskId: task.id,
                  title: resource.title,
                  url: resource.url,
                  homepage: resource.homepage ?? null,
                  source: resource.source ?? null,
                  postedAt: resource.postedAt
                    ? new Date(resource.postedAt)
                    : null,
                  stars: resource.stars ?? null,
                })),
              });
            }

            // 6. Refresh popular tools
            await tx.taskPopularTool.deleteMany({
              where: {
                taskId: task.id,
              },
            });

            if (taskData.popularTools.length > 0) {
              await tx.taskPopularTool.createMany({
                data: taskData.popularTools.map((tool) => ({
                  taskId: task.id,
                  slug: tool.slug,
                  name: tool.name,
                  logoUrl: tool.logoUrl ?? null,
                  tagline: tool.tagline,
                  pricingModel: tool.pricingModel,
                  rating: tool.rating ?? null,
                  bookmarkCount: tool.bookmarkCount,
                  visitUrl: tool.visitUrl ?? null,
                })),
                skipDuplicates: true,
              });
            }

            // 7. Refresh popular models
            await tx.taskPopularModel.deleteMany({
              where: {
                taskId: task.id,
              },
            });

            if (taskData.popularModels.length > 0) {
              await tx.taskPopularModel.createMany({
                data: taskData.popularModels.map((model) => ({
                  taskId: task.id,
                  slug: model.slug,
                  name: model.name,
                  provider: model.provider,
                  logoUrl: model.logoUrl ?? null,
                  modelType: model.modelType,
                  pricingModel: model.pricingModel,
                  benchmarkScore: model.benchmarkScore ?? null,
                  websiteUrl: model.websiteUrl ?? null,
                })),
                skipDuplicates: true,
              });
            }

            // 8. Refresh task-tool relations
            await tx.taskTool.deleteMany({
              where: {
                taskId: task.id,
              },
            });

            if (resolvedToolIds.size > 0) {
              await tx.taskTool.createMany({
                data: Array.from(resolvedToolIds).map((toolId) => ({
                  taskId: task.id,
                  toolId,
                })),
                skipDuplicates: true,
              });
            }
          },
          {
            timeout: 10000,
          }
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : String(err);

        logger.error(
          `Error ingesting task ${taskData.slug}:`,
          err
        );

        summary.errors.push({
          slug: taskData.slug,
          message,
        });

        if (summary.created > 0 && message.includes("create")) {
          summary.created--;
        }

        if (summary.updated > 0 && !message.includes("create")) {
          summary.updated--;
        }
      }
    }

    return summary;
  }
}