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

export class AuthController {
  
  private getService(c: Context) {
    return new AuthService(getPrisma(c.env), c.env);
  }

  async signup(c: Context) {
    const ip = getIp(c.req.raw as any) || 'unknown';
    const { success, retryAfter } = rateLimit(`signup:${ip}`, 5, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    try {
      const body = await c.req.json();
      const result = signupSchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      await this.getService(c).signup(result.data);
      return c.json({ success: true, message: 'Verification email sent.' }, 201);
    } catch (error: any) {
      if (error.message === 'Email is already in use.') {
        return c.json({ error: error.message }, 409);
      }
      return c.json({ error: 'Failed to create account.' }, 500);
    }
  }

  async login(c: Context) {
    const ip = getIp(c.req.raw as any) || 'unknown';
    const { success, retryAfter } = rateLimit(`login:${ip}`, 10, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    try {
      const body = await c.req.json();
      const result = loginSchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      const user = await this.getService(c).login(result.data);
      const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;

      const token = sign(
        { id: user.id, email: user.email, name: user.name }, 
        jwtSecret!, 
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

      return c.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error: any) {
      if (error.message === 'Invalid email or password.') {
        return c.json({ error: error.message }, 401);
      }
      if (error.message === 'Please verify your email before logging in.') {
        return c.json({ error: error.message }, 403);
      }
      return c.json({ error: 'Failed to login.' }, 500);
    }
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
    try {
      const user = c.get('user');
      const dbUser = await this.getService(c).getMe(user.id);
      return c.json({ success: true, user: dbUser });
    } catch (error) {
      return c.json({ error: 'User not found' }, 404);
    }
  }

  async verifyEmail(c: Context) {
    try {
      const body = await c.req.json();
      const result = verifyEmailSchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      const user = await this.getService(c).verifyEmail(result.data);
      const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;

      const token = sign(
        { id: user.id, email: user.email, name: user.name }, 
        jwtSecret!, 
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
    } catch (error: any) {
      if (error.message?.includes('expired') || error.message?.includes('Invalid') || error.message?.includes('not found')) {
         return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'An unexpected error occurred during verification.' }, 500);
    }
  }

  async resendVerification(c: Context) {
    const ip = getIp(c.req.raw as any) || 'unknown';
    const { success, retryAfter } = rateLimit(`resend-verification:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    try {
      const body = await c.req.json();
      const result = emailOnlySchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      const response = await this.getService(c).resendVerification(result.data);
      return c.json({ success: true, message: response.message });
    } catch (error: any) {
      if (error.message === 'Email is already verified.') {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Failed to resend verification email.' }, 500);
    }
  }

  async forgotPassword(c: Context) {
    const ip = getIp(c.req.raw as any) || 'unknown';
    const { success, retryAfter } = rateLimit(`forgot-password:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    try {
      const body = await c.req.json();
      const result = emailOnlySchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      const response = await this.getService(c).forgotPassword(result.data);
      return c.json({ success: true, message: response.message });
    } catch (error) {
      return c.json({ error: 'Failed to send password reset email.' }, 500);
    }
  }

  async resetPassword(c: Context) {
    const ip = getIp(c.req.raw as any) || 'unknown';
    const { success, retryAfter } = rateLimit(`reset-password:${ip}`, 3, 60000);
    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429);
    }

    try {
      const body = await c.req.json();
      const result = resetPasswordSchema.safeParse(body);
      
      if (!result.success) {
        return c.json({ error: result.error.issues[0].message }, 400);
      }

      await this.getService(c).resetPassword(result.data);
      return c.json({ success: true, message: 'Password has been reset successfully.' });
    } catch (error: any) {
      if (error.message?.includes('Invalid') || error.message?.includes('expired')) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: 'Failed to reset password.' }, 500);
    }
  }

  async deleteAccount(c: Context) {
    try {
      const user = c.get('user');
      await this.getService(c).deleteAccount(user.id);

      const isProd = c.req.url.startsWith('https://');
      deleteCookie(c, 'auth_token', { 
        path: '/',
        secure: isProd,
        sameSite: isProd ? 'None' : 'Lax',
      });

      return c.json({ success: true, message: 'Account deleted successfully' });
    } catch (error: any) {
      console.error('Delete account error:', error);
      return c.json({ error: error.message || 'Failed to delete account' }, 500);
    }
  }

  async getSettings(c: Context) {
    try {
      const user = c.get('user');
      const settings = await this.getService(c).getSettings(user.id);
      return c.json(settings);
    } catch (error) {
      return c.json({ error: 'Failed to fetch settings' }, 500);
    }
  }

  async updatePassword(c: Context) {
    try {
      const user = c.get('user');
      const body = await c.req.json();
      
      if (!body.newPassword || body.newPassword.length < 6) {
        return c.json({ error: 'New password must be at least 6 characters long' }, 400);
      }
      
      await this.getService(c).updatePassword(user.id, body);
      return c.json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
      return c.json({ error: error.message || 'Failed to update password' }, 400);
    }
  }
}
