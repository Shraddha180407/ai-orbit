import { describe, it, expect } from 'vitest';
import { ListQuerySchema, SlugParamSchema, RelatedQuerySchema, VideoUpsertSchema } from '../videos.schemas.js';

describe('ListQuerySchema', () => {
  it('valid with defaults', () => {
    const result = ListQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sort).toBe('latest');
    }
  });

  it('sort enum: latest and trending', () => {
    expect(ListQuerySchema.safeParse({ sort: 'latest' }).success).toBe(true);
    expect(ListQuerySchema.safeParse({ sort: 'trending' }).success).toBe(true);
    expect(ListQuerySchema.safeParse({ sort: 'invalid' }).success).toBe(false);
  });

  it('limit transform parses string to number', () => {
    const result = ListQuerySchema.safeParse({ limit: '10' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(10);
    }
  });

  it('limit returns undefined for non-numeric', () => {
    const result = ListQuerySchema.safeParse({ limit: 'abc' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBeUndefined();
    }
  });

  it('offset validation: non-negative integer', () => {
    expect(ListQuerySchema.safeParse({ offset: 0 }).success).toBe(true);
    expect(ListQuerySchema.safeParse({ offset: 10 }).success).toBe(true);
    expect(ListQuerySchema.safeParse({ offset: -1 }).success).toBe(false);
    expect(ListQuerySchema.safeParse({ offset: 1.5 }).success).toBe(false);
  });

  it('offset optional', () => {
    const result = ListQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.offset).toBeUndefined();
    }
  });
});

describe('SlugParamSchema', () => {
  it('valid slug', () => {
    const result = SlugParamSchema.safeParse({ slug: 'my-video' });
    expect(result.success).toBe(true);
  });

  it('empty slug fails', () => {
    const result = SlugParamSchema.safeParse({ slug: '' });
    expect(result.success).toBe(false);
  });
});

describe('RelatedQuerySchema', () => {
  it('valid with default limit 4', () => {
    const result = RelatedQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(4);
    }
  });

  it('custom limit parsed', () => {
    const result = RelatedQuerySchema.safeParse({ limit: '8' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(8);
    }
  });

  it('non-numeric limit defaults to 4', () => {
    const result = RelatedQuerySchema.safeParse({ limit: 'abc' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(4);
    }
  });
});

describe('VideoUpsertSchema', () => {
  const validVideo = {
    id: 'v1',
    slug: 'test-video',
    title: 'Test Video',
    description: 'A test video',
    toolName: 'GPT-4',
    toolCategory: 'llm',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/thumb.jpg',
    durationSeconds: 600,
    views: 1000,
    likes: 50,
    publishedAt: '2025-01-15',
    author: { name: 'Test Channel', avatar: 'https://avatar.png' },
    channelId: 'UC123',
    tags: ['ai', 'llm'],
    accent: '#FF0000',
  };

  it('valid with all fields', () => {
    const result = VideoUpsertSchema.safeParse(validVideo);
    expect(result.success).toBe(true);
  });

  it('required fields enforced', () => {
    const required = ['id', 'slug', 'title', 'description', 'toolName', 'toolCategory', 'youtubeId', 'thumbnail', 'durationSeconds', 'views', 'likes', 'publishedAt', 'author', 'tags', 'accent'];
    for (const field of required) {
      const rest = { ...validVideo } as Record<string, unknown>;
      delete rest[field];
      const result = VideoUpsertSchema.safeParse(rest);
      expect(result.success).toBe(false);
    }
  });

  it('invalid toolCategory fails', () => {
    const result = VideoUpsertSchema.safeParse({ ...validVideo, toolCategory: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('valid toolCategory values', () => {
    const categories = ['multimodal-ai', 'robotics', 'agents', 'llm', 'general-ai'];
    for (const cat of categories) {
      const result = VideoUpsertSchema.safeParse({ ...validVideo, toolCategory: cat });
      expect(result.success).toBe(true);
    }
  });

  it('channelId can be null', () => {
    const result = VideoUpsertSchema.safeParse({ ...validVideo, channelId: null });
    expect(result.success).toBe(true);
  });
});
