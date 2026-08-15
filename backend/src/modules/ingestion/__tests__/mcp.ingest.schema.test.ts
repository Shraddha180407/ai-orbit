import { describe, it, expect } from 'vitest';
import { mcpItemSchema, mcpIngestPayloadSchema } from '../mcp.ingest.schema.js';

describe('mcpItemSchema', () => {
  const validItem = {
    itemType: 'SERVER',
    name: 'Test MCP Item',
    slug: 'test-mcp-item',
    shortDescription: 'A test MCP item',
    fullDescription: 'Full description',
    providerName: 'Test Provider',
    pricingType: 'FREE',
    categories: [{ slug: 'mcp-servers', name: 'MCP Servers' }],
    tags: [{ slug: 'open-source', name: 'Open Source' }],
  };

  it('validates required fields', () => {
    const result = mcpItemSchema.safeParse(validItem);
    expect(result.success).toBe(true);
  });

  it('accepts optional fields', () => {
    const result = mcpItemSchema.safeParse({
      ...validItem,
      logoUrl: 'https://example.com/logo.png',
      pricingPlans: [{ planName: 'Basic', price: 0, billingCycle: 'MONTHLY', featuresList: [] }],
      technicalSpecs: [{ supportedPlatforms: ['WEB'], compatibility: 'Web', integrations: ['API'], localBindingControls: 'None' }],
      installationGuides: [{ stepNumber: 1, title: 'Install', codeSnippet: 'npm install', instructions: 'Install it' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid enums', () => {
    const result = mcpItemSchema.safeParse({
      ...validItem,
      itemType: 'INVALID',
    });
    expect(result.success).toBe(false);
  });
});

describe('mcpIngestPayloadSchema', () => {
  it('validates payload structure', () => {
    const result = mcpIngestPayloadSchema.safeParse({ items: [{
      itemType: 'CLIENT',
      name: 'Client MCP',
      slug: 'client-mcp',
      shortDescription: 'Description',
      fullDescription: 'Full description',
      providerName: 'Provider',
      pricingType: 'PAID',
      categories: [],
      tags: [],
    }] });
    expect(result.success).toBe(true);
  });

  it('rejects payload without items', () => {
    const result = mcpIngestPayloadSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
