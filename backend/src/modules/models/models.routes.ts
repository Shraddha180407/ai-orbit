import { Hono } from 'hono';
import { ModelsController } from './models.controller.js';

const router = new Hono();
const controller = new ModelsController();

router.get('/filters', (c) => controller.getFilterOptions(c));
router.get('/compare', (c) => controller.compareModels(c));
router.get('/', (c) => controller.listModels(c));
router.get('/:id', (c) => controller.getModel(c));

export { router as modelsRouter };
