import { Context } from 'hono';
import { AdminService } from './admin.service.js';
import { getPrisma } from '../../lib/prisma.js';

export class AdminController {
  private getService(c: Context) {
    return new AdminService(getPrisma(c.env));
  }

  async getAnalytics(c: Context) {
    try {
      const data = await this.getService(c).getAnalytics();
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async getUsers(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getUsers(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async inviteAdmin(c: Context) {
    try {
      const { email } = await c.req.json();
      if (!email) return c.json({ error: 'Email is required' }, 400);
      
      const prisma = getPrisma(c.env);
      const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: 'ADMIN' }
        });
      } else {
        await prisma.user.create({
          data: {
            email: email.toLowerCase(),
            role: 'ADMIN',
            name: 'New Admin',
          }
        });
      }
      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async updateUserRole(c: Context) {
    try {
      const id = c.req.param('id')!;
      const { role } = await c.req.json();
      const currentUser = c.get('user');

      if (!['ADMIN', 'USER'].includes(role)) {
        return c.json({ error: 'Invalid role' }, 400);
      }
      if (currentUser && currentUser.id === id && role !== 'ADMIN') {
        return c.json({ error: 'Cannot revoke your own admin role' }, 403);
      }

      await this.getService(c).updateUserRole(id, role);
      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async updateUserStatus(c: Context) {
    try {
      const id = c.req.param('id')!;
      const { status } = await c.req.json();
      const currentUser = c.get('user');

      if (!['ACTIVE', 'BLOCKED'].includes(status)) {
        return c.json({ error: 'Invalid status' }, 400);
      }
      if (currentUser && currentUser.id === id && status === 'BLOCKED') {
        return c.json({ error: 'Cannot block your own account' }, 403);
      }

      await this.getService(c).updateUserStatus(id, status);
      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async getReports(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const status = c.req.query('status') || 'ALL';
      const data = await this.getService(c).getReports(page, status);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async updateReport(c: Context) {
    try {
      const id = c.req.param('id')!;
      const { status } = await c.req.json();
      await this.getService(c).updateReport(id, status);
      return c.json({ success: true });
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async getCollections(c: Context) {
    try {
      const data = await this.getService(c).getCollections();
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async createCollection(c: Context) {
    try {
      const body = await c.req.json();
      const user = c.get('user');
      const data = await this.getService(c).createCollection(body, user.id);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async updateCollection(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateCollection(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async deleteCollection(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteCollection(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getTools(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getTools(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async createTool(c: Context) {
    try {
      const body = await c.req.json();
      const data = await this.getService(c).createTool(body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async updateTool(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateTool(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async deleteTool(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteTool(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getNews(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getNews(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }

  async deleteNews(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteNews(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getCompanies(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getCompanies(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async createCompany(c: Context) {
    try {
      const body = await c.req.json();
      const data = await this.getService(c).createCompany(body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async updateCompany(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateCompany(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async deleteCompany(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteCompany(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getModels(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getModels(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async createModel(c: Context) {
    try {
      const body = await c.req.json();
      const data = await this.getService(c).createModel(body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async updateModel(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateModel(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async deleteModel(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteModel(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async getVideos(c: Context) {
    try {
      const page = Number(c.req.query('page') || 1);
      const search = c.req.query('q') || '';
      const data = await this.getService(c).getVideos(page, search);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async createVideo(c: Context) {
    try {
      const body = await c.req.json();
      const data = await this.getService(c).createVideo(body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async updateVideo(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateVideo(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async deleteVideo(c: Context) {
    try {
      const id = c.req.param('id')!;
      await this.getService(c).deleteVideo(id);
      return c.json({ success: true });
    } catch (error: any) {
      if (error.code === 'P2003') {
        return c.json({ error: 'Cannot delete this record because it is currently in use or referenced by other items.' }, 409);
      }
      return c.json({ error: error.message }, 500);
    }
  }

  async createNews(c: Context) {
    try {
      const body = await c.req.json();
      const data = await this.getService(c).createNews(body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
  async updateNews(c: Context) {
    try {
      const id = c.req.param('id')!;
      const body = await c.req.json();
      const data = await this.getService(c).updateNews(id, body);
      return c.json(data);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
}
