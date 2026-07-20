import { PrismaClient, Prisma } from '@prisma/client';

export class AdminService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAnalytics() {
    const [totalUsers, totalTools, activeUsers, totalNews] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tool.count(),
      this.prisma.user.count({ where: { status: 'ACTIVE' } }),
      this.prisma.news.count(),
    ]);

    // Calculate real time-series analytics starting from June 2026 onwards
    const now = new Date();
    const startYear = 2026;
    const startMonth = 5; // June (0-indexed)
    
    // Calculate difference in months between now and June 2026
    const totalMonthsDiff = (now.getFullYear() - startYear) * 12 + (now.getMonth() - startMonth);
    
    // Generate array from totalMonthsDiff down to 0
    const monthsDiffArray = Array.from(
      { length: Math.max(0, totalMonthsDiff + 1) }, 
      (_, i) => totalMonthsDiff - i
    );

    const growthTrend = await Promise.all(
      monthsDiffArray.map(async (i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        // Set to end of the month
        const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
        const count = await this.prisma.user.count({
          where: { createdAt: { lte: endOfMonth } }
        });
        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(d);
        return { name: monthName, users: count };
      })
    );

    return {
      totalUsers,
      totalTools,
      activeUsers,
      totalNews,
      growthTrend
    };
  }

  async getUsers(page: number, search: string) {
    const pageSize = 20;
    const where: Prisma.UserWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.user.count({ where })
    ]);

    return { users, total, page, totalPages: Math.ceil(total / pageSize) };
  }

  async updateUserRole(id: string, role: string) {
    await this.prisma.user.update({
      where: { id },
      data: { role }
    });
  }

  async updateUserStatus(id: string, status: string) {
    await this.prisma.user.update({
      where: { id },
      data: { status }
    });
  }

  async getReports(page: number, status: string) {
    const pageSize = 20;
    const where: Prisma.ReportWhereInput = status !== 'ALL' ? { status } : {};

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, name: true, email: true } },
          reportedUser: { select: { id: true, name: true, email: true } },
          reportedTool: { select: { id: true, name: true } },
          reportedNews: { select: { id: true, title: true } }
        }
      }),
      this.prisma.report.count({ where })
    ]);

    return { reports, total, page, totalPages: Math.ceil(total / pageSize) };
  }

  async updateReport(id: string, status: string) {
    await this.prisma.report.update({
      where: { id },
      data: { status }
    });
  }

  async getCollections() {
    const collections = await this.prisma.collection.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tools: true }
        }
      }
    });
    return { collections };
  }

  async createCollection(data: any) {
    const collection = await this.prisma.collection.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
      }
    });
    return collection;
  }

  async updateCollection(id: string, data: any) {
    const collection = await this.prisma.collection.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
      }
    });
    return collection;
  }

  async deleteCollection(id: string) {
    await this.prisma.collection.delete({ where: { id } });
  }

  async getTools(page: number, search: string) {
    const pageSize = 20;
    const where: Prisma.ToolWhereInput = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    } : {};

    const [tools, total] = await Promise.all([
      this.prisma.tool.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          company: { select: { name: true } }
        }
      }),
      this.prisma.tool.count({ where })
    ]);

    return { tools, total, page, totalPages: Math.ceil(total / pageSize) };
  }

  async deleteTool(id: string) {
    await this.prisma.tool.delete({ where: { id } });
  }

  async getNews(page: number, search: string) {
    const pageSize = 20;
    const where: Prisma.NewsWhereInput = search ? {
      title: { contains: search, mode: 'insensitive' }
    } : {};

    const [news, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          publisher: { select: { name: true } }
        }
      }),
      this.prisma.news.count({ where })
    ]);

    return { news, total, page, totalPages: Math.ceil(total / pageSize) };
  }

  async deleteNews(id: string) {
    await this.prisma.news.delete({ where: { id } });
  }

  async createTool(data: any) { return this.prisma.tool.create({ data }); }
  async updateTool(id: string, data: any) { return this.prisma.tool.update({ where: { id }, data }); }

  async getCompanies(page: number, search: string) {
    const pageSize = 20;
    const where: any = search ? { name: { contains: search, mode: 'insensitive' } } : {};
    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.company.count({ where })
    ]);
    return { companies, total, page, totalPages: Math.ceil(total / pageSize) };
  }
  async createCompany(data: any) { return this.prisma.company.create({ data }); }
  async updateCompany(id: string, data: any) { return this.prisma.company.update({ where: { id }, data }); }
  async deleteCompany(id: string) { await this.prisma.company.delete({ where: { id } }); }

  async getModels(page: number, search: string) {
    const pageSize = 20;
    const where: any = search ? { name: { contains: search, mode: 'insensitive' } } : {};
    const [models, total] = await Promise.all([
      this.prisma.aIModel.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.aIModel.count({ where })
    ]);
    return { models, total, page, totalPages: Math.ceil(total / pageSize) };
  }
  async createModel(data: any) {
    const { name, creator, contextWindow, parameterSize, modality, releaseDate, description } = data;
    return this.prisma.aIModel.create({ data: { name, creator, contextWindow, parameterSize, modality, releaseDate, description } });
  }
  async updateModel(id: string, data: any) {
    const { name, creator, contextWindow, parameterSize, modality, releaseDate, description } = data;
    const update: any = {};
    if (name !== undefined) update.name = name;
    if (creator !== undefined) update.creator = creator;
    if (contextWindow !== undefined) update.contextWindow = contextWindow;
    if (parameterSize !== undefined) update.parameterSize = parameterSize;
    if (modality !== undefined) update.modality = modality;
    if (releaseDate !== undefined) update.releaseDate = releaseDate;
    if (description !== undefined) update.description = description;
    return this.prisma.aIModel.update({ where: { id }, data: update });
  }
  async deleteModel(id: string) { await this.prisma.aIModel.delete({ where: { id } }); }

  async getVideos(page: number, search: string) {
    const pageSize = 20;
    const where: any = search ? { title: { contains: search, mode: 'insensitive' } } : {};
    const [videos, total] = await Promise.all([
      this.prisma.video.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: 'desc' } }),
      this.prisma.video.count({ where })
    ]);
    return { videos, total, page, totalPages: Math.ceil(total / pageSize) };
  }
  async createVideo(data: any) { return this.prisma.video.create({ data }); }
  async updateVideo(id: string, data: any) { return this.prisma.video.update({ where: { id }, data }); }
  async deleteVideo(id: string) { await this.prisma.video.delete({ where: { id } }); }

  async createNews(data: any) { return this.prisma.news.create({ data }); }
  async updateNews(id: string, data: any) { return this.prisma.news.update({ where: { id }, data }); }
}
