import { describe, it, expect } from 'vitest';
import { AutocompleteQuerySchema } from '../search.schema.js';

describe('AutocompleteQuerySchema', () => {
  it('passes with valid q', () => {
    const result = AutocompleteQuerySchema.safeParse({ q: 'react' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe('react');
      expect(result.data.limit).toBe('8');
    }
  });

  it('fails with empty q', () => {
    const result = AutocompleteQuerySchema.safeParse({ q: '' });
    expect(result.success).toBe(false);
  });

  it('fails when q is missing', () => {
    const result = AutocompleteQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('trims whitespace from q', () => {
    const result = AutocompleteQuerySchema.safeParse({ q: '  react  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe('react');
    }
  });

  it('defaults limit to 8', () => {
    const result = AutocompleteQuerySchema.safeParse({ q: 'test' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe('8');
    }
  });

  it('accepts custom limit', () => {
    const result = AutocompleteQuerySchema.safeParse({ q: 'test', limit: '5' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe('5');
    }
  });
});
