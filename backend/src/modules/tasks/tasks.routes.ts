import { Hono } from 'hono';
import { TasksController } from './tasks.controller.js';

const router = new Hono();
const controller = new TasksController();

router.get('/', (c) => controller.listTasks(c));
router.get('/:slug', (c) => controller.getTaskDetails(c));
router.post('/:slug/bookmark', (c) => controller.toggleBookmark(c));
router.post('/:slug/like', (c) => controller.toggleLike(c));
router.post('/:slug/subscribe', (c) => controller.toggleSubscribe(c));

export { router as tasksRouter };