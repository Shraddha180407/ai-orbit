import { Hono } from 'hono';
import { getPrismaTx } from '../../lib/prisma.js';
import { createMCPRouter } from './controller/mcp.controller.js';
import { MCPService } from './service/mcp.service.js';

export type Variables = {
  mcpService: MCPService;
};

const router = new Hono<{ Variables: Variables }>();

router.use('*', async (c, next) => {
  // mcp.service.ts uses interactive $transaction(async (tx) => ...), which
  // the cached HTTP client (getPrisma) can't run — see lib/prisma.ts.
  const prisma = getPrismaTx(c.env);
  c.set('mcpService', new MCPService(prisma));
  await next();
});

router.route('/', createMCPRouter());

export { router as mcpRouter };