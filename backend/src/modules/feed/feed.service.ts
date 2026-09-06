import { PrismaClient, Prisma } from '@prisma/client';

export class FeedService {
  constructor(private prisma: PrismaClient) {}

  async getUnifiedFeed(filters: string[], page: number, pageSize: number = 50) {
    if (!filters || filters.length === 0 || filters.includes('none')) {
      return { items: [], page, pageSize, total: 0, totalPages: 0, hasNextPage: false, timeframe: 'all' };
    }

    const offset = Math.max(0, (page - 1) * pageSize);
    const queries: Prisma.Sql[] = [];

    // 1. INDEX PHASE: The Ultimate Sorting Engine
    // quality_score = 2 for items with a REAL release/publish date.
    // quality_score = 1 for generic items with no date (like Gemini/Cursor).
    // All dates are normalized to DateTime so PostgreSQL can sort them perfectly.
    
    if (filters.includes('tools')) {
      queries.push(Prisma.sql`
        SELECT id, 
          COALESCE("releaseDate", "createdAt") as sort_date, 
          'TOOL' as "entityType",
          (CASE WHEN "releaseDate" IS NOT NULL THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Tool" 
        WHERE "logoUrl" IS NOT NULL AND "logoUrl" != ''
      `);
    }
    if (filters.includes('robots')) {
      queries.push(Prisma.sql`
        SELECT id, 
          (CASE 
            WHEN "releaseDate" IS NULL OR "releaseDate" = '' OR "releaseDate" = 'Unknown' THEN "createdAt"
            WHEN "releaseDate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN "releaseDate"::timestamp
            WHEN "releaseDate" ~ '^[0-9]{4}-[0-9]{2}' THEN ("releaseDate" || '-01')::timestamp
            WHEN "releaseDate" ~ '^[0-9]{4}$' THEN ("releaseDate" || '-01-01')::timestamp
            WHEN "releaseDate" ~* '^[a-zA-Z]+ [0-9]{4}' THEN to_date("releaseDate", 'Month YYYY')::timestamp
            ELSE "createdAt"
          END) as sort_date, 
          'ROBOT' as "entityType",
          (CASE WHEN "releaseDate" IS NOT NULL AND "releaseDate" != '' AND "releaseDate" != 'Unknown' THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Robot" 
        WHERE ("logoUrl" IS NOT NULL AND "logoUrl" != '') OR ("thumbnailUrl" IS NOT NULL AND "thumbnailUrl" != '')
      `);
    }
    if (filters.includes('news')) {
      queries.push(Prisma.sql`
        SELECT id, 
          "publishedAt" as sort_date, 
          'NEWS' as "entityType",
          2::int as has_real_date
        FROM "News"
      `);
    }
    if (filters.includes('models')) {
      queries.push(Prisma.sql`
        SELECT id, 
          (CASE 
            WHEN "releaseDate" IS NULL OR "releaseDate" = '' OR "releaseDate" = 'Unknown' THEN "createdAt"
            WHEN "releaseDate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN "releaseDate"::timestamp
            WHEN "releaseDate" ~ '^[0-9]{4}-[0-9]{2}' THEN ("releaseDate" || '-01')::timestamp
            WHEN "releaseDate" ~ '^[0-9]{4}$' THEN ("releaseDate" || '-01-01')::timestamp
            WHEN "releaseDate" ~* '^[a-zA-Z]+ [0-9]{4}' THEN to_date("releaseDate", 'Month YYYY')::timestamp
            ELSE "createdAt"
          END) as sort_date, 
          'MODEL' as "entityType",
          (CASE WHEN "releaseDate" IS NOT NULL AND "releaseDate" != '' AND "releaseDate" != 'Unknown' THEN 2 ELSE 1 END)::int as has_real_date
        FROM "AIModel"
      `);
    }
    if (filters.includes('videos')) {
      queries.push(Prisma.sql`
        SELECT id, 
          (CASE 
            WHEN "publishedAt" IS NULL OR "publishedAt" = '' THEN "createdAt"
            WHEN "publishedAt" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}' THEN "publishedAt"::timestamp
            WHEN "publishedAt" ~ '^[0-9]{4}-[0-9]{2}' THEN ("publishedAt" || '-01')::timestamp
            WHEN "publishedAt" ~ '^[0-9]{4}$' THEN ("publishedAt" || '-01-01')::timestamp
            WHEN "publishedAt" ~* '^[a-zA-Z]+ [0-9]{4}' THEN to_date("publishedAt", 'Month YYYY')::timestamp
            ELSE "createdAt"
          END) as sort_date, 
          'VIDEO' as "entityType",
          (CASE WHEN "publishedAt" IS NOT NULL AND "publishedAt" != '' THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Video" 
        WHERE "thumbnail" IS NOT NULL AND "thumbnail" != ''
      `);
    }
    if (filters.includes('repositories')) {
      queries.push(Prisma.sql`
        SELECT id, 
          COALESCE("githubCreatedAt", "syncedAt", "createdAt") as sort_date, 
          'REPOSITORY' as "entityType",
          (CASE WHEN "githubCreatedAt" IS NOT NULL THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Repository"
      `);
    }
    if (filters.includes('companies')) {
      queries.push(Prisma.sql`
        SELECT id, 
          (CASE WHEN "foundedYear" IS NOT NULL THEN (("foundedYear"::text || '-01-01')::timestamp) ELSE "createdAt" END) as sort_date, 
          'COMPANY' as "entityType",
          (CASE WHEN "foundedYear" IS NOT NULL THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Company" 
        WHERE "logoUrl" IS NOT NULL AND "logoUrl" != ''
      `);
    }
    if (filters.includes('devices')) {
      queries.push(Prisma.sql`
        SELECT id, 
          (CASE WHEN year IS NOT NULL AND year ~ '^[0-9]{4}' THEN (year || '-01-01')::timestamp ELSE "createdAt" END) as sort_date, 
          'DEVICE' as "entityType",
          (CASE WHEN year IS NOT NULL AND year != '' THEN 2 ELSE 1 END)::int as has_real_date
        FROM "Device" 
        WHERE "imageUrl" IS NOT NULL AND "imageUrl" != ''
      `);
    }

    if (queries.length === 0) return { items: [], page, pageSize, total: 0, totalPages: 0, hasNextPage: false, timeframe: 'all' };

    const unionQuery = Prisma.join(queries, ' UNION ALL ');
    
    const countQuery = Prisma.sql`
      WITH UnifiedFeed AS (${unionQuery})
      SELECT COUNT(*) as total FROM UnifiedFeed WHERE sort_date <= NOW()
    `;

    const finalQuery = Prisma.sql`
      WITH UnifiedFeed AS (${unionQuery})
      SELECT id, "entityType", sort_date as "createdAt"
      FROM UnifiedFeed
      WHERE sort_date <= NOW()
      ORDER BY has_real_date DESC, sort_date DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    try {
      const [countResult, indexResults] = await Promise.all([
        this.prisma.$queryRaw<{ total: number | bigint; timeframe: string }[]>(countQuery),
        this.prisma.$queryRaw<{ id: string; entityType: string; createdAt: Date }[]>(finalQuery),
      ]);

      const total = Number(countResult[0]?.total || 0);
      const timeframe = countResult[0]?.timeframe || 'all';
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      if (!indexResults || indexResults.length === 0) {
        return { items: [], page, pageSize, total, totalPages, hasNextPage: false, timeframe };
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
      
      // Ensure real authentic release dates are mapped (and null if no explicit release date exists)
      tools.forEach(t => itemMap.set(`TOOL-${t.id}`, { 
        ...t, entityType: 'TOOL',
        releaseDate: t.releaseDate ? t.releaseDate.toISOString() : (t.launchDate || null)
      }));
      
      devices.forEach((d: any) => {
        const devRelease = d.year ? (d.month ? `${d.month} ${d.year}` : `${d.year}`) : (d.releaseDate || null);
        itemMap.set(`DEVICE-${d.id}`, { 
          ...d, entityType: 'DEVICE', logoUrl: d.imageUrl || d.manufacturerLogoUrl,
          description: d.description || d.additionalInfo || "",
          releaseDate: devRelease, pricingModel: d.price ? 'PAID' : 'FREE', hasApi: false,
          ttasks: d.mainTask ? [{ task: { title: d.mainTask, slug: d.mainTask } }] : []
        });
      });
      
      robots.forEach((r: any) => {
        const shortCategory = r.category ? r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase() : 'Robotics';
        itemMap.set(`ROBOT-${r.id}`, { 
          ...r, entityType: 'ROBOT', logoUrl: r.logoUrl || r.thumbnailUrl,
          description: r.about || r.specs || "", 
          releaseDate: (r.releaseDate && r.releaseDate !== '' && r.releaseDate !== 'Unknown') ? r.releaseDate : null,
          pricingModel: r.price ? 'PAID' : 'FREE', hasApi: false,
          ttasks: [{ task: { title: shortCategory, slug: shortCategory } }] 
        });
      });
      
      news.forEach((n: any) => {
        itemMap.set(`NEWS-${n.id}`, { 
          ...n, entityType: 'NEWS', name: n.title, description: n.dek || n.aiSummary, 
          logoUrl: n.publisher?.logoUrl || n.imageUrl, 
          releaseDate: n.publishedAt ? n.publishedAt.toISOString() : null, pricingModel: 'FREE', hasApi: false,
          ttasks: n.category ? [{ task: { title: n.category, slug: n.category } }] : []
        });
      });
      
      models.forEach((m: any) => {
        const isUnknown = m.releaseDate === 'Unknown' || !m.releaseDate;
        const provider = m.provider ? {
          ...m.provider,
          valuation: m.provider.valuation != null ? Number(m.provider.valuation) : null,
          fundingRaised: m.provider.fundingRaised != null ? Number(m.provider.fundingRaised) : null,
        } : null;
        itemMap.set(`MODEL-${m.id}`, { 
          ...m,
          provider,
          entityType: 'MODEL',
          logoUrl: provider?.logoUrl || m.logoUrl,
          description: m.description, 
          releaseDate: (!isUnknown && m.releaseDate) ? m.releaseDate : null,
          pricingModel: m.openSource ? 'FREE' : 'FREEMIUM',
          hasApi: m.apiAvailable,
          ttasks: m.primaryTask ? [{ task: { title: m.primaryTask, slug: m.primaryTask } }] : []
        });
      });

      companies.forEach((c: any) => {
        itemMap.set(`COMPANY-${c.id}`, { 
          ...c,
          valuation: c.valuation != null ? Number(c.valuation) : null,
          fundingRaised: c.fundingRaised != null ? Number(c.fundingRaised) : null,
          entityType: 'COMPANY',
          pricingModel: 'FREE',
          hasApi: false,
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
          releaseDate: r.githubCreatedAt ? r.githubCreatedAt.toISOString() : null,
          ttasks: r.language ? [{ task: { title: r.language, slug: r.language } }] : []
        });
      });

      // 3. REASSEMBLE Phase
      const hydratedItems = indexResults
        .map(idx => itemMap.get(`${idx.entityType}-${idx.id}`))
        .filter(Boolean);

      return { items: hydratedItems, page, pageSize, total, totalPages, hasNextPage: page < totalPages, timeframe };

    } catch (error) {
      console.error("Feed Database Error:", error);
      throw error;
    }
  }
}