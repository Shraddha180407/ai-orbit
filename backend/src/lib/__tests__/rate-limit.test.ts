import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit, getIp } from '../rate-limit.js';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-06-15T12:00:00Z'));
  });

  describe('first request (no existing entry)', () => {
    it('allows the request and creates an entry', () => {
      const result = rateLimit('user-1');
      expect(result).toEqual({ success: true });
    });
  });

  describe('under the limit', () => {
    it('allows multiple requests up to limit - 1', () => {
      for (let i = 0; i < 4; i++) {
        rateLimit('user-2', 5);
      }
      const result = rateLimit('user-2', 5);
      expect(result).toEqual({ success: true });
    });
  });

  describe('at the limit', () => {
    it('rejects the request at exactly the limit', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('user-3', 5);
      }
      const result = rateLimit('user-3', 5);
      expect(result).toEqual({ success: false, retryAfter: 60 });
    });
  });

  describe('window expiration', () => {
    it('resets the counter after the window expires', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('user-4', 5, 10000);
      }
      const rejected = rateLimit('user-4', 5, 10000);
      expect(rejected).toEqual({ success: false, retryAfter: expect.any(Number) });

      vi.advanceTimersByTime(10001);

      const allowed = rateLimit('user-4', 5, 10000);
      expect(allowed).toEqual({ success: true });
    });
  });

  describe('retryAfter calculation', () => {
    it('returns seconds remaining in the window', () => {
      for (let i = 0; i < 3; i++) {
        rateLimit('user-5', 2, 30000);
      }

      vi.advanceTimersByTime(5000);

      const result = rateLimit('user-5', 2, 30000);
      expect(result).toEqual({ success: false, retryAfter: 25 });
    });
  });

  describe('separate identifiers', () => {
    it('tracks each identifier independently', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('user-a', 5);
      }
      const aRejected = rateLimit('user-a', 5);
      const bAllowed = rateLimit('user-b', 5);

      expect(aRejected.success).toBe(false);
      expect(bAllowed).toEqual({ success: true });
    });
  });

  describe('custom limit and window', () => {
    it('respects a limit of 1', () => {
      rateLimit('strict', 1, 60000);
      const result = rateLimit('strict', 1, 60000);
      expect(result).toEqual({ success: false, retryAfter: 60 });
    });

    it('respects a custom window of 5 seconds', () => {
      for (let i = 0; i < 3; i++) {
        rateLimit('fast', 3, 5000);
      }

      vi.advanceTimersByTime(5001);

      const result = rateLimit('fast', 3, 5000);
      expect(result).toEqual({ success: true });
    });
  });

  describe('empty identifier', () => {
    it('allows requests with an empty string identifier', () => {
      const result = rateLimit('', 5);
      expect(result).toEqual({ success: true });
    });
  });

  describe('default parameters', () => {
    it('uses default limit of 5 and window of 60s', () => {
      for (let i = 0; i < 5; i++) {
        rateLimit('default-params');
      }
      const result = rateLimit('default-params');
      expect(result).toEqual({ success: false, retryAfter: 60 });
    });
  });
});

describe('getIp', () => {
  function mockReq(headerValue: string | null) {
    return {
      headers: {
        get: (name: string) => (name === 'x-forwarded-for' ? headerValue : null),
      },
    };
  }

  it('returns the first IP from x-forwarded-for', () => {
    const result = getIp(mockReq('203.0.113.50, 70.41.3.18'));
    expect(result).toBe('203.0.113.50');
  });

  it('trims whitespace around the first IP', () => {
    const result = getIp(mockReq('  203.0.113.50 , 70.41.3.18'));
    expect(result).toBe('203.0.113.50');
  });

  it('returns unknown-ip when header is missing', () => {
    const result = getIp(mockReq(null));
    expect(result).toBe('unknown-ip');
  });

  it('returns the IP when only one is present', () => {
    const result = getIp(mockReq('203.0.113.50'));
    expect(result).toBe('203.0.113.50');
  });

  it('handles IPv6 addresses', () => {
    const result = getIp(mockReq('2001:db8::1, 10.0.0.1'));
    expect(result).toBe('2001:db8::1');
  });
});
