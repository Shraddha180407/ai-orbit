import { Hono } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { createMCPRouter } from './controller/mcp.controller.js';
import { MCPService } from './service/mcp.service.js';

export type Variables = {
  mcpService: MCPService;
};

const router = new Hono<{ Variables: Variables }>();

router.use('*', async (c, next) => {
  const prisma = getPrisma(c.env);
  c.set('mcpService', new MCPService(prisma));
  await next();
});

router.route('/', createMCPRouter());

export { router as mcpRouter };