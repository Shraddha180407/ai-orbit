import { Hono } from 'hono';
import { ModelsController } from './models.controller.js';
import { getPrisma } from '../../lib/prisma.js';

const router = new Hono();
const controller = new ModelsController();

router.get('/subcategories', async (c) => {
  const prisma = getPrisma(c.env);

  try {
    const subCategories = await prisma.modelSubCategory.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true, description: true },
    });
    return c.json(subCategories);
  } catch (error: unknown) {
    return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

router.get('/', (c) => controller.listModels(c));
router.get('/:id', (c) => controller.getModel(c));

export { router as modelsRouter };
