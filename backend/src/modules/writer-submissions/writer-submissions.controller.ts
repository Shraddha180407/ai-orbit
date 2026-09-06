import type { Context } from 'hono';
import { getPrisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/error.js';
import { getIp, rateLimit } from '../../lib/rate-limit.js';
import { writerSubmissionSchema, writerSubmissionStatusSchema } from './writer-submissions.schema.js';
import { WriterSubmissionsService } from './writer-submissions.service.js';

export class WriterSubmissionsController {
  private service(c: Context) {
    return new WriterSubmissionsService(getPrisma(c.env));
  }

  async create(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const limit = rateLimit(`writer-submission:${ip}`, 3, 60 * 60 * 1000);
    if (!limit.success) {
      return c.json({ error: `Too many submissions. Try again in ${limit.retryAfter} seconds.` }, 429);
    }

    const result = writerSubmissionSchema.safeParse(await c.req.json());
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    // A hidden field catches basic form bots without storing their payload.
    if (result.data.company) {
      return c.json({ success: true, message: 'Submission received.' }, 201);
    }

    const submission = await this.service(c).create(result.data);
    return c.json({
      success: true,
      message: 'Your article has been submitted for editorial review.',
      submission,
    }, 201);
  }

  async list(c: Context) {
    const status = c.req.query('status');
    return c.json({ submissions: await this.service(c).list(status) });
  }

  async updateStatus(c: Context) {
    const id = c.req.param('id');
    if (!id) {
      throw AppError.BadRequest('Submission id is required');
    }

    const result = writerSubmissionStatusSchema.safeParse(await c.req.json());
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    const submission = await this.service(c).updateStatus(id, result.data);
    return c.json({ success: true, submission });
  }
}
