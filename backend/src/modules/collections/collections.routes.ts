import { Hono } from 'hono';
import { CollectionsController } from './collections.controller.js';

const router = new Hono();
const controller = new CollectionsController();

router.get('/', (c) => controller.listCollections(c));
router.get('/:slug', (c) => controller.getCollectionDetails(c));

export { router as collectionsRouter };
