import { Context } from 'hono';
import { UserService } from './user.service.js';

export class UserController {
  constructor(private service: UserService) {}

  async getSavedTools(c: Context) {
    try {
      const savedTools = await this.service.getSavedTools(c.get('user').id);
      return c.json({ savedTools });
    } catch (error: unknown) {
      console.error('Failed to get saved tools:', error);
      return c.json({ error: 'Failed to fetch saved tools' }, 500);
    }
  }

  async removeSavedTool(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) return c.json({ error: 'id is required' }, 400);
      
      const result = await this.service.removeSavedTool(id, c.get('user').id);
      return c.json(result);
    } catch (error: unknown) {
      console.error('Failed to remove saved tool:', error);
      return c.json({ error: 'Failed to remove saved tool' }, 500);
    }
  }

  async getHistory(c: Context) {
    try {
      const history = await this.service.getHistory(c.get('user').id);
      return c.json(history); // Frontend expects an array directly
    } catch (error: unknown) {
      console.error('Failed to get history:', error);
      return c.json({ error: 'Failed to fetch history' }, 500);
    }
  }

  async recordHistory(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.toolId) {
        return c.json({ error: 'toolId is required' }, 400);
      }
      
      const result = await this.service.recordHistory(body.toolId, c.get('user').id);
      return c.json(result);
    } catch (error: unknown) {
      console.error('Failed to record history:', error);
      return c.json({ error: 'Failed to record history' }, 500);
    }
  }
}
