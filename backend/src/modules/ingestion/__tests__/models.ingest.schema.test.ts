import { describe, it, expect } from 'vitest';
import { modelsIngestPayloadSchema, modelSchema } from '../models.ingest.schema.js';

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

describe('modelSchema', () => {
  it('validates a minimal model', () => {
    const result = modelSchema.safeParse(VALID_MODEL);
    expect(result.success).toBe(true);
  });

  it('validates model with all optional fields', () => {
    const result = modelSchema.safeParse({
      ...VALID_MODEL,
      websiteUrl: 'https://openai.com',
      documentation: [{ title: 'Docs', url: 'https://docs.openai.com' }],
      primaryTask: 'chat',
      modelType: 'MULTIMODAL',
      provider: { slug: 'openai', name: 'OpenAI', logoUrl: 'https://example.com/logo.png' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects model missing required fields', () => {
    const result = modelSchema.safeParse({ slug: 'test' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid modelType enum', () => {
    const result = modelSchema.safeParse({
      ...VALID_MODEL,
      modelType: 'INVALID_TYPE',
    });
    expect(result.success).toBe(false);
  });

  it('accepts null provider', () => {
    const result = modelSchema.safeParse({
      ...VALID_MODEL,
      provider: null,
    });
    expect(result.success).toBe(true);
  });

  it('accepts undefined provider', () => {
    const result = modelSchema.safeParse(VALID_MODEL);
    expect(result.success).toBe(true);
  });
});

describe('modelsIngestPayloadSchema', () => {
  it('validates payload with models', () => {
    const result = modelsIngestPayloadSchema.safeParse({ models: [VALID_MODEL] });
    expect(result.success).toBe(true);
  });

  it('rejects empty models array', () => {
    const result = modelsIngestPayloadSchema.safeParse({ models: [] });
    expect(result.success).toBe(false);
  });

  it('rejects payload exceeding max limit (100)', () => {
    const models = Array.from({ length: 101 }, (_, i) => ({
      ...VALID_MODEL,
      slug: `model-${i}`,
    }));
    const result = modelsIngestPayloadSchema.safeParse({ models });
    expect(result.success).toBe(false);
  });

  it('accepts payload at max limit (100)', () => {
    const models = Array.from({ length: 100 }, (_, i) => ({
      ...VALID_MODEL,
      slug: `model-${i}`,
    }));
    const result = modelsIngestPayloadSchema.safeParse({ models });
    expect(result.success).toBe(true);
  });

  it('rejects payload without models key', () => {
    const result = modelsIngestPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
