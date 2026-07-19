import { Hono } from 'hono';
import { SearchController } from './search.controller.js';

const router = new Hono();
const controller = new SearchController();

router.get('/autocomplete', (c) => controller.autocomplete(c));
router.get('/popular', (c) => controller.popular(c));

export { router as searchRouter };
