import { Hono } from 'hono';
import { RobotsController } from './robots.controller.js';

const router = new Hono();
const controller = new RobotsController();

router.get('/', (c) => controller.listRobots(c));
router.get('/:idOrSlug', (c) => controller.getRobot(c));

export { router as robotsRouter };
