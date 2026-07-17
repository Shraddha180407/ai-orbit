import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient, PricingModel, Prisma } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { videosRouter } from './modules/videos/videos.routes.js'
import type { ScheduledController, ExecutionContext } from '@cloudflare/workers-types'
import newsRouter from './modules/news/news.routes.js'
import ingestionRouter from './modules/ingestion/ingestion.routes.js'
import logosRouter from './modules/ingestion/logos.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes.js'
import { companiesRouter } from './modules/companies/companies.routes.js'
import { devicesRouter } from './modules/devices/devices.routes.js'
import { modelsRouter } from './modules/models/models.routes.js'
import { repositoriesRouter } from './modules/repositories/repositories.routes.js'
import { robotsRouter } from './modules/robots/robots.routes.js'
import { runIngestion } from './modules/ingestion/ingestion.service.js'
import type { IngestionContext } from './modules/ingestion/pipeline.js'

type Bindings = {
  DATABASE_URL: string
  GEMINI_API_KEY: string
  GROQ_API_KEY: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS middleware so the frontend Next.js can make HTTP calls
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return 'http://localhost:3000';
    // Allow local development, preview subdomains, and primary domains
    if (
      origin === 'https://aiorbit.club' ||
      origin.endsWith('.aiorbit.club') ||
      origin.endsWith('.pages.dev') ||
      origin.startsWith('http://localhost:')
    ) {
      return origin;
    }
    return 'https://aiorbit.club';
  },
  credentials: true,
}))
app.route('/api/videos', videosRouter)

app.route('/api/news', newsRouter)
app.route('/api/ingestion', ingestionRouter)
app.route('/logos/publishers', logosRouter)
app.route('/api/auth', authRoutes)
app.route('/api/v1/leaderboard', leaderboardRouter)
app.route('/api/v1/companies', companiesRouter)
app.route('/api/v1/devices', devicesRouter)
app.route('/api/v1/models', modelsRouter)
app.route('/api/v1/repositories', repositoriesRouter)
app.route('/api/v1/robots', robotsRouter)

app.get('/', (c) => {
  return c.json({
    message: "AI Orbit API is fully operational",
    endpoints: {
      health: "/health",
      homepage: "/api/v1/homepage",
      tools: "/api/v1/tools",
      news: "/api/news"
    }
  })
})

// Helper to get Prisma Client instance with Neon edge adapters
function getPrisma(c: any) {
  const adapter = new PrismaNeon({ connectionString: c.env.DATABASE_URL })
  return new PrismaClient({ adapter })
}

// Helper to get or create demo user
async function getOrCreateDemoUser(prisma: PrismaClient) {
  return prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: { email: "demo@example.com", name: "Demo User" },
  });
}

// 1. Health check endpoint
app.get('/health', async (c) => {
  try {
    const prisma = getPrisma(c)
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    console.error('Database connection failed:', error)
    return c.json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() }, 500)
  }
})

