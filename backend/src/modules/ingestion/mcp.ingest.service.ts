import type { PrismaClient } from "@prisma/client";
import type { MCPIngestPayload } from "./mcp.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class MCPIngestService {
  static async ingestMCPItems(prisma: PrismaClient, payload: MCPIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[],
    };

    for (const itemData of payload.items) {
      summary.processed++;

      try {
        await prisma.$transaction(async (tx) => {
          const existingItem = await tx.mCPItem.findUnique({ where: { slug: itemData.slug } });
          if (existingItem) {
            summary.updated++;
            await tx.mCPItemCategory.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.mCPItemSubCategory.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.mCPItemTag.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.technicalSpec.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.installationGuide.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.mCPFeature.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.mCPUseCase.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.pricingPlan.deleteMany({ where: { mcpItemId: existingItem.id } });
            await tx.mCPDirectoryFAQ.deleteMany({ where: { mcpItemId: existingItem.id } });
          } else {
            summary.created++;
          }

          const categoryIds: string[] = [];
          for (const category of itemData.categories) {
            const record = await tx.mCPDirectoryCategory.upsert({
              where: { slug: category.slug },
              create: {
                slug: category.slug,
                name: category.name,
                description: category.description || null,
              },
              update: {
                name: category.name,
                description: category.description || null,
              },
            });
            categoryIds.push(record.id);
          }

          const subCategoryIds: string[] = [];
          for (const subCategory of itemData.subCategories) {
            const parentCategory = await tx.mCPDirectoryCategory.findUnique({
              where: { slug: subCategory.categorySlug },
            });
            const categoryId = parentCategory?.id ?? categoryIds[0] ?? undefined;
            if (!categoryId) {
              throw new Error(`Parent category not found for MCP subcategory ${subCategory.slug}`);
            }
            const record = await tx.mCPDirectorySubCategory.upsert({
              where: { slug: subCategory.slug },
              create: {
                slug: subCategory.slug,
                name: subCategory.name,
                description: subCategory.description || null,
                categoryId,
              },
              update: {
                name: subCategory.name,
                description: subCategory.description || null,
                categoryId,
              },
            });
            subCategoryIds.push(record.id);
          }

          const tagIds: string[] = [];
          for (const tag of itemData.tags) {
            const record = await tx.mCPDirectoryTag.upsert({
              where: { slug: tag.slug },
              create: { slug: tag.slug, name: tag.name },
              update: { name: tag.name },
            });
            tagIds.push(record.id);
          }

          const createOrUpdate = {
            slug: itemData.slug,
            itemType: itemData.itemType,
            name: itemData.name,
            logoUrl: itemData.logoUrl || null,
            coverImageUrl: itemData.coverImageUrl || null,
            shortDescription: itemData.shortDescription,
            fullDescription: itemData.fullDescription,
            providerName: itemData.providerName,
            providerUrl: itemData.providerUrl || null,
            license: itemData.license || null,
            pricingType: itemData.pricingType,
            startingPrice: itemData.startingPrice ?? null,
            isFeatured: itemData.isFeatured,
            isVerified: itemData.isVerified,
            launchDate: itemData.launchDate ? new Date(itemData.launchDate) : null,
            lastUpdatedDate: itemData.lastUpdatedDate ? new Date(itemData.lastUpdatedDate) : undefined,
            websiteUrl: itemData.websiteUrl || null,
            documentationUrl: itemData.documentationUrl || null,
            repositoryUrl: itemData.repositoryUrl || null,
            qualityScore: itemData.qualityScore ?? null,
            easeOfUseScore: itemData.easeOfUseScore ?? null,
            globalRank: itemData.globalRank ?? null,
            leaderboardRank: itemData.leaderboardRank ?? null,
            editorialVerdict: itemData.editorialVerdict || null,
            viewCount: itemData.viewCount,
            monthlyVisits: itemData.monthlyVisits,
            upvoteCount: itemData.upvoteCount,
            saveCount: itemData.saveCount,
          };

          await tx.mCPItem.upsert({
            where: { slug: itemData.slug },
            create: {
              ...createOrUpdate,
              categories: {
                create: categoryIds.map((categoryId) => ({ categoryId })),
              },
              subCategories: {
                create: subCategoryIds.map((subCategoryId) => ({ subCategoryId })),
              },
              tags: {
                create: tagIds.map((tagId) => ({ tagId })),
              },
              technicalSpecs: {
                create: itemData.technicalSpecs
                  .filter((spec): spec is NonNullable<typeof spec> => spec !== null)
                  .map((spec) => ({
                    supportedPlatforms: spec.supportedPlatforms,
                    compatibility: spec.compatibility,
                    integrations: spec.integrations,
                    localBindingControls: spec.localBindingControls,
                  })),
              },
              installationGuides: {
                create: itemData.installationGuides.map((guide) => ({
                  stepNumber: guide.stepNumber,
                  title: guide.title,
                  codeSnippet: guide.codeSnippet,
                  instructions: guide.instructions,
                })),
              },
              features: {
                create: itemData.features.map((feature) => ({
                  title: feature.title,
                  description: feature.description,
                  icon: feature.icon || null,
                  badge: feature.badge || null,
                })),
              },
              useCases: {
                create: itemData.useCases.map((useCase) => ({
                  title: useCase.title,
                  description: useCase.description,
                  applications: useCase.applications,
                })),
              },
              pricingPlans: {
                create: itemData.pricingPlans.map((plan) => ({
                  planName: plan.planName,
                  price: plan.price,
                  billingCycle: plan.billingCycle,
                  featuresList: plan.featuresList,
                })),
              },
              faqs: {
                create: itemData.faqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                })),
              },
            },
            update: {
              ...createOrUpdate,
              categories: {
                create: categoryIds.map((categoryId) => ({ categoryId })),
              },
              subCategories: {
                create: subCategoryIds.map((subCategoryId) => ({ subCategoryId })),
              },
              tags: {
                create: tagIds.map((tagId) => ({ tagId })),
              },
              technicalSpecs: {
                create: itemData.technicalSpecs
                  .filter((spec): spec is NonNullable<typeof spec> => spec !== null)
                  .map((spec) => ({
                    supportedPlatforms: spec.supportedPlatforms,
                    compatibility: spec.compatibility,
                    integrations: spec.integrations,
                    localBindingControls: spec.localBindingControls,
                  })),
              },
              installationGuides: {
                create: itemData.installationGuides.map((guide) => ({
                  stepNumber: guide.stepNumber,
                  title: guide.title,
                  codeSnippet: guide.codeSnippet,
                  instructions: guide.instructions,
                })),
              },
              features: {
                create: itemData.features.map((feature) => ({
                  title: feature.title,
                  description: feature.description,
                  icon: feature.icon || null,
                  badge: feature.badge || null,
                })),
              },
              useCases: {
                create: itemData.useCases.map((useCase) => ({
                  title: useCase.title,
                  description: useCase.description,
                  applications: useCase.applications,
                })),
              },
              pricingPlans: {
                create: itemData.pricingPlans.map((plan) => ({
                  planName: plan.planName,
                  price: plan.price,
                  billingCycle: plan.billingCycle,
                  featuresList: plan.featuresList,
                })),
              },
              faqs: {
                create: itemData.faqs.map((faq) => ({
                  question: faq.question,
                  answer: faq.answer,
                })),
              },
            },
          });
        }, { timeout: 10000 });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting MCP item ${itemData.slug}:`, err);
        summary.errors.push({ slug: itemData.slug, message });
        if (summary.created > 0 && message.includes('create')) summary.created--;
        if (summary.updated > 0 && !message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
