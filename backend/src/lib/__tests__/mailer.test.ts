import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import nodemailer from 'nodemailer';
import { sendVerificationLinkEmail, sendPasswordResetEmail } from '../mailer.js';

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

vi.mock('../logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('sendVerificationLinkEmail', () => {
  const env = {
    FRONTEND_URL: 'https://app.example.com',
    EMAIL_USER: 'noreply@example.com',
  };

  beforeEach(() => {
    vi.mocked(nodemailer.createTransport).mockReset();
    delete process.env.FRONTEND_URL;
  });

  afterEach(() => {
    delete process.env.FRONTEND_URL;
  });

  it('sends email with correct fields on success', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: '1' });
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const result = await sendVerificationLinkEmail('user@test.com', 'abc-123', env);

    expect(result).toEqual({ success: true });
    expect(sendMail).toHaveBeenCalledOnce();

    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('user@test.com');
    expect(opts.subject).toBe('Verify your email address');
    expect(opts.from).toContain('noreply@example.com');
  });

  it('constructs the correct verification URL', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendVerificationLinkEmail('user@test.com', 'tok-xyz', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://app.example.com/verify-email?token=tok-xyz&email=user%40test.com');
    expect(opts.text).toContain('https://app.example.com/verify-email?token=tok-xyz&email=user%40test.com');
  });

  it('uses env.FRONTEND_URL over process.env.FRONTEND_URL', async () => {
    process.env.FRONTEND_URL = 'https://should-not-use.example.com';
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendVerificationLinkEmail('a@b.com', 't', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://app.example.com/verify-email');
    expect(opts.html).not.toContain('should-not-use');
  });

  it('falls back to process.env.FRONTEND_URL when env missing it', async () => {
    process.env.FRONTEND_URL = 'https://fallback.example.com';
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const envNoUrl = { EMAIL_USER: 'noreply@example.com' };
    await sendVerificationLinkEmail('a@b.com', 't', envNoUrl);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://fallback.example.com/verify-email');
  });

  it('falls back to hardcoded URL when neither env nor process.env set', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const envEmpty = { EMAIL_USER: 'noreply@example.com' };
    await sendVerificationLinkEmail('a@b.com', 't', envEmpty);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://aiorbit.club/verify-email');
  });

  it('encodes special characters in email address', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendVerificationLinkEmail('user+tag@ex.com', 'tok', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('email=user%2Btag%40ex.com');
  });

  it('returns failure with error when sendMail throws', async () => {
    const error = new Error('SMTP connection refused');
    const sendMail = vi.fn().mockRejectedValue(error);
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const result = await sendVerificationLinkEmail('a@b.com', 't', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });
});

describe('sendPasswordResetEmail', () => {
  const env = {
    FRONTEND_URL: 'https://app.example.com',
    EMAIL_USER: 'noreply@example.com',
  };

  beforeEach(() => {
    vi.mocked(nodemailer.createTransport).mockReset();
    delete process.env.FRONTEND_URL;
  });

  afterEach(() => {
    delete process.env.FRONTEND_URL;
  });

  it('sends email with correct fields on success', async () => {
    const sendMail = vi.fn().mockResolvedValue({ messageId: '2' });
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const result = await sendPasswordResetEmail('user@test.com', 'rst-456', env);

    expect(result).toEqual({ success: true });
    expect(sendMail).toHaveBeenCalledOnce();

    const opts = sendMail.mock.calls[0][0];
    expect(opts.to).toBe('user@test.com');
    expect(opts.subject).toBe('Reset your password - The AI Signal');
    expect(opts.from).toContain('noreply@example.com');
  });

  it('constructs the correct reset URL', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendPasswordResetEmail('user@test.com', 'rst-xyz', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://app.example.com/auth/reset-password?token=rst-xyz&email=user%40test.com');
    expect(opts.text).toContain('https://app.example.com/auth/reset-password?token=rst-xyz&email=user%40test.com');
  });

  it('uses env.FRONTEND_URL over process.env.FRONTEND_URL', async () => {
    process.env.FRONTEND_URL = 'https://should-not-use.example.com';
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendPasswordResetEmail('a@b.com', 't', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://app.example.com/auth/reset-password');
    expect(opts.html).not.toContain('should-not-use');
  });

  it('falls back to hardcoded URL when env missing FRONTEND_URL', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const envNoUrl = { EMAIL_USER: 'noreply@example.com' };
    await sendPasswordResetEmail('a@b.com', 't', envNoUrl);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('https://aiorbit.club/auth/reset-password');
  });

  it('encodes special characters in email address', async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendPasswordResetEmail('user+tag@ex.com', 't', env);

    const opts = sendMail.mock.calls[0][0];
    expect(opts.html).toContain('email=user%2Btag%40ex.com');
  });

  it('returns failure with error when sendMail throws', async () => {
    const error = new Error('Auth failed');
    const sendMail = vi.fn().mockRejectedValue(error);
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    const result = await sendPasswordResetEmail('a@b.com', 't', env);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
    }
  });
});
