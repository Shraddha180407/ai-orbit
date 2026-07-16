import { Hono } from 'hono';
import { AuthController } from './auth.controller.js';
import { jwtMiddleware } from '../../middleware/jwt.js';
import { getPrisma } from '../../lib/prisma.js';
import { sign } from 'jsonwebtoken';
import { setCookie } from 'hono/cookie';
const authRoutes = new Hono();
const authController = new AuthController();
// Basic Auth Routes
authRoutes.post('/signup', (c) => authController.signup(c));
authRoutes.post('/login', (c) => authController.login(c));
authRoutes.post('/logout', (c) => authController.logout(c));
authRoutes.get('/me', jwtMiddleware, (c) => authController.getMe(c));
authRoutes.post('/verify-email', (c) => authController.verifyEmail(c));
authRoutes.post('/resend-verification', (c) => authController.resendVerification(c));
authRoutes.post('/forgot-password', (c) => authController.forgotPassword(c));
authRoutes.post('/reset-password', (c) => authController.resetPassword(c));
authRoutes.delete('/account', jwtMiddleware, (c) => authController.deleteAccount(c));
authRoutes.get('/settings', jwtMiddleware, (c) => authController.getSettings(c));
authRoutes.patch('/password', jwtMiddleware, (c) => authController.updatePassword(c));
// --- GOOGLE OAUTH ---
authRoutes.get('/google', (c) => {
    const clientId = c.env?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    if (!clientId)
        return c.json({ error: 'Google OAuth not configured' }, 500);
    const requestUrl = new URL(c.req.url);
    const backendUrl = requestUrl.origin;
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    const scope = 'email profile';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
    return c.redirect(authUrl);
});
authRoutes.get('/google/callback', async (c) => {
    const code = c.req.query('code');
    const error = c.req.query('error');
    const frontendUrl = c.env?.FRONTEND_URL || process.env.FRONTEND_URL || 'https://aiorbit.club';
    if (error || !code) {
        return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`);
    }
    const clientId = c.env?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = c.env?.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const requestUrl = new URL(c.req.url);
    const backendUrl = requestUrl.origin;
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });
        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            throw new Error(`Google token error: ${errText}`);
        }
        const tokenData = await tokenRes.json();
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        if (!userRes.ok)
            throw new Error('Failed to get user info');
        const userData = await userRes.json();
        const email = userData.email.toLowerCase();
        const prisma = getPrisma(c.env);
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: userData.name,
                    image: userData.picture,
                    emailVerified: new Date(),
                }
            });
        }
        const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;
        const jwtToken = sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });
        const isProd = c.req.url.startsWith('https://');
        setCookie(c, 'auth_token', jwtToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        return c.redirect(`${frontendUrl}/dashboard`);
    }
    catch (err) {
        return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed&details=${encodeURIComponent(err instanceof Error ? err.message : String(err))}`);
    }
});
// --- GITHUB OAUTH ---
authRoutes.get('/github', (c) => {
    const clientId = c.env?.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
    if (!clientId)
        return c.json({ error: 'Github OAuth not configured' }, 500);
    const requestUrl = new URL(c.req.url);
    const backendUrl = requestUrl.origin;
    const redirectUri = `${backendUrl}/api/auth/github/callback`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;
    return c.redirect(authUrl);
});
authRoutes.get('/github/callback', async (c) => {
    const code = c.req.query('code');
    const frontendUrl = c.env?.FRONTEND_URL || process.env.FRONTEND_URL || 'https://aiorbit.club';
    if (!code) {
        return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`);
    }
    const clientId = c.env?.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
    const clientSecret = c.env?.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
    const requestUrl = new URL(c.req.url);
    const backendUrl = requestUrl.origin;
    const redirectUri = `${backendUrl}/api/auth/github/callback`;
    try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri
            })
        });
        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            throw new Error(`Github token error: ${errText}`);
        }
        const tokenData = await tokenRes.json();
        if (tokenData.error)
            throw new Error(tokenData.error);
        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'User-Agent': 'The-AI-Signal-App'
            }
        });
        if (!userRes.ok)
            throw new Error('Failed to get github user info');
        const userData = await userRes.json();
        let email = userData.email;
        if (!email) {
            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                    'User-Agent': 'The-AI-Signal-App'
                }
            });
            const emailsData = await emailRes.json();
            const primaryEmail = emailsData.find((e) => e.primary);
            if (primaryEmail)
                email = primaryEmail.email;
        }
        if (!email)
            throw new Error('No email found in Github account');
        email = email.toLowerCase();
        const prisma = getPrisma(c.env);
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: userData.name || userData.login,
                    image: userData.avatar_url,
                    emailVerified: new Date(),
                }
            });
        }
        const jwtSecret = c.env?.JWT_SECRET || process.env.JWT_SECRET;
        const jwtToken = sign({ id: user.id, email: user.email, name: user.name }, jwtSecret, { expiresIn: '7d' });
        const isProd = c.req.url.startsWith('https://');
        setCookie(c, 'auth_token', jwtToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
        return c.redirect(`${frontendUrl}/dashboard`);
    }
    catch (err) {
        return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed&details=${encodeURIComponent(err instanceof Error ? err.message : String(err))}`);
    }
});
export default authRoutes;
