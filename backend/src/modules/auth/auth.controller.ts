import { Context } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { sign } from 'jsonwebtoken';
import { AuthService } from './auth.service.js';
import { 
  signupSchema, 
  loginSchema, 
  verifyEmailSchema, 
  emailOnlySchema, 
  resetPasswordSchema 
} from './auth.schema.js';
import { rateLimit, getIp } from '../../lib/rate-limit.js';
import { getPrisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/error.js';

export class AuthController {
  
  private getService(c: Context) {
    return new AuthService(getPrisma(c.env), c.env);
  }

  async signup(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const { success, retryAfter } = rateLimit(`signup:${ip}`, 5, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    const body = await c.req.json();
    const result = signupSchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    await this.getService(c).signup(result.data);
    return c.json({ success: true, message: 'Verification email sent.' }, 201);
  }

  async login(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const { success, retryAfter } = rateLimit(`login:${ip}`, 10, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    const body = await c.req.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    const user = await this.getService(c).login(result.data);
    const jwtSecret = (c.env as Record<string, string | undefined>)?.JWT_SECRET || process.env.JWT_SECRET || 'aiorbit-jwt-secret-key-2026';

    const token = sign(
      { id: user.id, email: user.email, name: user.name, role: user.role }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );
    
    const isProd = c.req.url.startsWith('https://');
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return c.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  async logout(c: Context) {
    deleteCookie(c, 'auth_token', { 
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    return c.json({ success: true, message: 'Logged out successfully.' });
  }

  async getMe(c: Context) {
    const user = c.get('user');
    const dbUser = await this.getService(c).getMe(user.id);
    return c.json({ success: true, user: dbUser });
  }

  async verifyEmail(c: Context) {
    const body = await c.req.json();
    const result = verifyEmailSchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    const user = await this.getService(c).verifyEmail(result.data);
    const jwtSecret = (c.env as Record<string, string | undefined>)?.JWT_SECRET || process.env.JWT_SECRET || 'aiorbit-jwt-secret-key-2026';

    const token = sign(
      { id: user.id, email: user.email, name: user.name, role: user.role }, 
      jwtSecret, 
      { expiresIn: '7d' }
    );
    
    const isProd = c.req.url.startsWith('https://');
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return c.json({ success: true, message: 'Email verified successfully.' });
  }

  async resendVerification(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const { success, retryAfter } = rateLimit(`resend-verification:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    const body = await c.req.json();
    const result = emailOnlySchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    const response = await this.getService(c).resendVerification(result.data);
    return c.json({ success: true, message: response.message });
  }

  async forgotPassword(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const { success, retryAfter } = rateLimit(`forgot-password:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    const body = await c.req.json();
    const result = emailOnlySchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    const response = await this.getService(c).forgotPassword(result.data);
    return c.json({ success: true, message: response.message });
  }

  async resetPassword(c: Context) {
    const ip = getIp(c.req.raw) || 'unknown';
    const { success, retryAfter } = rateLimit(`reset-password:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    const body = await c.req.json();
    const result = resetPasswordSchema.safeParse(body);
    
    if (!result.success) {
      throw AppError.BadRequest(result.error.issues[0].message);
    }

    await this.getService(c).resetPassword(result.data);
    return c.json({ success: true, message: 'Password has been reset successfully.' });
  }

  async deleteAccount(c: Context) {
    const user = c.get('user');
    await this.getService(c).deleteAccount(user.id);

    const isProd = c.req.url.startsWith('https://');
    deleteCookie(c, 'auth_token', { 
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
    });

    return c.json({ success: true, message: 'Account deleted successfully' });
  }

  async getSettings(c: Context) {
    const user = c.get('user');
    const settings = await this.getService(c).getSettings(user.id);
    return c.json(settings);
  }

  async updatePassword(c: Context) {
    const user = c.get('user');
    const body = await c.req.json();
    
    if (!body.newPassword || body.newPassword.length < 6) {
      throw AppError.BadRequest('New password must be at least 6 characters long');
    }
    
    await this.getService(c).updatePassword(user.id, body);
    return c.json({ success: true, message: 'Password updated successfully' });
  }
}
