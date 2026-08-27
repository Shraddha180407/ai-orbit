import { Hono } from 'hono';
import { getFeed } from './feed.controller.js'; // Notice the .js extension!

const router = new Hono();

router.get('/', getFeed);

export default router;