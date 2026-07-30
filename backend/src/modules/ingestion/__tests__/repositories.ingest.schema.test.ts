import { describe, it, expect } from 'vitest';
import { repositorySchema, repositoriesIngestPayloadSchema } from '../repositories.ingest.schema.js';

describe('repositorySchema', () => {
  const validRepo = {
    githubId: 123456,
    slug: 'openai-whisper',
    name: 'whisper',
    owner: 'openai',
    url: 'https://github.com/openai/whisper',
    stars: 70000,
    forks: 8000,
    openIssues: 100,
    githubCreatedAt: '2022-09-15T00:00:00Z',
    syncedAt: '2026-07-29T00:00:00Z',
  };

  it('valid with required fields only', () => {
    const result = repositorySchema.safeParse(validRepo);
    expect(result.success).toBe(true);
  });

  it('valid with all optional fields', () => {
    const full = {
      ...validRepo,
      ownerAvatarUrl: 'https://avatars.githubusercontent.com/u/123',
      description: 'A speech recognition model',
      homepage: 'https://openai.com/whisper',
      language: 'Python',
      license: 'MIT',
      topics: ['speech-recognition', 'openai'],
      defaultBranch: 'main',
      logoUrl: 'https://avatars.githubusercontent.com/u/123',
      brandColor: '#ff6600',
    };
    const result = repositorySchema.safeParse(full);
    expect(result.success).toBe(true);
  });

  it('defaults applied', () => {
    const result = repositorySchema.safeParse(validRepo);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.topics).toEqual([]);
      expect(result.data.defaultBranch).toBe('main');
    }
  });

  it('githubId must be a positive integer', () => {
    const result = repositorySchema.safeParse({ ...validRepo, githubId: -1 });
    expect(result.success).toBe(false);
  });

  it('url must be valid URL', () => {
    const result = repositorySchema.safeParse({ ...validRepo, url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('stars must be non-negative', () => {
    const result = repositorySchema.safeParse({ ...validRepo, stars: -5 });
    expect(result.success).toBe(false);
  });

  it('githubCreatedAt is coerced to Date', () => {
    const result = repositorySchema.safeParse(validRepo);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.githubCreatedAt).toBeInstanceOf(Date);
    }
  });
});

describe('repositoriesIngestPayloadSchema', () => {
  it('valid with repositories array', () => {
    const result = repositoriesIngestPayloadSchema.safeParse({
      repositories: [
        {
          githubId: 1,
          slug: 'test-repo',
          name: 'test',
          owner: 'testowner',
          url: 'https://github.com/testowner/test',
          stars: 10,
          forks: 2,
          openIssues: 0,
          githubCreatedAt: '2024-01-01T00:00:00Z',
          syncedAt: '2026-07-29T00:00:00Z',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('empty repositories array valid', () => {
    const result = repositoriesIngestPayloadSchema.safeParse({ repositories: [] });
    expect(result.success).toBe(true);
  });

  it('missing repositories key fails', () => {
    const result = repositoriesIngestPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
