import { Hono } from 'hono';
import { DevicesController } from './devices.controller.js';

const router = new Hono();
const controller = new DevicesController();

router.get('/subcategories', (c) => controller.listDeviceSubCategories(c));
router.get('/', (c) => controller.listDevices(c));
router.get('/slug/:slug', (c) => controller.getDeviceBySlug(c));

// Main route: handles both IDs and category/device slugs without crashing on 500
router.get('/:id', (c) => controller.getDeviceBySlug(c));

export { router as devicesRouter };