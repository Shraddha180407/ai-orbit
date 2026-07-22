import type { PrismaClient, Prisma } from "@prisma/client";
import type { ToolsIngestPayload } from "./tools.ingest.schema.js";

export class ToolsIngestService {
  static async ingestTools(prisma: PrismaClient, payload: ToolsIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as any[]
    };

    for (const toolData of payload.tools) {
      summary.processed++;
      
      try {
        await prisma.$transaction(async (tx) => {
          let companyId: string | null = null;
          
          // 1. Upsert Company if provided
          if (toolData.company) {
            const company = await tx.company.upsert({
              where: { slug: toolData.company.slug },
              create: {
                slug: toolData.company.slug,
                name: toolData.company.name,
                logoUrl: toolData.company.logoUrl || null,
              },
              update: {
                name: toolData.company.name,
                logoUrl: toolData.company.logoUrl || null,
              }
            });
            companyId = company.id;
          }

          // 2. Upsert Categories
          const categoryIds: string[] = [];
          for (const cat of toolData.categories) {
            const category = await tx.category.upsert({
              where: { slug: cat.slug },
              create: { slug: cat.slug, name: cat.name },
              update: { name: cat.name }
            });
            categoryIds.push(category.id);
          }

          // 3. Upsert Tags
          const tagIds: string[] = [];
          for (const t of toolData.tags) {
            const tag = await tx.tag.upsert({
              where: { slug: t.slug },
              create: { slug: t.slug, name: t.name },
              update: { name: t.name }
            });
            tagIds.push(tag.id);
          }

          // 4. Check if Tool already exists to determine if it's create or update for summary
          const existingTool = await tx.tool.findUnique({
            where: { slug: toolData.slug }
          });
          
          if (existingTool) {
            summary.updated++;
          } else {
            summary.created++;
          }

          // 5. Upsert Tool and reconnect relations
          // Note: using upsert for Tool might need careful handling of many-to-many,
          // Prisma's upsert can handle standard relations if done via connect/create.
          // Since it's a join table (ToolCategory, ToolTag), we might need to delete existing associations first
          // if we are fully replacing them, or just use create/connect depending on Prisma schema.
          
          // In ai-orbit schema, ToolCategory and ToolTag are explicit join models.
          // We must clear them out manually for updates to ensure exact state.
          if (existingTool) {
            await tx.toolCategory.deleteMany({ where: { toolId: existingTool.id } });
            await tx.toolTag.deleteMany({ where: { toolId: existingTool.id } });
          }

          await tx.tool.upsert({
            where: { slug: toolData.slug },
            create: {
              slug: toolData.slug,
              name: toolData.name,
              description: toolData.description,
              websiteUrl: toolData.websiteUrl,
              logoUrl: toolData.logoUrl || null,
              features: toolData.features,
              screenshots: toolData.screenshots,
              pricingModel: toolData.pricingModel,
              pricingAmount: toolData.pricingAmount || null,
              billingFrequency: toolData.billingFrequency,
              isOpenSource: toolData.isOpenSource,
              isTrending: toolData.isTrending,
              companyId,
              categories: {
                create: categoryIds.map(cId => ({ categoryId: cId }))
              },
              tags: {
                create: tagIds.map(tId => ({ tagId: tId }))
              }
            },
            update: {
              name: toolData.name,
              description: toolData.description,
              websiteUrl: toolData.websiteUrl,
              logoUrl: toolData.logoUrl || null,
              features: toolData.features,
              screenshots: toolData.screenshots,
              pricingModel: toolData.pricingModel,
              pricingAmount: toolData.pricingAmount || null,
              billingFrequency: toolData.billingFrequency,
              isOpenSource: toolData.isOpenSource,
              isTrending: toolData.isTrending,
              companyId,
              categories: {
                create: categoryIds.map(cId => ({ categoryId: cId }))
              },
              tags: {
                create: tagIds.map(tId => ({ tagId: tId }))
              }
            }
          });
        }, {
          // Increase timeout for large payloads
          timeout: 10000 
        });
      } catch (err: any) {
        console.error(`Error ingesting tool ${toolData.slug}:`, err);
        summary.errors.push({
          slug: toolData.slug,
          message: err.message
        });
        
        // Adjust counts since it failed
        if (summary.created > 0 && err.message.includes('create')) summary.created--;
        if (summary.updated > 0 && !err.message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
