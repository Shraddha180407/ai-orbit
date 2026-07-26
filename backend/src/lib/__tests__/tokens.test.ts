import { describe, it, expect } from 'vitest';
import { generateVerificationToken, hashToken } from '../tokens.js';

describe('tokens', () => {
  it('generates a valid UUID', () => {
    const token = generateVerificationToken();
    expect(token).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('produces a deterministic SHA-256 hash', () => {
    const hash = hashToken('test-token');
    expect(hash).toBe(
      '4c5dc9b7708905f77f5e5d16316b5dfb425e68cb326dcd55a860e90a7707031e',
    );
  });

  it('produces different hashes for different inputs', () => {
    expect(hashToken('token-a')).not.toBe(hashToken('token-b'));
  });
});
