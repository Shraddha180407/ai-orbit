import { Context } from 'hono';
import { UserService } from './user.service.js';
import { AppError } from '../../lib/error.js';

export class UserController {
  constructor(private service: UserService) {}

  async getSavedTools(c: Context) {
    const savedTools = await this.service.getSavedTools(c.get('user').id);
    return c.json({ savedTools });
  }

  async removeSavedTool(c: Context) {
    const id = c.req.param('id');
    if (!id) throw AppError.BadRequest('id is required');
    
    const result = await this.service.removeSavedTool(id, c.get('user').id);
    return c.json(result);
  }

  async getHistory(c: Context) {
    const history = await this.service.getHistory(c.get('user').id);
    return c.json(history); // Frontend expects an array directly
  }

  async recordHistory(c: Context) {
    const body = await c.req.json();
    if (!body.toolId) {
      throw AppError.BadRequest('toolId is required');
    }
    
    const result = await this.service.recordHistory(body.toolId, c.get('user').id);
    return c.json(result);
  }
}
