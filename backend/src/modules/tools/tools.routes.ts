import { Hono } from 'hono';
import { ToolsController } from './tools.controller.js';
import { jwtMiddleware, optionalJwtMiddleware } from '../../middleware/jwt.js';

const router = new Hono();
const controller = new ToolsController();

router.get('/', (c) => controller.listTools(c));
router.get('/:slug', optionalJwtMiddleware, (c) => controller.getToolDetails(c));
router.post('/:slug/reviews', jwtMiddleware, (c) => controller.submitReview(c));
router.post('/:slug/bookmark', jwtMiddleware, (c) => controller.toggleBookmark(c));

export { router as toolsRouter };
