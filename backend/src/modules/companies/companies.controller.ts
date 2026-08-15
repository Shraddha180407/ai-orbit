import { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { CompaniesService } from './companies.service.js';
import { CompanyType } from '@prisma/client';

export class CompaniesController {
  async listCompanies(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CompaniesService(prisma);
    const typeFilter = c.req.query('type');
    const validTypeFilter = typeFilter && typeFilter in CompanyType ? typeFilter as CompanyType : undefined;

    try {
      const companies = await service.listCompanies(validTypeFilter);
      return c.json(companies);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }

  async getCompanyDetails(c: Context) {
    const prisma = getPrisma(c.env);
    const service = new CompaniesService(prisma);
    const slug = c.req.param('slug') || '';

    try {
      const company = await service.getCompanyDetails(slug);
      if (!company) {
        return c.json({ error: 'Company not found' }, 404);
      }
      return c.json(company);
    } catch (error: unknown) {
      return c.json({ error: error instanceof Error ? error.message : 'Unknown error' }, 500);
    } finally {
      await prisma.$disconnect();
    }
  }
}
