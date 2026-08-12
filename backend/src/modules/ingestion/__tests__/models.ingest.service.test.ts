import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModelsIngestService } from '../models.ingest.service.js';

function createMockPrisma() {
  const mockCompany = {
    upsert: vi.fn().mockResolvedValue({ id: 'company-1', slug: 'test-provider' }),
  };

  const mockAIModel = {
    findMany: vi.fn().mockResolvedValue([]),
    upsert: vi.fn().mockResolvedValue({ id: 'model-1', slug: 'test-model' }),
  };

  const mockTx = {
    company: mockCompany,
    aIModel: mockAIModel,
  };

  const mockTransaction = vi.fn(async (fn: (tx: typeof mockTx) => Promise<unknown>) => {
    return fn(mockTx);
  });

  return {
    company: mockCompany,
    aIModel: mockAIModel,
    $transaction: mockTransaction,
    _tx: mockTx,
  };
}

const VALID_MODEL = {
  slug: 'gpt-4o',
  name: 'GPT-4o',
  creator: 'OpenAI',
  contextWindow: '128000',
  parameterSize: 'unknown',
  modality: 'multimodal',
  releaseDate: '2024-05-13',
  description: 'GPT-4o is OpenAI\'s most capable model.',
  capabilities: ['text', 'vision'],
  apiAvailable: true,
  promptExamples: ['What is AI?'],
  openSource: false,
};

const VALID_MODEL_WITH_PROVIDER = {
  ...VALID_MODEL,
  provider: {
    slug: 'openai',
    name: 'OpenAI',
    logoUrl: 'https://example.com/openai.png',
  },
};

