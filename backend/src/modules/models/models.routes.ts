import { Hono } from 'hono';
import { ModelsController } from './models.controller.js';

const router = new Hono();
const controller = new ModelsController();

router.get('/', (c) => controller.listModels(c));
router.get('/:id', (c) => controller.getModel(c));

export { router as modelsRouter };
