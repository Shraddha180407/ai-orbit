import { describe, it, expect } from 'vitest';
import {
  signupSchema,
  loginSchema,
  verifyEmailSchema,
  emailOnlySchema,
  resetPasswordSchema,
} from '../auth.schema.js';

describe('signupSchema', () => {
  it('accepts valid email and password', () => {
    const result = signupSchema.safeParse({ email: 'a@b.com', password: '123456' });
    expect(result.success).toBe(true);
  });

  it('accepts optional name', () => {
    const result = signupSchema.safeParse({ email: 'a@b.com', password: '123456', name: 'Alice' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe('Alice');
  });

  it('rejects invalid email', () => {
    const result = signupSchema.safeParse({ email: 'not-an-email', password: '123456' });
    expect(result.success).toBe(false);
  });

  it('rejects password shorter than 6 chars', () => {
    const result = signupSchema.safeParse({ email: 'a@b.com', password: '12345' });
    expect(result.success).toBe(false);
  });

  it('rejects missing email', () => {
    const result = signupSchema.safeParse({ password: '123456' });
    expect(result.success).toBe(false);
  });

  it('rejects missing password', () => {
    const result = signupSchema.safeParse({ email: 'a@b.com' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'pass' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'bad', password: 'pass' });
    expect(result.success).toBe(false);
  });

  it('rejects empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('verifyEmailSchema', () => {
  it('accepts valid email and token', () => {
    const result = verifyEmailSchema.safeParse({ email: 'a@b.com', token: 'abc' });
    expect(result.success).toBe(true);
  });

  it('rejects empty token', () => {
    const result = verifyEmailSchema.safeParse({ email: 'a@b.com', token: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = verifyEmailSchema.safeParse({ email: 'bad', token: 'abc' });
    expect(result.success).toBe(false);
  });
});

describe('emailOnlySchema', () => {
  it('accepts valid email', () => {
    const result = emailOnlySchema.safeParse({ email: 'a@b.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = emailOnlySchema.safeParse({ email: 'bad' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts valid data', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'a@b.com',
      token: 'abc',
      newPassword: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short newPassword', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'a@b.com',
      token: 'abc',
      newPassword: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty token', () => {
    const result = resetPasswordSchema.safeParse({
      email: 'a@b.com',
      token: '',
      newPassword: '123456',
    });
    expect(result.success).toBe(false);
  });
});
