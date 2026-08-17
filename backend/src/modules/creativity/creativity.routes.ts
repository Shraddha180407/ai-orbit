import { Hono } from 'hono';
import { CreativityController } from './creativity.controller.js';

const router = new Hono();
const controller = new CreativityController();

router.get('/filters', (c) => controller.getFilterOptions(c));
router.get('/subcategories', (c) => controller.listCreativityCategories(c));
router.get('/', (c) => controller.listCreativityTools(c));
router.get('/:slug', (c) => controller.getCreativityTool(c));

export { router as creativityRouter };
