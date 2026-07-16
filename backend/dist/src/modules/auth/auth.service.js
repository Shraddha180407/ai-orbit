import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateVerificationToken, hashToken } from '../../lib/tokens.js';
import { sendVerificationLinkEmail, sendPasswordResetEmail } from '../../lib/mailer.js';
export class AuthService {
    prisma;
    env;
    constructor(prisma, env) {
        this.prisma = prisma;
        this.env = env;
    }
    async signup(data) {
        const email = data.email.trim().toLowerCase();
        const existingUser = await this.prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });
        if (existingUser) {
            throw new Error('Email is already in use.');
        }
        const hashedPassword = await bcrypt.hash(data.password, 12);
        const user = await this.prisma.user.create({
            data: {
                email,
                name: data.name || email,
                password: hashedPassword,
                emailVerified: null,
            },
        });
        const rawToken = generateVerificationToken();
        const hashedToken = hashToken(rawToken);
        const identifier = `verify:${email}`;
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.$transaction([
            this.prisma.verificationToken.deleteMany({ where: { identifier } }),
            this.prisma.verificationToken.create({
                data: { identifier, token: hashedToken, expires },
            }),
        ]);
        await sendVerificationLinkEmail(email, rawToken, this.env);
        return user;
    }
    async login(data) {
        const email = data.email.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });
        if (!user || !user.password) {
            throw new Error('Invalid email or password.');
        }
        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
            throw new Error('Invalid email or password.');
        }
        if (!user.emailVerified) {
            throw new Error('Please verify your email before logging in.');
        }
        return user;
    }
    async verifyEmail(data) {
        const email = data.email.trim().toLowerCase();
        const identifier = `verify:${email}`;
        const hashedToken = hashToken(data.token);
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { identifier_token: { identifier, token: hashedToken } },
        });
        if (!verificationToken) {
            throw new Error('Invalid verification link. It may have already been used.');
        }
        if (new Date() > verificationToken.expires) {
            await this.prisma.verificationToken.delete({
                where: { identifier_token: { identifier, token: hashedToken } },
            });
            throw new Error('This verification link has expired. Please request a new one.');
        }
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('User not found.');
        }
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { email },
                data: { emailVerified: new Date() },
            }),
            this.prisma.verificationToken.delete({
                where: { identifier_token: { identifier, token: hashedToken } },
            }),
        ]);
        return user;
    }
    async resendVerification(data) {
        const email = data.email.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });
        if (!user) {
            return { message: 'If an account exists, a verification email has been sent.' };
        }
        if (user.emailVerified) {
            throw new Error('Email is already verified.');
        }
        const rawToken = generateVerificationToken();
        const hashedToken = hashToken(rawToken);
        const identifier = `verify:${email}`;
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.$transaction([
            this.prisma.verificationToken.deleteMany({ where: { identifier } }),
            this.prisma.verificationToken.create({
                data: { identifier, token: hashedToken, expires },
            }),
        ]);
        await sendVerificationLinkEmail(email, rawToken, this.env);
        return { message: 'Verification email resent.' };
    }
    async forgotPassword(data) {
        const email = data.email.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } }
        });
        if (!user) {
            return { message: 'If an account exists, a reset email has been sent.' };
        }
        const rawToken = generateVerificationToken();
        const hashedToken = hashToken(rawToken);
        const identifier = `reset:${email}`;
        const expires = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.$transaction([
            this.prisma.verificationToken.deleteMany({ where: { identifier } }),
            this.prisma.verificationToken.create({
                data: { identifier, token: hashedToken, expires },
            }),
        ]);
        await sendPasswordResetEmail(email, rawToken, this.env);
        return { message: 'Password reset email sent.' };
    }
    async resetPassword(data) {
        const email = data.email.trim().toLowerCase();
        const identifier = `reset:${email}`;
        const hashedToken = hashToken(data.token);
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { identifier_token: { identifier, token: hashedToken } },
        });
        if (!verificationToken) {
            throw new Error('Invalid or expired reset link.');
        }
        if (new Date() > verificationToken.expires) {
            await this.prisma.verificationToken.delete({
                where: { identifier_token: { identifier, token: hashedToken } },
            });
            throw new Error('This reset link has expired. Please request a new one.');
        }
        const hashedPassword = await bcrypt.hash(data.newPassword, 12);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            }),
            this.prisma.verificationToken.delete({
                where: { identifier_token: { identifier, token: hashedToken } },
            }),
        ]);
    }
    async deleteAccount(userId) {
        await this.prisma.user.delete({
            where: { id: userId }
        });
    }
    async getMe(userId) {
        const dbUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, image: true, emailVerified: true }
        });
        if (!dbUser)
            throw new Error('User not found.');
        return dbUser;
    }
    async getSettings(userId) {
        const dbUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true }
        });
        if (!dbUser)
            throw new Error('User not found.');
        return {
            connectedProviders: [], // We are not tracking oauth providers in Account table right now
            hasPassword: Boolean(dbUser.password)
        };
    }
    async updatePassword(userId, data) {
        const dbUser = await this.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!dbUser)
            throw new Error('User not found.');
        if (dbUser.password) {
            const isValid = await bcrypt.compare(data.currentPassword, dbUser.password);
            if (!isValid)
                throw new Error('Incorrect current password.');
        }
        const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
    }
}
