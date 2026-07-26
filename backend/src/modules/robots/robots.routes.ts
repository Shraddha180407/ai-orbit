import { Hono } from 'hono';
import { RobotsController } from './robots.controller.js';

const router = new Hono();
const controller = new RobotsController();

router.get('/', (c) => controller.listRobots(c));
router.get('/:identifier', (c) => controller.getRobot(c)); 
router.post('/', (c) => controller.createRobot(c));
router.put('/:id', (c) => controller.updateRobot(c));
router.delete('/:id', (c) => controller.deleteRobot(c));

export { router as robotsRouter };