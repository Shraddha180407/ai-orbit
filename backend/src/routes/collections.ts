import { Hono } from 'hono'
import { Prisma, PrismaClient } from '@prisma/client'
import { getPrisma, getOrCreateDemoUser } from '../lib/prisma.js'

const app = new Hono()

const PAGE_SIZE = 20

// a) GET /collections
app.get('/', async (c) => {
  const prisma = getPrisma(c.env)

  const search = c.req.query('search') || ''
  const categoryStr = c.req.query('category')
  const creatorType = c.req.query('creatorType')
  const hasRelatedModels = c.req.query('hasRelatedModels') === 'true'
  const hasRelatedCompanies = c.req.query('hasRelatedCompanies') === 'true'
  const featured = c.req.query('featured') === 'true'
  const updatedWithin = c.req.query('updatedWithin') // e.g. "7d", "30d"
  const sort = c.req.query('sort') || 'recently_updated'
  const cursor = c.req.query('cursor')

  try {
    const where: Prisma.CollectionWhereInput = {}

    if (search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
        { creator: { name: { contains: search.trim(), mode: 'insensitive' } } },
        { tools: { some: { tool: { name: { contains: search.trim(), mode: 'insensitive' } } } } }
      ]
    }

    if (categoryStr) {
      const categories = c.req.queries('category') || [categoryStr]
      where.categories = { some: { categoryName: { in: categories } } }
    }

    if (creatorType && (creatorType === 'EDITORIAL' || creatorType === 'COMMUNITY')) {
      where.creatorType = creatorType as 'EDITORIAL' | 'COMMUNITY'
    }

    if (hasRelatedModels) {
      where.relatedModels = { some: {} }
    }

    if (hasRelatedCompanies) {
      where.relatedCompanies = { some: {} }
    }

    if (featured) {
      where.isFeatured = true
    }

    if (updatedWithin) {
      const days = parseInt(updatedWithin.replace('d', ''), 10)
      if (!isNaN(days)) {
        where.updatedAt = { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
      }
    }

    let orderBy: Prisma.CollectionOrderByWithRelationInput | Prisma.CollectionOrderByWithRelationInput[] = { updatedAt: 'desc' }
    switch (sort) {
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
      case 'most_tools': orderBy = { toolCount: 'desc' }; break;
      case 'fewest_tools': orderBy = { toolCount: 'asc' }; break;
      case 'oldest_updated': orderBy = { updatedAt: 'asc' }; break;
      case 'most_bookmarked': orderBy = { bookmarks: { _count: 'desc' } }; break;
      case 'most_related_models': orderBy = { relatedModels: { _count: 'desc' } }; break;
      case 'most_related_companies': orderBy = { relatedCompanies: { _count: 'desc' } }; break;
      case 'featured_first': orderBy = [{ isFeatured: 'desc' }, { updatedAt: 'desc' }]; break;
      case 'recently_updated':
      default:
        orderBy = { updatedAt: 'desc' }; break;
    }

    const findManyArgs: Prisma.CollectionFindManyArgs = {
      where,
      orderBy,
      take: PAGE_SIZE + 1,
      include: {
        creator: { select: { id: true, name: true, image: true } },
        categories: { take: 3, select: { categoryName: true } },
        _count: { select: { relatedModels: true, relatedCompanies: true } }
      }
    }

    if (cursor) {
      findManyArgs.cursor = { id: cursor }
      findManyArgs.skip = 1
    }

    const items = await prisma.collection.findMany(findManyArgs)

    let nextCursor = null
    if (items.length > PAGE_SIZE) {
      items.pop() // remove the extra item
      nextCursor = items[items.length - 1]?.id
    }

    return c.json({ items, nextCursor })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// b) GET /collections/:slug
app.get('/:slug', async (c) => {
  const prisma = getPrisma(c.env)
  const slug = c.req.param('slug')
  const toolCursor = c.req.query('toolCursor')

  try {
    const collection = await prisma.collection.findUnique({
      where: { slug },
      include: {
        creator: { select: { id: true, name: true, image: true } },
        categories: { select: { categoryName: true } },
        tools: {
          take: PAGE_SIZE + 1,
          ...(toolCursor ? { cursor: { id: toolCursor }, skip: 1 } : {}),
          orderBy: { addedAt: 'desc' },
          include: { tool: true }
        },
        relatedModels: { take: 3, include: { model: true } },
        relatedCompanies: { take: 3, include: { company: true } },
        _count: { select: { relatedModels: true, relatedCompanies: true } }
      }
    })

    if (!collection) {
      return c.json({ error: 'Collection not found' }, 404)
    }

    let nextToolCursor = null
    if (collection.tools.length > PAGE_SIZE) {
      collection.tools.pop()
      nextToolCursor = collection.tools[collection.tools.length - 1]?.id
    }

    // Process BigInt/Decimal mapping for embedded Tools
    const processedCollection = {
      ...collection,
      tools: collection.tools.map((t: any) => ({
        ...t,
        tool: {
          ...t.tool,
          pricingAmount: t.tool.pricingAmount?.toString() ?? null,
          avgRating: t.tool.avgRating > 0 ? t.tool.avgRating : null,
        }
      }))
    }

    return c.json({ collection: processedCollection, nextToolCursor })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// c) POST /collections/:id/bookmark
app.post('/:id/bookmark', async (c) => {
  const prisma = getPrisma(c.env)
  const collectionId = c.req.param('id')

  try {
    // TODO: auth middleware should set c.var.userId. For now, we fallback to the demo user.
    // const userId = c.get('userId');
    const demoUser = await getOrCreateDemoUser(prisma)
    const userId = demoUser.id

    const existing = await prisma.collectionBookmark.findUnique({
      where: { userId_collectionId: { userId, collectionId } }
    })

    if (existing) {
      return c.json({ bookmarked: true })
    }

    await prisma.collectionBookmark.create({
      data: { userId, collectionId }
    })

    return c.json({ bookmarked: true })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// d) DELETE /collections/:id/bookmark
app.delete('/:id/bookmark', async (c) => {
  const prisma = getPrisma(c.env)
  const collectionId = c.req.param('id')

  try {
    // TODO: auth middleware should set c.var.userId. For now, we fallback to the demo user.
    // const userId = c.get('userId');
    const demoUser = await getOrCreateDemoUser(prisma)
    const userId = demoUser.id

    const existing = await prisma.collectionBookmark.findUnique({
      where: { userId_collectionId: { userId, collectionId } }
    })

    if (existing) {
      await prisma.collectionBookmark.delete({
        where: { id: existing.id }
      })
    }

    return c.json({ bookmarked: false })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

export async function recalculateCollectionToolCount(prisma: PrismaClient, collectionId: string) {
  const toolCount = await prisma.collectionTool.count({
    where: { collectionId },
  })

  await prisma.collection.update({
    where: { id: collectionId },
    data: { toolCount },
  })

  return toolCount
}

export default app
