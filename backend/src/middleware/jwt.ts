import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'jsonwebtoken'
import { getPrisma } from '../lib/prisma.js'

export const jwtMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token')
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const jwtSecret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET;
    const decoded = verify(token, jwtSecret!);
    c.set('user', decoded);
    await next()
  } catch (_error) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}

export const adminMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token');
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const jwtSecret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET;
    const decodedUser = verify(token, jwtSecret!) as any;
    c.set('user', decodedUser);

    if (!decodedUser || !decodedUser.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const prisma = getPrisma(c.env);

    const dbUser = await prisma.user.findUnique({
      where: { id: decodedUser.id },
      select: { role: true, status: true }
    });

    if (!dbUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (dbUser.status === 'BLOCKED') {
      return c.json({ error: 'Your account has been blocked' }, 403);
    }

    if (dbUser.role !== 'ADMIN') {
      return c.json({ error: 'Forbidden: Admin access required' }, 403);
    }

    await next();
  } catch (_error) {
    return c.json({ error: 'Invalid token or admin verification failed' }, 401);
  }
}

export const optionalJwtMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token');
  
  if (token) {
    try {
      const jwtSecret = (c.env as any)?.JWT_SECRET || process.env.JWT_SECRET;
      const decoded = verify(token, jwtSecret!);
      c.set('user', decoded);
    } catch (_error) {
      // Ignore invalid token
    }
  }
  
  await next();
}
