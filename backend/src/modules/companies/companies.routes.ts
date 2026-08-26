import { Hono } from 'hono';
import { CompaniesController } from './companies.controller.js';

const router = new Hono();
const controller = new CompaniesController();

router.get('/', (c) => controller.getCompanies(c));
router.get('/:slug', (c) => controller.getCompanyDetails(c));

export { router as companiesRouter };
