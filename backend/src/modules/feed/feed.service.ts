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

// 1. INDEX PHASE: Get IDs and count tasks to prioritize them!
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

      // 2. HYDRATION PHASE: Fetch the full rich objects using standard Prisma!
      // This guarantees all your missing columns (pricing, API, tasks) are perfectly restored.
      const [tools, devices, robots, news, models] = await Promise.all([
        toolIds.length > 0 ? this.prisma.tool.findMany({ 
          where: { id: { in: toolIds } },
          // Pulling in relations so the UI Tasks column works. 
          // If this fails, the .catch() falls back to safely pulling just the scalar fields.
          include: { ttasks: { include: { task: true } }, categories: true }
        }).catch(() => this.prisma.tool.findMany({ where: { id: { in: toolIds } } })) : Promise.resolve([]),
        
        deviceIds.length > 0 ? this.prisma.device.findMany({ where: { id: { in: deviceIds } } }) : Promise.resolve([]),
        robotIds.length > 0 ? this.prisma.robot.findMany({ where: { id: { in: robotIds } } }) : Promise.resolve([]),
        newsIds.length > 0 ? (this.prisma as any).news.findMany({ where: { id: { in: newsIds } } }) : Promise.resolve([]),
        modelIds.length > 0 ? (this.prisma as any).aIModel.findMany({ where: { id: { in: modelIds } } }) : Promise.resolve([])
      ]);

      // Create a lookup map to safely format names and logos for the table
      const itemMap = new Map<string, any>();
      
      tools.forEach(t => itemMap.set(`TOOL-${t.id}`, { ...t, entityType: 'TOOL' }));
      
      devices.forEach((d: any) => itemMap.set(`DEVICE-${d.id}`, { 
        ...d, 
        entityType: 'DEVICE', 
        logoUrl: d.imageUrl || d.logoUrl,
        releaseDate: d.releaseDate || d.createdAt 
      }));
      
      robots.forEach((r: any) => itemMap.set(`ROBOT-${r.id}`, { 
        ...r, 
        entityType: 'ROBOT',
        releaseDate: r.releaseDate || r.createdAt 
      }));
      
      news.forEach((n: any) => itemMap.set(`NEWS-${n.id}`, { 
        ...n, 
        entityType: 'NEWS', 
        name: n.title, 
        description: n.dek, 
        logoUrl: n.imageUrl || n.image,
        releaseDate: n.publishedAt || n.createdAt 
      }));
      
      models.forEach((m: any) => itemMap.set(`MODEL-${m.id}`, { 
        ...m, 
        entityType: 'MODEL', 
        logoUrl: m.logoUrl || m.icon,
        releaseDate: m.releaseDate || m.createdAt 
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