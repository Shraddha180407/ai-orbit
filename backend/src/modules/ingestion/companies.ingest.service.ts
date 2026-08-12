import type { PrismaClient } from "@prisma/client";
import type { CompaniesIngestPayload } from "./companies.ingest.schema.js";
import { logger } from "../../lib/logger.js";

export class CompaniesIngestService {
  static async ingestCompanies(prisma: PrismaClient, payload: CompaniesIngestPayload) {
    const summary = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { slug: string; message: string }[]
    };

    for (const companyData of payload.companies) {
      summary.processed++;

      try {
        await prisma.$transaction(async (tx) => {
          const existingCompany = await tx.company.findUnique({
            where: { slug: companyData.slug }
          });

          if (existingCompany) {
            summary.updated++;
          } else {
            summary.created++;
          }

          const upsertedCompany = await tx.company.upsert({
            where: { slug: companyData.slug },
            create: {
              slug: companyData.slug,
              name: companyData.name,
              logoUrl: companyData.logoUrl || null,
              description: companyData.description || null,
              website: companyData.website || null,
              country: companyData.country || null,
              city: companyData.city || null,
              foundedYear: companyData.foundedYear || null,
              type: companyData.type,
              sector: companyData.sector || null,
              verified: companyData.verified,
              featured: companyData.featured,
              valuation: companyData.valuation ? BigInt(companyData.valuation) : null,
              fundingRaised: companyData.fundingRaised ? BigInt(companyData.fundingRaised) : null,
              latestFundingRound: companyData.latestFundingRound || null,
              employeeCount: companyData.employeeCount || null,
              linkedinUrl: companyData.linkedinUrl || null,
              twitterUrl: companyData.twitterUrl || null,
              views: companyData.views,
              upvotes: companyData.upvotes,
              impressions: companyData.impressions,
            },
            update: {
              name: companyData.name,
              logoUrl: companyData.logoUrl || null,
              description: companyData.description || null,
              website: companyData.website || null,
              country: companyData.country || null,
              city: companyData.city || null,
              foundedYear: companyData.foundedYear || null,
              type: companyData.type,
              sector: companyData.sector || null,
              verified: companyData.verified,
              featured: companyData.featured,
              valuation: companyData.valuation ? BigInt(companyData.valuation) : null,
              fundingRaised: companyData.fundingRaised ? BigInt(companyData.fundingRaised) : null,
              latestFundingRound: companyData.latestFundingRound || null,
              employeeCount: companyData.employeeCount || null,
              linkedinUrl: companyData.linkedinUrl || null,
              twitterUrl: companyData.twitterUrl || null,
              views: companyData.views,
              upvotes: companyData.upvotes,
              impressions: companyData.impressions,
            }
          });

          // Link existing tools and models to this company
          if (companyData.tools && companyData.tools.length > 0) {
            await tx.tool.updateMany({
              where: { slug: { in: companyData.tools } },
              data: { companyId: upsertedCompany.id }
            });
          }

          if (companyData.aiModels && companyData.aiModels.length > 0) {
            await tx.aIModel.updateMany({
              where: { slug: { in: companyData.aiModels } },
              data: { providerId: upsertedCompany.id }
            });
          }
        }, {
          timeout: 10000
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error(`Error ingesting company ${companyData.slug}:`, err);
        summary.errors.push({
          slug: companyData.slug,
          message
        });

        if (summary.created > 0 && message.includes('create')) summary.created--;
        if (summary.updated > 0 && !message.includes('create')) summary.updated--;
      }
    }

    return summary;
  }
}
