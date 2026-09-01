import { describe, it, expect } from 'vitest';
import {
  newsListingQuerySchema,
  newsSlugParamSchema,
  newsDetailQuerySchema,
  newsVoteBodySchema,
  newsBookmarkBodySchema,
  newsBookmarkQuerySchema,
  newsCommentBodySchema,
} from '../news.schemas.js';

describe('newsListingQuerySchema', () => {
  it('valid with page and perPage strings', () => {
    const result = newsListingQuerySchema.safeParse({ page: '2', perPage: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.perPage).toBe(10);
    }
  });

  it('transforms string to number', () => {
    const result = newsListingQuerySchema.safeParse({ page: '5', perPage: '20' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.page).toBe('number');
      expect(typeof result.data.perPage).toBe('number');
    }
  });

  it('optional clientId', () => {
    const result = newsListingQuerySchema.safeParse({ clientId: 'abc' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.clientId).toBe('abc');
    }
  });

  it('clamps page to minimum 1', () => {
    const result = newsListingQuerySchema.safeParse({ page: '0' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
    }
  });

  it('caps perPage at 100', () => {
    const result = newsListingQuerySchema.safeParse({ perPage: '200' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.perPage).toBe(100);
    }
  });

  it('empty object is valid (all optional)', () => {
    const result = newsListingQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('newsSlugParamSchema', () => {
  it('valid slug', () => {
    const result = newsSlugParamSchema.safeParse({ slug: 'my-article' });
    expect(result.success).toBe(true);
  });

  it('empty slug fails', () => {
    const result = newsSlugParamSchema.safeParse({ slug: '' });
    expect(result.success).toBe(false);
  });
});

describe('newsDetailQuerySchema', () => {
  it('valid with optional clientId', () => {
    const result = newsDetailQuerySchema.safeParse({ clientId: 'xyz' });
    expect(result.success).toBe(true);
  });

  it('valid without clientId', () => {
    const result = newsDetailQuerySchema.safeParse({});
    expect(result.success).toBe(true);
  });
});

describe('newsVoteBodySchema', () => {
  it('valid with value 1', () => {
    const result = newsVoteBodySchema.safeParse({ clientId: 'c1', value: 1 });
    expect(result.success).toBe(true);
  });

  it('valid with value -1', () => {
    const result = newsVoteBodySchema.safeParse({ clientId: 'c1', value: -1 });
    expect(result.success).toBe(true);
  });

  it('missing clientId fails', () => {
    const result = newsVoteBodySchema.safeParse({ value: 1 });
    expect(result.success).toBe(false);
  });

  it('invalid value fails', () => {
    const result = newsVoteBodySchema.safeParse({ clientId: 'c1', value: 2 });
    expect(result.success).toBe(false);
  });
});

describe('newsBookmarkBodySchema', () => {
  it('valid', () => {
    const result = newsBookmarkBodySchema.safeParse({ clientId: 'c1' });
    expect(result.success).toBe(true);
  });

  it('missing clientId fails', () => {
    const result = newsBookmarkBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('newsBookmarkQuerySchema', () => {
  it('valid', () => {
    const result = newsBookmarkQuerySchema.safeParse({ clientId: 'c1' });
    expect(result.success).toBe(true);
  });

  it('missing clientId fails', () => {
    const result = newsBookmarkQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('newsCommentBodySchema', () => {
  it('valid with all fields', () => {
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1', authorName: 'Alice', body: 'Great article!' });
    expect(result.success).toBe(true);
  });

  it('valid without optional authorName', () => {
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1', body: 'Nice post' });
    expect(result.success).toBe(true);
  });

  it('body min 1 char', () => {
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1', body: '' });
    expect(result.success).toBe(false);
  });

  it('body max 2000 chars', () => {
    const long = 'x'.repeat(2001);
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1', body: long });
    expect(result.success).toBe(false);
  });

  it('authorName max 80 chars', () => {
    const long = 'x'.repeat(81);
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1', authorName: long, body: 'Hello' });
    expect(result.success).toBe(false);
  });

  it('missing body fails', () => {
    const result = newsCommentBodySchema.safeParse({ clientId: 'c1' });
    expect(result.success).toBe(false);
  });
});
