import { Hono } from 'hono';
import { RepositoriesController } from './repositories.controller.js';

const router = new Hono();
const controller = new RepositoriesController();

router.get('/', (c) => controller.listRepositories(c));
router.get('/:slug', (c) => controller.getRepositoryBySlug(c));

export { router as repositoriesRouter };
