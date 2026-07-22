import { Hono } from 'hono';
import { TasksController } from './tasks.controller.js';
import { jwtMiddleware } from '../../middleware/jwt.js';

const router = new Hono();
const controller = new TasksController();

// Public — works for both logged-in and anonymous users
router.get('/', (c) => controller.listTasks(c));

router.get('/:slug', (c) => controller.getTaskDetails(c));
router.post('/:slug/bookmark', jwtMiddleware, (c) => controller.toggleBookmark(c));
router.post('/:slug/like', jwtMiddleware, (c) => controller.toggleLike(c));
router.post('/:slug/subscribe', jwtMiddleware, (c) => controller.toggleSubscribe(c));

export { router as tasksRouter };