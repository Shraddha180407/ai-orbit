import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../auth.service.js';

vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn(), compare: vi.fn() },
}));

vi.mock('../../../lib/tokens.js', () => ({
  generateVerificationToken: vi.fn(),
  hashToken: vi.fn(),
}));

vi.mock('../../../lib/mailer.js', () => ({
  sendVerificationLinkEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

import bcrypt from 'bcryptjs';
import { generateVerificationToken, hashToken } from '../../../lib/tokens.js';
import { sendVerificationLinkEmail, sendPasswordResetEmail } from '../../../lib/mailer.js';

function createMockPrisma() {
  return {
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    verificationToken: {
      findUnique: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn((ops: unknown[]) => Promise.all(ops)),
  };
}

const env = { FRONTEND_URL: 'https://app.example.com', EMAIL_USER: 'test@example.com' };

describe('AuthService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;
  let service: AuthService;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new AuthService(prisma as never, env);
    vi.mocked(bcrypt.hash).mockReset();
    vi.mocked(bcrypt.compare).mockReset();
    vi.mocked(generateVerificationToken).mockReset();
    vi.mocked(hashToken).mockReset();
    vi.mocked(sendVerificationLinkEmail).mockReset();
    vi.mocked(sendPasswordResetEmail).mockReset();
    prisma.$transaction.mockImplementation((ops: unknown[]) => Promise.all(ops as Promise<unknown>[]));
  });

  describe('signup', () => {
    it('creates user and sends verification email', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      prisma.user.create.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
      vi.mocked(generateVerificationToken).mockReturnValue('raw-token');
      vi.mocked(hashToken).mockReturnValue('hashed-token');
      vi.mocked(sendVerificationLinkEmail).mockResolvedValue({ success: true });

      const result = await service.signup({ email: 'a@b.com', password: '123456' });

      expect(result.email).toBe('a@b.com');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(sendVerificationLinkEmail).toHaveBeenCalled();
    });

    it('throws Conflict when email exists', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'existing' });

      await expect(service.signup({ email: 'a@b.com', password: '123456' }))
        .rejects.toThrow('Email is already in use');
    });

    it('normalizes email to lowercase and trims', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue('hashed' as never);
      prisma.user.create.mockResolvedValue({});
      vi.mocked(generateVerificationToken).mockReturnValue('t');
      vi.mocked(hashToken).mockReturnValue('h');
      vi.mocked(sendVerificationLinkEmail).mockResolvedValue({ success: true });

      await service.signup({ email: '  A@B.COM  ', password: '123456' });

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email: { equals: 'a@b.com', mode: 'insensitive' } },
      });
    });
  });

  describe('login', () => {
    it('returns user on valid credentials', async () => {
      const user = { id: 'u1', password: 'hashed', emailVerified: new Date() };
      prisma.user.findFirst.mockResolvedValue(user);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await service.login({ email: 'a@b.com', password: 'pass' });
      expect(result.id).toBe('u1');
    });

    it('throws Unauthorized when user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      await expect(service.login({ email: 'a@b.com', password: 'pass' }))
        .rejects.toThrow('Invalid email or password');
    });

    it('throws Unauthorized when password invalid', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', password: 'hashed', emailVerified: new Date() });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(service.login({ email: 'a@b.com', password: 'wrong' }))
        .rejects.toThrow('Invalid email or password');
    });

    it('throws Forbidden when email not verified', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', password: 'hashed', emailVerified: null });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      await expect(service.login({ email: 'a@b.com', password: 'pass' }))
        .rejects.toThrow('Please verify your email before logging in');
    });
  });

  describe('verifyEmail', () => {
    it('verifies email and returns user', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed-tok');
      prisma.verificationToken.findUnique.mockResolvedValue({
        identifier: 'verify:a@b.com',
        token: 'hashed-tok',
        expires: new Date(Date.now() + 3600000),
      });
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
      prisma.user.update.mockResolvedValue({ id: 'u1', email: 'a@b.com' });
      prisma.verificationToken.deleteMany.mockResolvedValue({});

      const result = await service.verifyEmail({ email: 'a@b.com', token: 'raw-tok' });
      expect(result!.id).toBe('u1');
      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
    });

    it('throws BadRequest when token not found', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue(null);
      await expect(service.verifyEmail({ email: 'a@b.com', token: 'raw' }))
        .rejects.toThrow('Invalid verification link');
    });

    it('throws BadRequest when token expired', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue({
        identifier: 'verify:a@b.com',
        token: 'hashed',
        expires: new Date(Date.now() - 1000),
      });
      prisma.verificationToken.deleteMany.mockResolvedValue({});

      await expect(service.verifyEmail({ email: 'a@b.com', token: 'raw' }))
        .rejects.toThrow('expired');
      expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
    });

    it('throws NotFound when user not found', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue({
        identifier: 'verify:a@b.com',
        token: 'hashed',
        expires: new Date(Date.now() + 3600000),
      });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyEmail({ email: 'a@b.com', token: 'raw' }))
        .rejects.toThrow('User not found');
    });
  });

  describe('resendVerification', () => {
    it('returns success message when user not found (no leak)', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const result = await service.resendVerification({ email: 'a@b.com' });
      expect(result.message).toContain('verification email');
    });

    it('throws BadRequest when already verified', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', emailVerified: new Date() });
      await expect(service.resendVerification({ email: 'a@b.com' }))
        .rejects.toThrow('already verified');
    });

    it('sends new verification email', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1', emailVerified: null });
      vi.mocked(generateVerificationToken).mockReturnValue('new-tok');
      vi.mocked(hashToken).mockReturnValue('hashed');
      vi.mocked(sendVerificationLinkEmail).mockResolvedValue({ success: true });

      const result = await service.resendVerification({ email: 'a@b.com' });
      expect(result.message).toContain('resent');
      expect(sendVerificationLinkEmail).toHaveBeenCalled();
    });
  });

  describe('forgotPassword', () => {
    it('returns success message even when user not found', async () => {
      prisma.user.findFirst.mockResolvedValue(null);
      const result = await service.forgotPassword({ email: 'a@b.com' });
      expect(result.message).toContain('reset email');
    });

    it('sends reset email when user exists', async () => {
      prisma.user.findFirst.mockResolvedValue({ id: 'u1' });
      vi.mocked(generateVerificationToken).mockReturnValue('tok');
      vi.mocked(hashToken).mockReturnValue('hashed');
      vi.mocked(sendPasswordResetEmail).mockResolvedValue({ success: true });

      await service.forgotPassword({ email: 'a@b.com' });
      expect(sendPasswordResetEmail).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('hashes new password and updates user', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue({
        identifier: 'reset:a@b.com',
        token: 'hashed',
        expires: new Date(Date.now() + 3600000),
      });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed' as never);
      prisma.user.update.mockResolvedValue({});
      prisma.verificationToken.deleteMany.mockResolvedValue({});

      await service.resetPassword({ email: 'a@b.com', token: 'raw', newPassword: 'newpass' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 12);
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('throws BadRequest when token invalid', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue(null);
      await expect(service.resetPassword({ email: 'a@b.com', token: 'raw', newPassword: 'new' }))
        .rejects.toThrow('Invalid or expired reset link');
    });

    it('throws BadRequest when token expired', async () => {
      vi.mocked(hashToken).mockReturnValue('hashed');
      prisma.verificationToken.findUnique.mockResolvedValue({
        identifier: 'reset:a@b.com',
        token: 'hashed',
        expires: new Date(Date.now() - 1000),
      });
      prisma.verificationToken.deleteMany.mockResolvedValue({});

      await expect(service.resetPassword({ email: 'a@b.com', token: 'raw', newPassword: 'new' }))
        .rejects.toThrow('expired');
      expect(prisma.verificationToken.deleteMany).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('deletes user by id', async () => {
      prisma.user.delete.mockResolvedValue({});
      await service.deleteAccount('u1');
      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
    });
  });

  describe('getMe', () => {
    it('returns user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', name: 'A', email: 'a@b.com', image: null, emailVerified: new Date(), role: 'USER' });
      const result = await service.getMe('u1');
      expect(result.id).toBe('u1');
    });

    it('throws NotFound when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getMe('missing')).rejects.toThrow('User not found');
    });
  });

  describe('getSettings', () => {
    it('returns settings with hasPassword true', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: 'hashed' });
      const result = await service.getSettings('u1');
      expect(result.hasPassword).toBe(true);
    });

    it('returns settings with hasPassword false', async () => {
      prisma.user.findUnique.mockResolvedValue({ password: null });
      const result = await service.getSettings('u1');
      expect(result.hasPassword).toBe(false);
    });

    it('throws NotFound when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.getSettings('missing')).rejects.toThrow('User not found');
    });
  });

  describe('updatePassword', () => {
    it('updates password without currentPassword when no existing password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', password: null });
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed' as never);
      prisma.user.update.mockResolvedValue({});

      await service.updatePassword('u1', { newPassword: 'newpass' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 12);
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('throws BadRequest when has password but no currentPassword', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', password: 'hashed' });
      await expect(service.updatePassword('u1', { newPassword: 'new' }))
        .rejects.toThrow('Current password is required');
    });

    it('throws Unauthorized when current password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', password: 'hashed' });
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);
      await expect(service.updatePassword('u1', { currentPassword: 'wrong', newPassword: 'new' }))
        .rejects.toThrow('Incorrect current password');
    });

    it('updates when current password is correct', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', password: 'hashed' });
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(bcrypt.hash).mockResolvedValue('new-hashed' as never);
      prisma.user.update.mockResolvedValue({});

      await service.updatePassword('u1', { currentPassword: 'old', newPassword: 'new' });
      expect(prisma.user.update).toHaveBeenCalled();
    });

    it('throws NotFound when user missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.updatePassword('missing', { newPassword: 'new' }))
        .rejects.toThrow('User not found');
    });
  });
});