describe('ModelsIngestService', () => {
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
    vi.clearAllMocks();
  });

  describe('ingestModels', () => {
    it('creates a new model', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL] },
      );

      expect(result.processed).toBe(1);
      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(prisma.aIModel.upsert).toHaveBeenCalledOnce();
    });

    it('updates an existing model', async () => {
      prisma.aIModel.findMany.mockResolvedValue([{ slug: 'gpt-4o' }]);

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL] },
      );

      expect(result.processed).toBe(1);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('handles model with provider', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert.mockResolvedValue({ id: 'company-openai', slug: 'openai' });

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL_WITH_PROVIDER] },
      );

      expect(result.processed).toBe(1);
      expect(result.created).toBe(1);
      expect(prisma.company.upsert).toHaveBeenCalledOnce();
      expect(prisma.company.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { slug: 'openai' } }),
      );
      expect(prisma.aIModel.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ providerId: 'company-openai' }),
        }),
      );
    });

    it('handles model without provider', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL] },
      );

      expect(result.processed).toBe(1);
      expect(prisma.company.upsert).not.toHaveBeenCalled();
      expect(prisma.aIModel.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ providerId: null }),
        }),
      );
    });

    it('deduplicates provider upserts for multiple models with same provider', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert.mockResolvedValue({ id: 'company-openai', slug: 'openai' });

      const model1 = { ...VALID_MODEL, slug: 'gpt-4o' };
      const model2 = { ...VALID_MODEL, slug: 'gpt-4o-mini', name: 'GPT-4o Mini' };
      const model3 = { ...VALID_MODEL, slug: 'o1', name: 'o1' };

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...model1, provider: { slug: 'openai', name: 'OpenAI' } },
            { ...model2, provider: { slug: 'openai', name: 'OpenAI' } },
            { ...model3, provider: { slug: 'openai', name: 'OpenAI' } },
          ],
        },
      );

      expect(result.processed).toBe(3);
      expect(result.created).toBe(3);
      expect(prisma.company.upsert).toHaveBeenCalledTimes(1);
      expect(prisma.aIModel.upsert).toHaveBeenCalledTimes(3);
    });

    it('handles multiple providers', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert
        .mockResolvedValueOnce({ id: 'company-openai', slug: 'openai' })
        .mockResolvedValueOnce({ id: 'company-anthropic', slug: 'anthropic' });

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...VALID_MODEL, slug: 'gpt-4o', provider: { slug: 'openai', name: 'OpenAI' } },
            { ...VALID_MODEL, slug: 'claude-3', name: 'Claude 3', provider: { slug: 'anthropic', name: 'Anthropic' } },
          ],
        },
      );

      expect(result.processed).toBe(2);
      expect(result.created).toBe(2);
      expect(prisma.company.upsert).toHaveBeenCalledTimes(2);
    });

    it('handles duplicate slugs in payload', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...VALID_MODEL, slug: 'gpt-4o' },
            { ...VALID_MODEL, slug: 'gpt-4o' },
          ],
        },
      );

      // Both are processed (upsert handles dedup at DB level)
      expect(result.processed).toBe(2);
      expect(result.created).toBe(2);
      expect(prisma.aIModel.upsert).toHaveBeenCalledTimes(2);
    });

    it('handles mixed created and updated models', async () => {
      prisma.aIModel.findMany.mockResolvedValue([{ slug: 'gpt-4o' }]);

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...VALID_MODEL, slug: 'gpt-4o' },
            { ...VALID_MODEL, slug: 'claude-3', name: 'Claude 3' },
          ],
        },
      );

      expect(result.processed).toBe(2);
      expect(result.created).toBe(1);
      expect(result.updated).toBe(1);
    });

    it('records errors and continues processing other chunks', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);

      // Transaction fails on the second model — entire chunk rolls back
      prisma.aIModel.upsert
        .mockResolvedValueOnce({ id: 'm1', slug: 'model-1' })
        .mockRejectedValueOnce(new Error('DB write failed'));

      const models = [
        VALID_MODEL,
        { ...VALID_MODEL, slug: 'model-fail', name: 'Fail Model' },
        { ...VALID_MODEL, slug: 'model-3', name: 'Model 3' },
      ];

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models },
      );

      // All 3 models were attempted (processed=3).
      // Transaction rolled back, so created=0, updated=0.
      // All 3 models recorded as errors (entire chunk rolled back).
      expect(result.processed).toBe(3);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0].slug).toBe('gpt-4o');
      expect(result.errors[1].slug).toBe('model-fail');
      expect(result.errors[2].slug).toBe('model-3');
    });

    it('handles empty payload', async () => {
      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [] },
      );

      expect(result.processed).toBe(0);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(prisma.aIModel.upsert).not.toHaveBeenCalled();
    });

    it('gracefully handles provider upsert failure — records model as error', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert.mockRejectedValue(new Error('Provider DB error'));

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL_WITH_PROVIDER] },
      );

      // Model should NOT be processed — provider failed, so it's recorded
      // as an error and never reaches the transaction.
      expect(result.processed).toBe(0);
      expect(result.created).toBe(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].slug).toBe('gpt-4o');
      expect(result.errors[0].message).toContain('Provider DB error');
      expect(prisma.aIModel.upsert).not.toHaveBeenCalled();
    });

    it('continues processing when one provider fails but others succeed', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert
        .mockRejectedValueOnce(new Error('Provider DB error'))
        .mockResolvedValueOnce({ id: 'company-anthropic', slug: 'anthropic' });

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...VALID_MODEL, slug: 'gpt-4o', provider: { slug: 'openai', name: 'OpenAI' } },
            { ...VALID_MODEL, slug: 'claude-3', name: 'Claude 3', provider: { slug: 'anthropic', name: 'Anthropic' } },
          ],
        },
      );

      // OpenAI model failed (provider upsert error), Anthropic model succeeded
      expect(result.processed).toBe(1);
      expect(result.created).toBe(1);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].slug).toBe('gpt-4o');
    });

    it('handles findMany failure — fails entire chunk', async () => {
      prisma.aIModel.findMany.mockRejectedValue(new Error('DB read timeout'));

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [VALID_MODEL, { ...VALID_MODEL, slug: 'model-2', name: 'Model 2' }] },
      );

      // Both models in chunk recorded as errors, nothing created/updated
      expect(result.processed).toBe(2);
      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].slug).toBe('gpt-4o');
      expect(result.errors[1].slug).toBe('model-2');
      expect(prisma.aIModel.upsert).not.toHaveBeenCalled();
    });

    it('processes large batch (100 models) in chunks', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.aIModel.upsert.mockResolvedValue({ id: 'm', slug: 'm' });

      const models = Array.from({ length: 100 }, (_, i) => ({
        ...VALID_MODEL,
        slug: `model-${i}`,
        name: `Model ${i}`,
      }));

      const result = await ModelsIngestService.ingestModels(
        prisma as never,
        { models },
      );

      expect(result.processed).toBe(100);
      expect(result.created).toBe(100);
      expect(result.errors).toHaveLength(0);
      // 100 models / 50 chunk size = 2 transactions
      expect(prisma.$transaction).toHaveBeenCalledTimes(2);
      // 100 upserts total
      expect(prisma.aIModel.upsert).toHaveBeenCalledTimes(100);
      // 2 findMany calls (one per chunk)
      expect(prisma.aIModel.findMany).toHaveBeenCalledTimes(2);
    });

    it('preserves all model fields in upsert', async () => {
      prisma.aIModel.findMany.mockResolvedValue([]);
      prisma.company.upsert.mockResolvedValue({ id: 'c1', slug: 'openai' });

      const modelWithAllFields = {
        ...VALID_MODEL_WITH_PROVIDER,
        websiteUrl: 'https://openai.com',
        documentation: [{ title: 'Docs', url: 'https://docs.openai.com' }],
        primaryTask: 'chat',
        modelType: 'MULTIMODAL' as const,
      };

      await ModelsIngestService.ingestModels(
        prisma as never,
        { models: [modelWithAllFields] },
      );

      expect(prisma.aIModel.upsert).toHaveBeenCalledWith({
        where: { slug: 'gpt-4o' },
        create: {
          slug: 'gpt-4o',
          name: 'GPT-4o',
          creator: 'OpenAI',
          contextWindow: '128000',
          parameterSize: 'unknown',
          modality: 'multimodal',
          releaseDate: '2024-05-13',
          description: "GPT-4o is OpenAI's most capable model.",
          websiteUrl: 'https://openai.com',
          capabilities: ['text', 'vision'],
          apiAvailable: true,
          documentation: [{ title: 'Docs', url: 'https://docs.openai.com' }],
          promptExamples: ['What is AI?'],
          openSource: false,
          primaryTask: 'chat',
          modelType: 'MULTIMODAL',
          providerId: 'c1',
        },
        update: {
          name: 'GPT-4o',
          creator: 'OpenAI',
          contextWindow: '128000',
          parameterSize: 'unknown',
          modality: 'multimodal',
          releaseDate: '2024-05-13',
          description: "GPT-4o is OpenAI's most capable model.",
          websiteUrl: 'https://openai.com',
          capabilities: ['text', 'vision'],
          apiAvailable: true,
          documentation: [{ title: 'Docs', url: 'https://docs.openai.com' }],
          promptExamples: ['What is AI?'],
          openSource: false,
          primaryTask: 'chat',
          modelType: 'MULTIMODAL',
          providerId: 'c1',
        },
      });
    });

    it('uses findMany for batch existence check instead of per-model findUnique', async () => {
      prisma.aIModel.findMany.mockResolvedValue([{ slug: 'existing-1' }]);

      await ModelsIngestService.ingestModels(
        prisma as never,
        {
          models: [
            { ...VALID_MODEL, slug: 'existing-1' },
            { ...VALID_MODEL, slug: 'new-1', name: 'New Model' },
          ],
        },
      );

      // Should use findMany (batch query) not findUnique (per-model query)
      expect(prisma.aIModel.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.aIModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: { in: ['existing-1', 'new-1'] } },
          select: { slug: true },
        }),
      );
    });
  });
});
