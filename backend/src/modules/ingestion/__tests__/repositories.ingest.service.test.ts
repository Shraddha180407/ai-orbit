import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepositoriesIngestService } from '../repositories.ingest.service.js';

function createMockPrisma() {
  const mockTransaction = vi.fn(async (fn: (tx: Record<string, unknown>) => Promise<unknown>) => {
    return fn(mockTx);
  });

  const mockTx = {
    repository: {
      findUnique: vi.fn().mockResolvedValue(null),
      upsert: vi.fn().mockResolvedValue({}),
    },
    $transaction: mockTransaction,
  };

  return {
    $transaction: mockTransaction,
    _tx: mockTx,
  };
}

const VALID_REPO = {
  githubId: 123456,
  slug: 'openai-whisper',
  name: 'whisper',
  owner: 'openai',
  url: 'https://github.com/openai/whisper',
  topics: ['speech-recognition', 'openai'],
  stars: 70000,
  forks: 8000,
  openIssues: 100,
  defaultBranch: 'main',
  githubCreatedAt: new Date('2022-09-15'),
  syncedAt: new Date('2026-07-29'),
};

describe('RepositoriesIngestService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
    vi.clearAllMocks();
  });

  describe('ingestRepositories', () => {
    it('creates a new repository', async () => {
      prisma._tx.repository.findUnique.mockResolvedValue(null);

      const result = await RepositoriesIngestService.ingestRepositories(
        prisma as never,
        { repositories: [VALID_REPO] },
      );

      expect(result.processed).toBe(1);
      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(prisma._tx.repository.upsert).toHaveBeenCalledOnce();
    });

    it('updates an existing repository', async () => {
      prisma._tx.repository.findUnique.mockResolvedValue({ githubId: 123456 });

      const result = await RepositoriesIngestService.ingestRepositories(
        prisma as never,
        { repositories: [VALID_REPO] },
      );

      expect(result.processed).toBe(1);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('handles multiple repositories', async () => {
      prisma._tx.repository.findUnique.mockResolvedValue(null);

      const result = await RepositoriesIngestService.ingestRepositories(
        prisma as never,
        {
          repositories: [
            VALID_REPO,
            { ...VALID_REPO, githubId: 999999, slug: 'test-repo', name: 'test', owner: 'test' },
          ],
        },
      );

      expect(result.processed).toBe(2);
      expect(result.created).toBe(2);
      expect(prisma._tx.repository.upsert).toHaveBeenCalledTimes(2);
    });

    it('records errors and continues processing', async () => {
      // First repo succeeds (findUnique returns null for both collision check and existence check)
      // Second repo fails during transaction
      prisma._tx.repository.findUnique
        .mockResolvedValueOnce(null)  // collision check repo 1
        .mockResolvedValueOnce(null)  // existence check repo 1
        .mockRejectedValueOnce(new Error('DB connection failed'));  // collision check repo 2

      const result = await RepositoriesIngestService.ingestRepositories(
        prisma as never,
        {
          repositories: [
            VALID_REPO,
            { ...VALID_REPO, githubId: 999999, slug: 'fail-repo' },
          ],
        },
      );

      expect(result.processed).toBe(2);
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].githubId).toBe(999999);
    });

    it('handles empty payload', async () => {
      const result = await RepositoriesIngestService.ingestRepositories(
        prisma as never,
        { repositories: [] },
      );

      expect(result.processed).toBe(0);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
    });
  });
});
