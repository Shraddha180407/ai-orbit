import { Hono } from 'hono';
import { BookmarksController } from './bookmarks.controller.js';
import { jwtMiddleware } from '../../middleware/jwt.js';

export const bookmarksRouter = new Hono();
const controller = new BookmarksController();

bookmarksRouter.use('*', jwtMiddleware);
bookmarksRouter.get('/', (c) => controller.listBookmarks(c));
bookmarksRouter.post('/', (c) => controller.createBookmark(c));
bookmarksRouter.delete('/:id', (c) => controller.deleteBookmark(c));
