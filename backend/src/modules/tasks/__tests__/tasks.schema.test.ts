import { describe, it, expect } from 'vitest';
import { GetTasksQuerySchema, ToggleTaskBookmarkSchema } from '../tasks.schema.js';

describe('GetTasksQuerySchema', () => {
  it('passes with valid defaults', () => {
    const result = GetTasksQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe('');
      expect(result.data.sort).toBe('newest');
      expect(result.data.page).toBe('1');
      expect(result.data.filter).toBe('all');
    }
  });

  it('accepts all optional fields', () => {
    const result = GetTasksQuerySchema.safeParse({
      q: 'react',
      category: 'ai',
      difficulty: 'ADVANCED',
      pricing: 'FREE',
      featuredOnly: 'true',
      sort: 'popular',
      page: '3',
      filter: 'for-you',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe('react');
      expect(result.data.category).toBe('ai');
      expect(result.data.difficulty).toBe('ADVANCED');
      expect(result.data.pricing).toBe('FREE');
      expect(result.data.featuredOnly).toBe('true');
      expect(result.data.sort).toBe('popular');
      expect(result.data.page).toBe('3');
      expect(result.data.filter).toBe('for-you');
    }
  });

  it('validates difficulty enum', () => {
    const valid = GetTasksQuerySchema.safeParse({ difficulty: 'MEDIUM' });
    expect(valid.success).toBe(true);

    const invalid = GetTasksQuerySchema.safeParse({ difficulty: 'HARD' });
    expect(invalid.success).toBe(false);
  });

  it('validates sort enum', () => {
    const valid = GetTasksQuerySchema.safeParse({ sort: 'alphabetical' });
    expect(valid.success).toBe(true);

    const invalid = GetTasksQuerySchema.safeParse({ sort: 'rating' });
    expect(invalid.success).toBe(false);
  });

  it('validates filter enum', () => {
    const valid = GetTasksQuerySchema.safeParse({ filter: 'following' });
    expect(valid.success).toBe(true);

    const invalid = GetTasksQuerySchema.safeParse({ filter: 'mine' });
    expect(invalid.success).toBe(false);
  });
});

describe('ToggleTaskBookmarkSchema', () => {
  it('passes with valid taskId', () => {
    const result = ToggleTaskBookmarkSchema.safeParse({ taskId: 'abc-123' });
    expect(result.success).toBe(true);
  });

  it('fails when taskId is missing', () => {
    const result = ToggleTaskBookmarkSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('fails when taskId is empty string', () => {
    const result = ToggleTaskBookmarkSchema.safeParse({ taskId: '' });
    expect(result.success).toBe(false);
  });
});
