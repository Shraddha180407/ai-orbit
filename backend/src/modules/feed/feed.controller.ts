import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { FeedService } from './feed.service.js';

export const getFeed = async (c: Context) => {
  try {
    // 1. Initialize Prisma correctly using the Worker's environment context
    const prisma = getPrisma(c.env);
    
    // 2. Pass the configured client to our service
    const feedService = new FeedService(prisma);

    const page = parseInt(c.req.query('page') || '1');
    const pageSize = parseInt(c.req.query('pageSize') || '50');
    const show = c.req.query('show') || 'tools,devices,robots,news,models';
    const filters = show.split(',');

    const result = await feedService.getUnifiedFeed(filters, page, pageSize);
    return c.json(result);
  } catch (error: any) {
    console.error('Feed Error:', error);
    return c.json({
      error: 'Failed to fetch unified feed',
      details: error?.message || String(error),
      stack: error?.stack,
    }, 500);
  }
};