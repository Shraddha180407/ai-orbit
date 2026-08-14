import { Hono } from 'hono'
import { logger } from './lib/logger.js'
import { cors } from 'hono/cors'
import { videosRouter } from './modules/videos/videos.routes.js'
import type { ScheduledController, ExecutionContext } from '@cloudflare/workers-types'
import newsRouter from './modules/news/news.routes.js'
import ingestionRouter from './modules/ingestion/ingestion.routes.js'
import logosRouter from './modules/ingestion/logos.routes.js'
import authRoutes from './modules/auth/auth.routes.js'
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes.js'
import { companiesRouter } from './modules/companies/companies.routes.js'
import { collectionsRouter } from './modules/collections/collections.routes.js'
import { devicesRouter } from './modules/devices/devices.routes.js'
import { tasksRouter } from './modules/tasks/tasks.routes.js'
import { modelsRouter } from './modules/models/models.routes.js'
import { repositoriesRouter } from './modules/repositories/repositories.routes.js'
import { robotsRouter } from './modules/robots/robots.routes.js'

import { homepageRouter } from './modules/homepage/homepage.routes.js'
import { toolsRouter } from './modules/tools/tools.routes.js'
import { userRouter } from './modules/user/user.routes.js'
import { mcpRouter } from './modules/mcp/mcp.routes.js'
import { getPrisma } from './lib/prisma.js'
import { runIngestion } from './modules/ingestion/ingestion.service.js'
import type { IngestionContext } from './modules/ingestion/pipeline.js'

type Bindings = {
  DATABASE_URL: string
  GEMINI_API_KEY: string
  GROQ_API_KEY: string
  CLOUDINARY_CLOUD_NAME: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
  INGESTION_TOKEN: string
  INGESTION_TOKEN_COLLECTIONS: string
  GITHUB_TOKEN: string
}

import { errorHandler } from './middleware/error.js'

const app = new Hono<{ Bindings: Bindings }>()

app.onError(errorHandler)
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
import { adminRouter } from './modules/admin/admin.routes.js'
import { bookmarksRouter } from './modules/bookmarks/bookmarks.routes.js'

app.route('/api/auth', authRoutes)
app.route('/api/v1/leaderboard', leaderboardRouter)
app.route('/api/v1/companies', companiesRouter)
app.route('/api/v1/collections', collectionsRouter)
app.route('/api/v1/devices', devicesRouter)
app.route('/api/v1/models', modelsRouter)
app.route('/api/v1/repositories', repositoriesRouter)
app.route('/api/v1/robots', robotsRouter)
app.route('/api/admin', adminRouter)
app.route('/api/v1/tasks', tasksRouter)
app.route('/api/v1/homepage', homepageRouter)
app.route('/api/v1/tools', toolsRouter)
app.route('/api/user', userRouter)
app.route('/api/bookmarks', bookmarksRouter)
app.route('/api/v1/mcps', mcpRouter)

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

// 1. Health check endpoint
app.get('/health', async (c) => {
  try {
    const prisma = getPrisma(c.env)
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() })
  } catch (error) {
    logger.error('Database connection failed:', error)
    return c.json({ status: 'error', db: 'disconnected', timestamp: new Date().toISOString() }, 500)
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
    const prisma = getPrisma(env)
    const ingestionCtx: IngestionContext = {
      prisma,
      llmKeys: { geminiKey: env.GEMINI_API_KEY, groqKey: env.GROQ_API_KEY },
      cloudinary: { cloudName: env.CLOUDINARY_CLOUD_NAME, apiKey: env.CLOUDINARY_API_KEY, apiSecret: env.CLOUDINARY_API_SECRET },
    }

    ctx.waitUntil(
      runIngestion(ingestionCtx)
        .then((summary) => {
          logger.info(`[cron] ingestion complete: created=${summary.totalCreated} pruned=${summary.pruned}`)
        })
        .catch((err) => {
          logger.error('[cron] ingestion failed:', err)
        })
    )
  },
}
