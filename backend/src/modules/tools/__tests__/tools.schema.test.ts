import { describe, it, expect } from 'vitest';
import { GetToolsQuerySchema, CreateReviewSchema, BookmarkToggleSchema } from '../tools.schema.js';

describe('GetToolsQuerySchema', () => {
  it('valid with defaults', () => {
    const result = GetToolsQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe('');
      expect(result.data.sort).toBe('newest');
      expect(result.data.page).toBe('1');
    }
  });

  it('all optional fields accepted', () => {
    const result = GetToolsQuerySchema.safeParse({
      q: 'test',
      category: 'ai',
      pricing: 'FREE',
      sort: 'rating',
      page: '3',
    });
    expect(result.success).toBe(true);
  });

  it('sort enum validation', () => {
    expect(GetToolsQuerySchema.safeParse({ sort: 'newest' }).success).toBe(true);
    expect(GetToolsQuerySchema.safeParse({ sort: 'oldest' }).success).toBe(true);
    expect(GetToolsQuerySchema.safeParse({ sort: 'name-asc' }).success).toBe(true);
    expect(GetToolsQuerySchema.safeParse({ sort: 'name-desc' }).success).toBe(true);
    expect(GetToolsQuerySchema.safeParse({ sort: 'rating' }).success).toBe(true);
    expect(GetToolsQuerySchema.safeParse({ sort: 'invalid' }).success).toBe(false);
  });
});

describe('CreateReviewSchema', () => {
  it('valid with all fields', () => {
    const result = CreateReviewSchema.safeParse({
      toolId: 'tool-1',
      rating: 5,
      comment: 'Excellent tool, highly recommended!',
    });
    expect(result.success).toBe(true);
  });

  it('rating bounds 1-5', () => {
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 0, comment: 'a'.repeat(10) }).success).toBe(false);
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 6, comment: 'a'.repeat(10) }).success).toBe(false);
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 1, comment: 'a'.repeat(10) }).success).toBe(true);
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 5, comment: 'a'.repeat(10) }).success).toBe(true);
  });

  it('comment min 10 chars', () => {
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 3, comment: 'short' }).success).toBe(false);
    expect(CreateReviewSchema.safeParse({ toolId: 't', rating: 3, comment: 'tenchars!!' }).success).toBe(true);
  });

  it('missing toolId fails', () => {
    const result = CreateReviewSchema.safeParse({ rating: 4, comment: 'a'.repeat(10) });
    expect(result.success).toBe(false);
  });

  it('missing rating fails', () => {
    const result = CreateReviewSchema.safeParse({ toolId: 't', comment: 'a'.repeat(10) });
    expect(result.success).toBe(false);
  });

  it('missing comment fails', () => {
    const result = CreateReviewSchema.safeParse({ toolId: 't', rating: 3 });
    expect(result.success).toBe(false);
  });

  it('string rating coerced', () => {
    const result = CreateReviewSchema.safeParse({ toolId: 't', rating: '4', comment: 'a'.repeat(10) });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.rating).toBe(4);
    }
  });
});

describe('BookmarkToggleSchema', () => {
  it('valid toolId', () => {
    const result = BookmarkToggleSchema.safeParse({ toolId: 'tool-1' });
    expect(result.success).toBe(true);
  });

  it('missing toolId fails', () => {
    const result = BookmarkToggleSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('empty toolId fails', () => {
    const result = BookmarkToggleSchema.safeParse({ toolId: '' });
    expect(result.success).toBe(false);
  });
});
