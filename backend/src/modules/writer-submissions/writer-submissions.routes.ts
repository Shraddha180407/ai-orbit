import { Hono } from 'hono';
import { adminMiddleware } from '../../middleware/jwt.js';
import { WriterSubmissionsController } from './writer-submissions.controller.js';

export const writerSubmissionsRouter = new Hono();
const controller = new WriterSubmissionsController();

writerSubmissionsRouter.post('/', (c) => controller.create(c));
writerSubmissionsRouter.get('/', adminMiddleware, (c) => controller.list(c));
writerSubmissionsRouter.patch('/:id/status', adminMiddleware, (c) => controller.updateStatus(c));
