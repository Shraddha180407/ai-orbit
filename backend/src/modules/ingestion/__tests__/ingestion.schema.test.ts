import { describe, it, expect } from 'vitest';
import { ingestionRunQuerySchema } from '../ingestion.schemas.js';
import { toolSchema, toolsIngestPayloadSchema } from '../tools.ingest.schema.js';
import { deviceSchema, devicesIngestPayloadSchema } from '../devices.ingest.schema.js';

describe('ingestionRunQuerySchema', () => {
  it('valid with all fields', () => {
    const result = ingestionRunQuerySchema.safeParse({
      sources: 'techcrunch,theverge',
      limit: '10',
      includeHackerNews: 'true',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sources).toBe('techcrunch,theverge');
      expect(result.data.limit).toBe(10);
      expect(result.data.includeHackerNews).toBe('true');
    }
  });

  it('valid empty', () => {
    const result = ingestionRunQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sources).toBeUndefined();
      expect(result.data.limit).toBe(5);
      expect(result.data.includeHackerNews).toBeUndefined();
    }
  });

  it('limit capped at 30', () => {
    const result = ingestionRunQuerySchema.safeParse({ limit: '50' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(30);
    }
  });

  it('limit clamps 0 to default 5 via fallback', () => {
    const result = ingestionRunQuerySchema.safeParse({ limit: '0' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(5);
    }
  });

  it('limit defaults to 5 when non-numeric', () => {
    const result = ingestionRunQuerySchema.safeParse({ limit: 'abc' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(5);
    }
  });
});

describe('toolSchema', () => {
  const validTool = {
    slug: 'test-tool',
    name: 'Test Tool',
    description: 'A test tool',
    websiteUrl: 'https://example.com',
    pricingModel: 'FREE',
    categories: [{ slug: 'ai', name: 'AI' }],
    tags: [{ slug: 'ml', name: 'ML' }],
  };

  it('valid with required fields', () => {
    const result = toolSchema.safeParse(validTool);
    expect(result.success).toBe(true);
  });

  it('valid with all optional fields', () => {
    const full = {
      ...validTool,
      logoUrl: 'https://logo.png',
      screenshots: ['https://s1.png'],
      features: ['Feature 1'],
      pros: ['Pro 1'],
      cons: ['Con 1'],
      releaseDate: '2024-01-01',
      pricingAmount: 29.99,
      billingFrequency: 'MONTHLY',
      isOpenSource: true,
      isTrending: true,
      verified: true,
      compatibility: ['WEB', 'WINDOWS'],
      targetUsers: ['DEVELOPERS'],
      hasApi: true,
      apiDocsUrl: 'https://docs.example.com',
      performanceScore: 85.5,
      company: { slug: 'acme', name: 'Acme', logoUrl: 'https://acme.com/logo.png' },
      integrations: [{ slug: 'slack', name: 'Slack', logoUrl: 'https://slack.com/logo.png' }],
    };
    const result = toolSchema.safeParse(full);
    expect(result.success).toBe(true);
  });

  it('invalid pricingModel fails', () => {
    const result = toolSchema.safeParse({ ...validTool, pricingModel: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('defaults applied for arrays', () => {
    const result = toolSchema.safeParse(validTool);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.screenshots).toEqual([]);
      expect(result.data.features).toEqual([]);
      expect(result.data.isOpenSource).toBe(false);
      expect(result.data.compatibility).toEqual([]);
    }
  });

  it('websiteUrl must be valid URL', () => {
    const result = toolSchema.safeParse({ ...validTool, websiteUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });
});

describe('toolsIngestPayloadSchema', () => {
  it('valid with tools array', () => {
    const result = toolsIngestPayloadSchema.safeParse({
      tools: [
        { slug: 'a', name: 'A', description: 'desc', websiteUrl: 'https://a.com', pricingModel: 'FREE' },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('empty tools array valid', () => {
    const result = toolsIngestPayloadSchema.safeParse({ tools: [] });
    expect(result.success).toBe(true);
  });
});

describe('deviceSchema', () => {
  const validDevice = {
    slug: 'device-1',
    name: 'Test Device',
    manufacturer: 'Acme',
    category: 'Robot',
    availability: 'Available',
    year: '2024',
    description: 'A test device',
    imageUrl: 'https://img.com/device.jpg',
    manufacturerLogoUrl: 'https://logo.com/m.png',
    mainTask: 'Assistance',
  };

  it('valid with required fields', () => {
    const result = deviceSchema.safeParse(validDevice);
    expect(result.success).toBe(true);
  });

  it('valid with all optional fields', () => {
    const full = {
      ...validDevice,
      price: '$999',
      month: '01',
      formFactor: 'Humanoid',
      country: 'US',
      ram: '16GB',
      aiFeatures: ['Vision', 'NLP'],
      primaryUseCases: ['Research'],
      additionalInfo: 'Extra info',
      buyUrl: 'https://buy.com/device',
      tasks: [{ slug: 'chat', title: 'Chat', description: 'Chat task', category: { slug: 'ai', name: 'AI' } }],
    };
    const result = deviceSchema.safeParse(full);
    expect(result.success).toBe(true);
  });

  it('invalid availability fails', () => {
    const result = deviceSchema.safeParse({ ...validDevice, availability: 'Invalid' });
    expect(result.success).toBe(false);
  });

  it('availability defaults to Announced when omitted', () => {
    const { availability: _, ...rest } = validDevice;
    const result = deviceSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.availability).toBe('Announced');
    }
  });

  it('imageUrl must be valid URL', () => {
    const result = deviceSchema.safeParse({ ...validDevice, imageUrl: 'not-a-url' });
    expect(result.success).toBe(false);
  });
});

describe('devicesIngestPayloadSchema', () => {
  it('valid with devices array', () => {
    const result = devicesIngestPayloadSchema.safeParse({
      devices: [
        {
          slug: 'd1', name: 'Device', manufacturer: 'Acme', category: 'Robot',
          year: '2024', description: 'desc', imageUrl: 'https://img.com/i.jpg',
          manufacturerLogoUrl: 'https://logo.com/l.png', mainTask: 'Task',
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it('empty devices array valid', () => {
    const result = devicesIngestPayloadSchema.safeParse({ devices: [] });
    expect(result.success).toBe(true);
  });
});
