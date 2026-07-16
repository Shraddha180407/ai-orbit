import { getCookie } from 'hono/cookie';
import { verify } from 'jsonwebtoken';
export const jwtMiddleware = async (c, next) => {
    const token = getCookie(c, 'auth_token');
    if (!token) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    try {
        const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;
        const decoded = verify(token, jwtSecret);
        c.set('user', decoded);
        await next();
    }
    catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
};