// 2. Homepage directory lists
app.get('/api/v1/homepage', async (c) => {
  const prisma = getPrisma(c)
  try {
    const [topCompanies, topModels, topRepos, topNews] = await Promise.all([
      prisma.company.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.aIModel.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.repository.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.news.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          publishedAt: true,
          publisher: { select: { name: true } },
        },
      }),
    ])

    return c.json({
      topCompanies,
      topModels,
      topRepos,
      topNews,
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Constants for paginated tools
const PAGE_SIZE = 12
const VALID_PRICING = new Set(Object.values(PricingModel))
const VALID_SORTS = new Set(["newest", "oldest", "name-asc", "name-desc", "rating"])

// 3. Paginated AI Tools list with filters
app.get('/api/v1/tools', async (c) => {
  const prisma = getPrisma(c)
  
  // Extract query filters
  const q = c.req.query('q') || ''
  const category = c.req.query('category')
  const pricing = c.req.query('pricing')
  const sort = c.req.query('sort') || 'newest'
  const pageParam = c.req.query('page')
  const pageNum = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1)

  try {
    // Build search and filter query where clause
    const where: Prisma.ToolWhereInput = {}

    if (q.trim().length > 0) {
      where.OR = [
        { name: { contains: q.trim(), mode: "insensitive" } },
        { description: { contains: q.trim(), mode: "insensitive" } },
      ]
    }

    if (category) {
      where.categories = { some: { category: { slug: category } } }
    }

    if (pricing && VALID_PRICING.has(pricing as PricingModel)) {
      where.pricingModel = pricing as PricingModel
    }

    // Build sorting parameters
    let orderBy: Prisma.ToolOrderByWithRelationInput = { createdAt: "desc" }
    if (VALID_SORTS.has(sort)) {
      switch (sort) {
        case "oldest":
          orderBy = { createdAt: "asc" }
          break
        case "name-asc":
          orderBy = { name: "asc" }
          break
        case "name-desc":
          orderBy = { name: "desc" }
          break
        case "rating":
          orderBy = { avgRating: "desc" }
          break
        case "newest":
        default:
          orderBy = { createdAt: "desc" }
          break
      }
    }

    const cardSelect = {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      description: true,
      pricingModel: true,
      pricingAmount: true,
      billingFrequency: true,
      avgRating: true,
      categories: { select: { category: { select: { slug: true, name: true } } } },
      tags: { select: { tag: { select: { slug: true, name: true } } } },
      _count: { select: { reviews: true, bookmarks: true } },
      company: { select: { slug: true, name: true } },
    }

    const [tools, total, categoriesList] = await Promise.all([
      prisma.tool.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: cardSelect,
      }),
      prisma.tool.count({ where }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: {
          slug: true,
          name: true,
          _count: { select: { tools: true } },
        },
      })
    ])

    return c.json({
      tools: tools.map((t: any) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      })),
      total,
      page: pageNum,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      sort,
      categories: categoriesList,
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// 4. Single tool detail view by slug
app.get('/api/v1/tools/:slug', async (c) => {
  const prisma = getPrisma(c)
  const slug = c.req.param('slug')

  try {
    const tool = await prisma.tool.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        websiteUrl: true,
        screenshots: true,
        features: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        reviewCount: true,
        createdAt: true,
        company: { select: { slug: true, name: true, logoUrl: true } },
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
      },
    })

    if (!tool) {
      return c.json({ error: 'Tool not found' }, 404)
    }

    // Fetch similar tools
    const withRelations = await prisma.tool.findUnique({
      where: { id: tool.id },
      select: {
        alternatives: { select: { id: true } },
        categories: { select: { categoryId: true } },
      },
    })

    let similarTools: any[] = []
    if (withRelations) {
      const alternativeIds = withRelations.alternatives.map((a: any) => a.id)
      const categoryIds = withRelations.categories.map((cat: any) => cat.categoryId)

      const cardSelect = {
        id: true,
        slug: true,
        name: true,
        logoUrl: true,
        description: true,
        pricingModel: true,
        pricingAmount: true,
        billingFrequency: true,
        avgRating: true,
        categories: { select: { category: { select: { slug: true, name: true } } } },
        tags: { select: { tag: { select: { slug: true, name: true } } } },
        _count: { select: { reviews: true, bookmarks: true } },
        company: { select: { slug: true, name: true } },
      }

      const curated = alternativeIds.length
        ? await prisma.tool.findMany({ where: { id: { in: alternativeIds } }, select: cardSelect })
        : []

      similarTools = curated

      if (similarTools.length < 4 && categoryIds.length > 0) {
        const excludeIds = [tool.id, ...similarTools.map((t: any) => t.id)]
        const fillers = await prisma.tool.findMany({
          where: {
            id: { notIn: excludeIds },
            categories: { some: { categoryId: { in: categoryIds } } },
          },
          orderBy: { avgRating: "desc" },
          take: 4 - similarTools.length,
          select: cardSelect,
        })
        similarTools = [...similarTools, ...fillers]
      }
    }

    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { toolId: tool.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    })

    // Check bookmarked state for demo user
    const demoUser = await getOrCreateDemoUser(prisma)
    const bookmark = await prisma.bookmark.findUnique({
      where: { toolId_userId: { toolId: tool.id, userId: demoUser.id } },
      select: { id: true },
    })

    return c.json({
      tool: {
        ...tool,
        pricingAmount: tool.pricingAmount?.toString() ?? null,
        avgRating: tool.avgRating > 0 ? tool.avgRating : null,
      },
      similarTools: similarTools.map((t: any) => ({
        ...t,
        pricingAmount: t.pricingAmount?.toString() ?? null,
        avgRating: t.avgRating > 0 ? t.avgRating : null,
      })),
      reviews: reviews.map((r: any) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      bookmarked: Boolean(bookmark),
    })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Helper to recalculate ratings in DB
async function recomputeToolRating(prisma: PrismaClient, toolId: string) {
  const reviews = await prisma.review.findMany({ where: { toolId }, select: { rating: true } })
  const count = reviews.length
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0
  await prisma.tool.update({ where: { id: toolId }, data: { avgRating: avg, reviewCount: count } })
}

// 5. Submit review endpoint
app.post('/api/v1/tools/:slug/reviews', async (c) => {
  const prisma = getPrisma(c)
  const slug = c.req.param('slug')
  
  try {
    const body = await c.req.json()
    const { toolId, rating, comment } = body

    if (!toolId || !rating || !comment) {
      return c.json({ error: 'Missing required parameters' }, 400)
    }

    const demoUser = await getOrCreateDemoUser(prisma)

    await prisma.review.upsert({
      where: { toolId_userId: { toolId, userId: demoUser.id } },
      update: { rating: Number(rating), comment },
      create: { toolId, userId: demoUser.id, rating: Number(rating), comment },
    })

    await recomputeToolRating(prisma, toolId)

    return c.json({ status: 'success', message: 'Thanks — your review is live.' })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// 6. Toggle bookmark endpoint
app.post('/api/v1/tools/:slug/bookmark', async (c) => {
  const prisma = getPrisma(c)
  
  try {
    const body = await c.req.json()
    const { toolId } = body

    if (!toolId) {
      return c.json({ error: 'Missing toolId' }, 400)
    }

    const demoUser = await getOrCreateDemoUser(prisma)

    const existing = await prisma.bookmark.findUnique({
      where: { toolId_userId: { toolId, userId: demoUser.id } },
      select: { id: true },
    })

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } })
    } else {
      await prisma.bookmark.create({ data: { toolId, userId: demoUser.id } })
    }

    return c.json({ bookmarked: !existing })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export default {
  fetch: app.fetch,

  // Real Cron Trigger entry point (see wrangler.toml's [triggers] — every
  // 12 hours). Wrapped in ctx.waitUntil() so the invocation stays alive for
  // the full run, up to Cloudflare's confirmed 15-minute wall-clock ceiling
  // per invocation (see ingestion.service.ts / pipeline.ts for how the
  // pipeline stays within that). Workers Free plan does not fire Cron
  // Triggers reliably in production — ingestion is run manually
  // (`npm run ingest`) for now; this handler is otherwise unused.
  async scheduled(_controller: ScheduledController, env: Bindings, ctx: ExecutionContext) {
    const adapter = new PrismaNeon({ connectionString: env.DATABASE_URL })
    const prisma = new PrismaClient({ adapter })
    const ingestionCtx: IngestionContext = {
      prisma,
      llmKeys: { geminiKey: env.GEMINI_API_KEY, groqKey: env.GROQ_API_KEY },
      cloudinary: { cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY, apiSecret: env.CLOUDINARY_API_SECRET },
    }

    ctx.waitUntil(
      runIngestion(ingestionCtx)
        .then((summary) => {
          console.log(`[cron] ingestion complete: created=${summary.totalCreated} pruned=${summary.pruned}`)
        })
        .catch((err) => {
          console.error('[cron] ingestion failed:', err)
        })
    )
  },
}
