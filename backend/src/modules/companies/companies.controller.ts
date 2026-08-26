import { Context } from 'hono';
import { CompaniesService } from './companies.service.js';
import { getPrisma } from '../../lib/prisma.js';

export class CompaniesController {
  async listCompanies(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CompaniesService(prisma);

    try {
      const companies = await service.listCompanies();
      return c.json(companies);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }

  async getCompanies(c: Context) {
    return this.listCompanies(c);
  }

  async getCompanyDetails(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CompaniesService(prisma);
    let rawSlug = c.req.param('slug') || '';

    try {
      let slug = decodeURIComponent(rawSlug).replace(/^!\[+/, '').replace(/[\]\(\)]/g, '').trim();
      if (!slug) {
        return c.json({ error: 'Company not found' }, 404);
      }
      const company = await service.getCompanyDetails(slug);
      if (!company) {
        return c.json({ error: 'Company not found' }, 404);
      }
      return c.json(company);
    } catch (error: unknown) {
      return c.json({ error: 'Company not found' }, 404);
    } finally {
      // getPrisma() returns a Worker-isolate-scoped singleton (see lib/prisma.ts) —
      // it must stay connected across requests, so it is intentionally not
      // disconnected here.
    }
  }
}