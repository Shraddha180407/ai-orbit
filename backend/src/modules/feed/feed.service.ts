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

    // 1. INDEX PHASE: Safely push queries based on exactly what tables exist in schema.prisma
    if (filters.includes('tools')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'TOOL' as "entityType", (SELECT COUNT(*) FROM "TaskTool" WHERE "toolId" = "Tool".id) as task_count FROM "Tool"`);
    }
    if (filters.includes('devices')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'DEVICE' as "entityType", 0 as task_count FROM "Device"`);
    }
    if (filters.includes('robots')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'ROBOT' as "entityType", 0 as task_count FROM "Robot"`);
    }
    if (filters.includes('news')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'NEWS' as "entityType", 0 as task_count FROM "News"`);
    }
    if (filters.includes('models')) {
      queries.push(Prisma.sql`SELECT id, "createdAt", 'MODEL' as "entityType", 0 as task_count FROM "AIModel"`);
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
    const finalQuery = Prisma.sql`
      WITH UnifiedFeed AS (${unionQuery})
      SELECT id, "entityType", "createdAt" FROM UnifiedFeed
      ORDER BY task_count DESC, "createdAt" DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    try {
      const indexResults = await this.prisma.$queryRaw<{id: string, entityType: string, createdAt: Date}[]>(finalQuery);

      if (!indexResults || indexResults.length === 0) {
        return { items: [], page, hasNextPage: false };
      }

      // Group IDs by their type
      const toolIds = indexResults.filter(i => i.entityType === 'TOOL').map(i => i.id);
      const deviceIds = indexResults.filter(i => i.entityType === 'DEVICE').map(i => i.id);
      const robotIds = indexResults.filter(i => i.entityType === 'ROBOT').map(i => i.id);
      const newsIds = indexResults.filter(i => i.entityType === 'NEWS').map(i => i.id);
      const modelIds = indexResults.filter(i => i.entityType === 'MODEL').map(i => i.id);
      const companyIds = indexResults.filter(i => i.entityType === 'COMPANY').map(i => i.id);
      const videoIds = indexResults.filter(i => i.entityType === 'VIDEO').map(i => i.id);
      const repoIds = indexResults.filter(i => i.entityType === 'REPOSITORY').map(i => i.id);

      // 2. HYDRATION PHASE: Fetch all entities WITH THEIR RELATIONSHIPS so logos and tasks load!
      const [tools, devices, robots, news, models, companies, videos, repos] = await Promise.all([
        toolIds.length > 0 ? this.prisma.tool.findMany({ 
          where: { id: { in: toolIds } },
          include: { ttasks: { include: { task: true } }, categories: true }
        }).catch(() => this.prisma.tool.findMany({ where: { id: { in: toolIds } } })) : Promise.resolve([]),
        
        deviceIds.length > 0 ? this.prisma.device.findMany({ 
          where: { id: { in: deviceIds } },
          include: { tasks: { include: { task: true } } }
        }) : Promise.resolve([]),
        
        robotIds.length > 0 ? this.prisma.robot.findMany({ 
          where: { id: { in: robotIds } },
          include: { tasks: { include: { task: true } } }
        }) : Promise.resolve([]),
        
        newsIds.length > 0 ? (this.prisma as any).news.findMany({ 
          where: { id: { in: newsIds } },
          include: { publisher: true } // Fetches the publisher logo
        }) : Promise.resolve([]),
        
        modelIds.length > 0 ? (this.prisma as any).aIModel.findMany({ 
          where: { id: { in: modelIds } },
          include: { provider: true, tasks: { include: { task: true } } } // Fetches the Company logo
        }) : Promise.resolve([]),
        
        companyIds.length > 0 ? this.prisma.company.findMany({ 
          where: { id: { in: companyIds } } 
        }) : Promise.resolve([]),
        
        videoIds.length > 0 ? (this.prisma as any).video.findMany({ 
          where: { id: { in: videoIds } } 
        }) : Promise.resolve([]),
        
        repoIds.length > 0 ? this.prisma.repository.findMany({ 
          where: { id: { in: repoIds } } 
        }) : Promise.resolve([])
      ]);

      // Create a lookup map and morph ALL entities to match exactly what the frontend ToolCard expects
      const itemMap = new Map<string, any>();
      
      tools.forEach(t => itemMap.set(`TOOL-${t.id}`, { ...t, entityType: 'TOOL' }));
      
      devices.forEach((d: any) => itemMap.set(`DEVICE-${d.id}`, { 
        ...d, 
        entityType: 'DEVICE', 
        logoUrl: d.imageUrl || d.manufacturerLogoUrl, 
        releaseDate: d.releaseDate || d.createdAt,
        pricingModel: d.price ? 'PAID' : 'FREE',
        hasApi: false,
        ttasks: d.tasks && d.tasks.length > 0 ? d.tasks : (d.mainTask ? [{ task: { title: d.mainTask, slug: d.mainTask } }] : [])
      }));
      
      robots.forEach((r: any) => {
        // Format the ALL_CAPS enum (e.g., 'MANIPULATOR') into Title Case ('Manipulator')
        const shortCategory = r.category 
          ? r.category.charAt(0).toUpperCase() + r.category.slice(1).toLowerCase() 
          : 'Robotics';

        itemMap.set(`ROBOT-${r.id}`, { 
          ...r, 
          entityType: 'ROBOT', 
          logoUrl: r.logoUrl || r.thumbnailUrl,
          releaseDate: r.releaseDate || r.createdAt,
          pricingModel: r.price ? 'PAID' : 'FREE',
          hasApi: false,
          // Use the short category instead of the long mainTask!
          ttasks: r.tasks && r.tasks.length > 0 ? r.tasks : [{ task: { title: shortCategory, slug: shortCategory } }]
        });
      });
      
      news.forEach((n: any) => itemMap.set(`NEWS-${n.id}`, { 
        ...n, 
        entityType: 'NEWS', 
        name: n.title, 
        description: n.dek || n.aiSummary, 
        logoUrl: n.publisher?.logoUrl || n.publisher?.faviconUrl || n.imageUrl, 
        releaseDate: n.publishedAt || n.createdAt,
        pricingModel: 'FREE',
        hasApi: false,
        ttasks: n.category ? [{ task: { title: n.category, slug: n.category } }] : []
      }));
      
      models.forEach((m: any) => itemMap.set(`MODEL-${m.id}`, { 
        ...m, 
        entityType: 'MODEL', 
        logoUrl: m.provider?.logoUrl || m.logoUrl, // Fetches logo from the provider relation!
        description: m.description,
        releaseDate: m.releaseDate || m.createdAt,
        pricingModel: m.openSource ? 'FREE' : 'FREEMIUM',
        hasApi: m.apiAvailable,
        isOpenSource: m.openSource,
        // We artificially map the model's primary task so the 'TASK' UI column isn't blank
        ttasks: m.tasks && m.tasks.length > 0 ? m.tasks : (m.primaryTask ? [{ task: { title: m.primaryTask, slug: m.primaryTask } }] : [])
      }));

      companies.forEach((c: any) => itemMap.set(`COMPANY-${c.id}`, { 
        ...c, 
        entityType: 'COMPANY',
        pricingModel: 'FREE',
        releaseDate: c.foundedYear ? new Date(`${c.foundedYear}-01-01`) : c.createdAt,
        hasApi: false,
        ttasks: c.sector ? [{ task: { title: c.sector, slug: c.sector } }] : []
      }));

      videos.forEach((v: any) => itemMap.set(`VIDEO-${v.id}`, { 
        ...v, 
        entityType: 'VIDEO', 
        name: v.title, 
        logoUrl: v.thumbnail || v.authorAvatar,
        releaseDate: v.publishedAt || v.createdAt,
        pricingModel: 'FREE',
        hasApi: false,
        ttasks: v.toolCategory ? [{ task: { title: v.toolCategory, slug: v.toolCategory } }] : []
      }));

      repos.forEach((r: any) => itemMap.set(`REPOSITORY-${r.id}`, { 
        ...r, 
        entityType: 'REPOSITORY', 
        logoUrl: r.logoUrl || r.ownerAvatarUrl,
        description: r.description,
        releaseDate: r.githubCreatedAt || r.createdAt,
        pricingModel: 'FREE',
        hasApi: true,
        isOpenSource: true,
        ttasks: r.language ? [{ task: { title: r.language, slug: r.language } }] : []
      }));

      // 3. REASSEMBLE Phase: Stitch everything back into the exact sorted order
      const hydratedItems = indexResults
        .map(idx => itemMap.get(`${idx.entityType}-${idx.id}`))
        .filter(Boolean); // Filter out any missing records

      return { items: hydratedItems, page, hasNextPage: indexResults.length === pageSize };

    } catch (error) {
      console.error("Feed Database Error:", error);
      throw error;
    }
  }
}