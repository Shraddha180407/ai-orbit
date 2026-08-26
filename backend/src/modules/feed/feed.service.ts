import { PrismaClient, Prisma } from '@prisma/client';

export class FeedService {
  constructor(private prisma: PrismaClient) {}

  async getUnifiedFeed(filters: string[], page: number) {
    if (!filters || filters.length === 0 || filters.includes('none')) {
      return { items: [], page, totalPages: 0, hasNextPage: false };
    }

    const pageSize = 12;
    const offset = (page - 1) * pageSize;
    const queries: Prisma.Sql[] = [];

    // 1. INDEX PHASE: The Ultimate Sorting Engine
    // quality_score = 2 for items with a REAL release/publish date.
    // quality_score = 1 for generic items with no date (like Gemini/Cursor).
    // All dates are normalized to DateTime so PostgreSQL can sort them perfectly.
    
    if (filters.includes('tools')) {
      queries.push(Prisma.sql`SELECT id, COALESCE("releaseDate", "createdAt") as sort_date, 'TOOL' as "entityType", CASE WHEN "releaseDate" IS NOT NULL THEN 2 ELSE 1 END as quality_score FROM "Tool" WHERE "logoUrl" IS NOT NULL AND "logoUrl" != ''`);
    }
    if (filters.includes('devices')) {
      // FIX: Devices don't have a releaseDate column in the database, so we default to 1!
      queries.push(Prisma.sql`SELECT id, "createdAt" as sort_date, 'DEVICE' as "entityType", 1 as quality_score FROM "Device" WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''`);
    }
    if (filters.includes('robots')) {
      queries.push(Prisma.sql`SELECT id, "createdAt" as sort_date, 'ROBOT' as "entityType", CASE WHEN "releaseDate" IS NOT NULL AND "releaseDate" != '' THEN 2 ELSE 1 END as quality_score FROM "Robot" WHERE ("logoUrl" IS NOT NULL AND "logoUrl" != '') OR ("thumbnailUrl" IS NOT NULL AND "thumbnailUrl" != '')`);
    }
    if (filters.includes('news')) {
      queries.push(Prisma.sql`SELECT id, "publishedAt" as sort_date, 'NEWS' as "entityType", 2 as quality_score FROM "News"`);
    }
    if (filters.includes('models')) {
      queries.push(Prisma.sql`SELECT id, "createdAt" as sort_date, 'MODEL' as "entityType", CASE WHEN "releaseDate" IS NOT NULL AND "releaseDate" != '' AND "releaseDate" != 'Unknown' THEN 2 ELSE 1 END as quality_score FROM "AIModel"`);
    }
    if (filters.includes('companies')) {
      queries.push(Prisma.sql`SELECT id, "createdAt" as sort_date, 'COMPANY' as "entityType", 1 as quality_score FROM "Company" WHERE "logoUrl" IS NOT NULL AND "logoUrl" != ''`);
    }
    if (filters.includes('videos')) {
      queries.push(Prisma.sql`SELECT id, "createdAt" as sort_date, 'VIDEO' as "entityType", 2 as quality_score FROM "Video" WHERE "thumbnail" IS NOT NULL AND "thumbnail" != ''`);
    }
    if (filters.includes('repositories')) {
      queries.push(Prisma.sql`SELECT id, "githubCreatedAt" as sort_date, 'REPOSITORY' as "entityType", 2 as quality_score FROM "Repository"`);
    }
    if (filters.includes('companies')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'COMPANY' as "entityType", 0 as task_count FROM "Company"`);
    }
    if (filters.includes('videos')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'VIDEO' as "entityType", 0 as task_count FROM "Video"`);
    }
    if (filters.includes('repositories')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'REPOSITORY' as "entityType", 0 as task_count FROM "Repository"`);
    }

    if (queries.length === 0) return { items: [], page, totalPages: 0, hasNextPage: false };

    const unionQuery = Prisma.join(queries, ' UNION ALL ');
    
    // Sort primarily by quality_score (real release dates win!), then chronologically
    const finalQuery = Prisma.sql`
      WITH UnifiedFeed AS (${unionQuery})
      SELECT id, "entityType", sort_date as "createdAt" FROM UnifiedFeed
      ORDER BY quality_score DESC, sort_date DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    try {
      const indexResults = await this.prisma.$queryRaw<{id: string, entityType: string, createdAt: Date}[]>(finalQuery);

      if (!indexResults || indexResults.length === 0) {
        return { items: [], page, hasNextPage: false };
      }

      const toolIds = indexResults.filter(i => i.entityType === 'TOOL').map(i => i.id);
      const deviceIds = indexResults.filter(i => i.entityType === 'DEVICE').map(i => i.id);
      const robotIds = indexResults.filter(i => i.entityType === 'ROBOT').map(i => i.id);
      const newsIds = indexResults.filter(i => i.entityType === 'NEWS').map(i => i.id);
      const modelIds = indexResults.filter(i => i.entityType === 'MODEL').map(i => i.id);
      const companyIds = indexResults.filter(i => i.entityType === 'COMPANY').map(i => i.id);
      const videoIds = indexResults.filter(i => i.entityType === 'VIDEO').map(i => i.id);
      const repoIds = indexResults.filter(i => i.entityType === 'REPOSITORY').map(i => i.id);

      // 2. HYDRATION PHASE
      const [tools, devices, robots, news, models, companies, videos, repos] = await Promise.all([
        toolIds.length > 0 ? this.prisma.tool.findMany({ 
          where: { id: { in: toolIds } }, include: { ttasks: { include: { task: true } }, categories: true }
        }).catch(() => this.prisma.tool.findMany({ where: { id: { in: toolIds } } })) : Promise.resolve([]),
        
        deviceIds.length > 0 ? this.prisma.device.findMany({ where: { id: { in: deviceIds } } }) : Promise.resolve([]),
        robotIds.length > 0 ? this.prisma.robot.findMany({ where: { id: { in: robotIds } } }) : Promise.resolve([]),
        newsIds.length > 0 ? (this.prisma as any).news.findMany({ where: { id: { in: newsIds } }, include: { publisher: true } }) : Promise.resolve([]),
        modelIds.length > 0 ? (this.prisma as any).aIModel.findMany({ where: { id: { in: modelIds } }, include: { provider: true } }) : Promise.resolve([]),
        companyIds.length > 0 ? this.prisma.company.findMany({ where: { id: { in: companyIds } } }) : Promise.resolve([]),
        videoIds.length > 0 ? (this.prisma as any).video.findMany({ where: { id: { in: videoIds } } }) : Promise.resolve([]),
        repoIds.length > 0 ? this.prisma.repository.findMany({ where: { id: { in: repoIds } } }) : Promise.resolve([])
      ]);

      const itemMap = new Map<string, any>();
      
      // We pass null for releaseDate if it doesn't exist so the UI legitimately renders '—'
      tools.forEach(t => itemMap.set(`TOOL-${t.id}`, { 
        ...t, entityType: 'TOOL' 
      }));
      
      devices.forEach((d: any) => {
        itemMap.set(`DEVICE-${d.id}`, { 
          ...d, entityType: 'DEVICE', logoUrl: d.imageUrl || d.manufacturerLogoUrl,
          description: d.description || d.additionalInfo || "",
          releaseDate: d.releaseDate || null, pricingModel: d.price ? 'PAID' : 'FREE', hasApi: false,
          ttasks: d.mainTask ? [{ task: { title: d.mainTask, slug: d.mainTask } }] : []
        });
      });
      
      robots.forEach((r: any) => {
        const shortCategory = r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase() : 'Robotics';
        itemMap.set(`ROBOT-${r.id}`, { 
          ...r, entityType: 'ROBOT', logoUrl: r.logoUrl || r.thumbnailUrl,
          description: r.about || r.specs || "", 
          releaseDate: r.releaseDate || null, pricingModel: r.price ? 'PAID' : 'FREE', hasApi: false,
          ttasks: [{ task: { title: shortCategory, slug: shortCategory } }] 
        });
      });
      
      news.forEach((n: any) => {
        itemMap.set(`NEWS-${n.id}`, { 
          ...n, entityType: 'NEWS', name: n.title, description: n.dek || n.aiSummary, 
          logoUrl: n.publisher?.logoUrl || n.imageUrl, 
          releaseDate: n.publishedAt || null, pricingModel: 'FREE', hasApi: false,
          ttasks: n.category ? [{ task: { title: n.category, slug: n.category } }] : []
        });
      });
      
      models.forEach((m: any) => {
        const isUnknown = m.releaseDate === 'Unknown' || !m.releaseDate;
        itemMap.set(`MODEL-${m.id}`, { 
          ...m, entityType: 'MODEL', logoUrl: m.provider?.logoUrl || m.logoUrl, description: m.description, 
          releaseDate: isUnknown ? null : m.releaseDate, pricingModel: m.openSource ? 'FREE' : 'FREEMIUM', hasApi: m.apiAvailable,
          ttasks: m.primaryTask ? [{ task: { title: m.primaryTask, slug: m.primaryTask } }] : []
        });
      });

      companies.forEach((c: any) => {
        itemMap.set(`COMPANY-${c.id}`, { 
          ...c, entityType: 'COMPANY', pricingModel: 'FREE', hasApi: false,
          releaseDate: c.foundedYear ? `${c.foundedYear}-01-01` : null,
          ttasks: c.sector ? [{ task: { title: c.sector, slug: c.sector } }] : []
        });
      });

      videos.forEach((v: any) => {
        itemMap.set(`VIDEO-${v.id}`, { 
          ...v, entityType: 'VIDEO', name: v.title, logoUrl: v.thumbnail || v.authorAvatar, pricingModel: 'FREE', hasApi: false,
          releaseDate: v.publishedAt || null,
          ttasks: v.toolCategory ? [{ task: { title: v.toolCategory, slug: v.toolCategory } }] : []
        });
      });

      repos.forEach((r: any) => {
        itemMap.set(`REPOSITORY-${r.id}`, { 
          ...r, entityType: 'REPOSITORY', logoUrl: r.logoUrl || r.ownerAvatarUrl, description: r.description, pricingModel: 'FREE', hasApi: true,
          releaseDate: r.githubCreatedAt || null,
          ttasks: r.language ? [{ task: { title: r.language, slug: r.language } }] : []
        });
      });

      // 3. REASSEMBLE Phase
      const hydratedItems = indexResults
        .map(idx => itemMap.get(`${idx.entityType}-${idx.id}`))
        .filter(Boolean);

      return { items: hydratedItems, page, hasNextPage: indexResults.length === pageSize };

    } catch (error) {
      console.error("Feed Database Error:", error);
      throw error;
    }
  }
}