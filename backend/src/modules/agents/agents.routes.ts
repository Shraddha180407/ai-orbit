import { Hono } from 'hono';
import { AgentsController } from './agents.controller.js';

const router = new Hono();
const controller = new AgentsController();

router.get('/categories', (c) => controller.listCategories(c));
router.get('/', (c) => controller.listAgents(c));
router.get('/:slug', (c) => controller.getAgentBySlug(c));

export { router as agentsRouter };
