import { describe, expect, it } from 'vitest';
import { AI_TOOLS_DATA } from '../data/toolsData.js';
import { AI_MODELS_DATA } from '../data/modelsData.js';
import { AI_AGENTS_DATA } from '../data/agentsData.js';
import { MCP_DATA } from '../data/mcpData.js';
import { COMPANIES_DATA } from '../data/companiesData.js';
import { ROBOTS_DATA } from '../data/robotsData.js';
import {
  buildLeaderboardView,
  createRequestGate,
  DEFAULT_FILTERS,
  isToolEntity,
  matchesCategory,
  parseMetricNumber,
  computePercentileRank,
  shouldCommitPerspectiveFetch,
  shouldCommitRequest,
  isVerifiedItem,
  VERIFIED_STATUSES,
  getItemAccessType,
  matchesAccess,
  matchesSearch,
  computeSearchRelevance,
  serializeFiltersToSearchParams,
  deserializeSearchParamsToFilters,
  computeSelfExcludingFacetCounts
} from './leaderboardQuery.js';

const models = [
  { id: 'claude', name: 'Claude', entityType: 'model', category: 'Chat / General LLM', rank: 1 },
  { id: 'gemini', name: 'Gemini', entityType: 'model', category: 'Reasoning', rank: 2 },
  { id: 'flux', name: 'Flux', entityType: 'model', category: 'Image', rank: 3 },
  { id: 'sora', name: 'Sora', entityType: 'model', category: 'Video', rank: 4 },
  { id: 'codex', name: 'Codex', entityType: 'model', category: 'Coding', rank: 5 }
];

const tools = [
  { id: 'midjourney', name: 'Midjourney', entityType: 'tool', category: 'Image Generation', rank: 1 },
  { id: 'krea', name: 'Krea', entityType: 'tool', category: 'Image Generation', rank: 2 },
  { id: 'heygen', name: 'HeyGen', entityType: 'tool', category: 'Video', rank: 3 },
  { id: 'synthesia', name: 'Synthesia', entityType: 'tool', category: 'Video', rank: 4 },
  { id: 'descript', name: 'Descript', entityType: 'tool', category: 'Video', rank: 5 },
  { id: 'continue-dev', name: 'Continue.dev', entityType: 'tool', category: 'Coding / Developer', rank: 6 },
  { id: 'bolt-new', name: 'Bolt.new', entityType: 'tool', category: 'Coding / Developer', rank: 7 }
];

function viewFor(filters) {
  return buildLeaderboardView({
    models,
    tools,
    filters: { perspective: 'overall', sortBy: 'rank', ...filters },
    ready: true
  });
}

describe('leaderboard filter consistency', () => {
  it('DEFAULT_FILTERS defaults to models entityType', () => {
    expect(DEFAULT_FILTERS.entityType).toBe('models');
    const view = viewFor(DEFAULT_FILTERS);
    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows.every((row) => row.entityType === 'model')).toBe(true);
    expect(view.rows.some(isToolEntity)).toBe(false);
  });

  it('Image + Tools returns only image tools', () => {
    const view = viewFor({ entityType: 'tools', category: 'Image' });
    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.every((row) => matchesCategory(row.category, 'Image'))).toBe(true);
    expect(view.rows.some((row) => /claude|gemini/i.test(row.name))).toBe(false);
    expect(view.entityTypeCounts.tools).toBe(view.rows.length);
    expect(view.entityTypeCounts.models).toBe(1);
  });

  it('Video + Tools returns only video tools', () => {
    const view = viewFor({ entityType: 'tools', category: 'Video' });
    expect(view.rows.map((r) => r.name)).toEqual(['HeyGen', 'Synthesia', 'Descript']);
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.every((row) => matchesCategory(row.category, 'Video'))).toBe(true);
    expect(view.entityTypeCounts.tools).toBe(3);
    expect(view.entityTypeCounts.models).toBe(1);
  });

  it('Models filter never returns tool rows', () => {
    const view = viewFor({ entityType: 'models', category: 'All' });
    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows.some(isToolEntity)).toBe(false);
    expect(view.rows.some((row) => /Continue\.dev|Bolt\.new/i.test(row.name))).toBe(false);
    expect(view.entityTypeCounts.tools).toBe(tools.length);
    expect(view.entityTypeCounts.models).toBe(view.rows.length);
  });

  it('Tools filter never returns model rows', () => {
    const view = viewFor({ entityType: 'tools', category: 'All' });
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.some((row) => row.entityType === 'model')).toBe(false);
    expect(view.entityTypeCounts.models).toBe(models.filter((m) => !isToolEntity(m)).length);
  });

  it('drops mismatched rows instead of converting them', () => {
    const view = buildLeaderboardView({
      models: [{ id: 'bad', name: 'Claude Haiku', entityType: 'model', category: 'Chat / General LLM', rank: 1 }],
      tools: [],
      filters: { perspective: 'overall', entityType: 'tools', category: 'Image', sortBy: 'rank' },
      ready: true
    });
    expect(view.rows).toEqual([]);
    expect(view.entityTypeCounts.tools).toBe(0);
  });

  it('not-ready views never keep previous rows', () => {
    const view = buildLeaderboardView({
      models,
      tools,
      filters: { perspective: 'speed', entityType: 'models', category: 'Image', sortBy: 'rank' },
      ready: false
    });
    expect(view.loading).toBe(true);
    expect(view.rows).toEqual([]);
  });
});

describe('asynchronous request gating', () => {
  /** Verify that a current request ID cannot override a changed category. */
  function rejectsMismatchedFilters() {
    const gate = createRequestGate();

    const requestFilters = {
      perspective: 'overall',
      entityType: 'models',
      category: 'Image',
      sortBy: 'rank'
    };

    const currentFilters = {
      perspective: 'overall',
      entityType: 'models',
      category: 'Video',
      sortBy: 'rank'
    };

    const request = gate.start(requestFilters);

    expect(shouldCommitRequest({
      requestId: request.requestId,
      requestFilters: request.filters,
      currentId: gate.currentId,
      currentFilters
    })).toBe(false);
  }
  it('rejects a request when its filters no longer match the current filters', rejectsMismatchedFilters);

  /** Verify that matching filters cannot make an older request current. */
  function ignoresOlderRequest() {
    const gate = createRequestGate();
    const matchingFilters = { perspective: 'overall', entityType: 'models', category: 'Image', sortBy: 'rank' };

    const older = gate.start(matchingFilters);
    const newer = gate.start(matchingFilters); // advances currentId

    // Newer request: same filters, same ID → should commit
    expect(shouldCommitRequest({
      requestId: newer.requestId,
      requestFilters: newer.filters,
      currentId: gate.currentId,
      currentFilters: matchingFilters
    })).toBe(true);

    // Older request: same filters, but stale ID → must NOT commit
    expect(shouldCommitRequest({
      requestId: older.requestId,
      requestFilters: older.filters,
      currentId: gate.currentId,
      currentFilters: matchingFilters
    })).toBe(false);
  }
  it('ignores an older request that resolves after a newer one', ignoresOlderRequest);

  it('rapid Image → Video → Code keeps only the final Code result', () => {
    const gate = createRequestGate();
    const sequence = ['Image', 'Video', 'Code'];
    const requests = sequence.map((category) => (
      gate.start({ perspective: 'overall', entityType: 'tools', category, sortBy: 'rank' })
    ));

    const committed = [];
    // Resolve out of order: Image, then Code, then Video
    [requests[0], requests[2], requests[1]].forEach((req) => {
      if (shouldCommitRequest({
        requestId: req.requestId,
        requestFilters: req.filters,
        currentId: gate.currentId,
        currentFilters: { perspective: 'overall', entityType: 'tools', category: 'Code', sortBy: 'rank' }
      })) {
        committed.push(req.filters.category);
      }
    });

    expect(committed).toEqual(['Code']);
    const finalView = viewFor({ entityType: 'tools', category: 'Code' });
    expect(finalView.rows.every((row) => matchesCategory(row.category, 'Code'))).toBe(true);
    expect(finalView.rows.every(isToolEntity)).toBe(true);
  });

  it('discards a slower perspective fetch that finishes after the latest one', () => {
    const gate = createRequestGate();
    const older = gate.start({ perspective: 'overall' });
    const newer = gate.start({ perspective: 'speed' });

    expect(shouldCommitPerspectiveFetch({
      requestId: newer.requestId,
      requestPerspective: 'speed',
      currentId: gate.currentId,
      currentPerspective: 'speed'
    })).toBe(true);

    expect(shouldCommitPerspectiveFetch({
      requestId: older.requestId,
      requestPerspective: 'overall',
      currentId: gate.currentId,
      currentPerspective: 'speed'
    })).toBe(false);
  });
});

describe('real dataset boundaries', () => {
  it('Image + Tools uses only image-generation tools from the catalog', () => {
    const view = buildLeaderboardView({
      models: AI_MODELS_DATA,
      tools: AI_TOOLS_DATA,
      filters: { perspective: 'overall', entityType: 'tools', category: 'Image', sortBy: 'rank' },
      ready: true
    });
    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.every((row) => matchesCategory(row.category, 'Image'))).toBe(true);
    expect(view.rows.some((row) => /claude|gemini/i.test(row.name))).toBe(false);
    expect(view.entityTypeCounts.tools).toBe(view.rows.length);
  });

  it('Video + Tools uses only video tools from the catalog', () => {
    const view = buildLeaderboardView({
      models: AI_MODELS_DATA,
      tools: AI_TOOLS_DATA,
      filters: { perspective: 'overall', entityType: 'tools', category: 'Video', sortBy: 'rank' },
      ready: true
    });
    const names = view.rows.map((row) => row.name);
    expect(names.some((name) => /heygen/i.test(name))).toBe(true);
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.every((row) => matchesCategory(row.category, 'Video'))).toBe(true);
    expect(view.rows.some((row) => /claude|gemini/i.test(row.name))).toBe(false);
  });

  it('Models view never includes catalog tools', () => {
    const view = buildLeaderboardView({
      models: AI_MODELS_DATA,
      tools: AI_TOOLS_DATA,
      filters: { perspective: 'overall', entityType: 'models', category: 'All', sortBy: 'rank' },
      ready: true
    });
    expect(view.rows.some(isToolEntity)).toBe(false);
    expect(view.rows.some((row) => /Continue\.dev|Bolt\.new|Cursor|Copilot/i.test(row.name))).toBe(false);
  });

  it('Tools view never includes foundation models', () => {
    const view = buildLeaderboardView({
      models: AI_MODELS_DATA,
      tools: AI_TOOLS_DATA,
      filters: { perspective: 'overall', entityType: 'tools', category: 'All', sortBy: 'rank' },
      ready: true
    });
    expect(view.rows.every(isToolEntity)).toBe(true);
    expect(view.rows.some((row) => /Claude Haiku|Claude|Gemini/i.test(row.name) && !isToolEntity(row))).toBe(false);
  });
});

describe('OrbitRank v3.0 metric parsing and ranking precision', () => {
  it('correctly parses various human-readable units into raw numerical magnitudes', () => {
    expect(parseMetricNumber('148.5M')).toBe(148500000);
    expect(parseMetricNumber('120k')).toBe(120000);
    expect(parseMetricNumber('1.2B')).toBe(1200000000);
    expect(parseMetricNumber('+54.2%')).toBe(54.2);
    expect(parseMetricNumber('12.4k sess')).toBe(12400);
    expect(parseMetricNumber('88 tok/s')).toBe(88);
    expect(parseMetricNumber('N/A')).toBe(0);
    expect(parseMetricNumber(null)).toBe(0);
    expect(parseMetricNumber(1250)).toBe(1250);
  });

  it('correctly sorts monthly visits using parsed numerical values (148.5M > 120k)', () => {
    const testItems = [
      { id: 'tool-k', name: 'Tool K', entityType: 'tool', monthlyVisits: '120k', rank: 1 },
      { id: 'tool-m', name: 'Tool M', entityType: 'tool', monthlyVisits: '148.5M', rank: 2 }
    ];
    const view = buildLeaderboardView({
      models: [],
      tools: testItems,
      filters: { perspective: 'overall', entityType: 'tools', category: 'All', sortBy: 'visits' },
      ready: true
    });
    // Tool M (148.5M) must rank higher than Tool K (120k)
    expect(view.rows[0].id).toBe('tool-m');
    expect(view.rows[1].id).toBe('tool-k');
  });

  it('calculates accurate domain percentiles within peer distributions', () => {
    const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    // 100 is at the top
    expect(computePercentileRank(values, 100)).toBe(95);
    // 50 is in the middle
    expect(computePercentileRank(values, 50)).toBe(45);
    // Edge case: empty values
    expect(computePercentileRank([], 50)).toBe(0);
  });

  it('augments rows with domainPercentile and domainType', () => {
    const view = buildLeaderboardView({
      models: AI_MODELS_DATA.slice(0, 10),
      tools: AI_TOOLS_DATA.slice(0, 10),
      agents: AI_AGENTS_DATA.slice(0, 10),
      mcp: MCP_DATA.slice(0, 10),
      filters: { perspective: 'overall', entityType: 'all', category: 'All', sortBy: 'rank' },
      ready: true
    });
    expect(view.rows.length).toBeGreaterThan(0);
    expect(view.rows.every((r) => typeof r.domainPercentile === 'number')).toBe(true);
    expect(view.rows.every((r) => ['model', 'tool', 'agent', 'mcp'].includes(r.domainType))).toBe(true);
  });
});

describe('Ecosystem dataset sizing, distinct entities and provenance verification', () => {
  it('meets target dataset sizes (500 models, 500 agents, 500 mcp, 500 tools, 150-200 companies, 50-75 robots)', () => {
    expect(AI_MODELS_DATA.length).toBeGreaterThanOrEqual(500);
    expect(AI_AGENTS_DATA.length).toBeGreaterThanOrEqual(500);
    expect(MCP_DATA.length).toBeGreaterThanOrEqual(500);
    expect(AI_TOOLS_DATA.length).toBeGreaterThanOrEqual(500);
    expect(COMPANIES_DATA.length).toBeGreaterThanOrEqual(150);
    expect(COMPANIES_DATA.length).toBeLessThanOrEqual(200);
    expect(ROBOTS_DATA.length).toBeGreaterThanOrEqual(50);
    expect(ROBOTS_DATA.length).toBeLessThanOrEqual(75);
  });

  it('ensures all agents are distinct entities with no duplicate IDs or slugs', () => {
    const seenIds = new Set();
    const seenSlugs = new Set();
    for (const agent of AI_AGENTS_DATA) {
      expect(seenIds.has(agent.id)).toBe(false);
      expect(seenSlugs.has(agent.slug)).toBe(false);
      seenIds.add(agent.id);
      seenSlugs.add(agent.slug);
    }
  });

  it('ensures each entity has valid provenance fields (source, sourceUrl, lastVerifiedAt)', () => {
    const datasets = [AI_MODELS_DATA, AI_AGENTS_DATA, MCP_DATA, AI_TOOLS_DATA, COMPANIES_DATA, ROBOTS_DATA];
    for (const data of datasets) {
      for (const item of data.slice(0, 20)) {
        expect(typeof item.source).toBe('string');
        expect(item.source.length).toBeGreaterThan(0);
        expect(typeof item.sourceUrl).toBe('string');
        expect(item.sourceUrl.startsWith('http')).toBe(true);
        expect(typeof item.lastVerifiedAt).toBe('string');
      }
    }
  });

  it('enforces strict no-synthetic-benchmark policy: models without Arena Elo retain arenaElo = null', () => {
    const mediaModels = AI_MODELS_DATA.filter((m) => m.category === 'Image' || m.category === 'Video');
    expect(mediaModels.length).toBeGreaterThan(0);
    // Verified: Image and video models do not have fabricated Arena Elo ratings
    expect(mediaModels.every((m) => m.arenaElo === null)).toBe(true);
  });
});

describe('Multi-Faceted Filter System v3.2 Architecture', () => {
  it('strict provenance checking: does not promote items without valid verificationStatus enum', () => {
    // Incomplete provenance: has source and date, but invalid / missing verificationStatus
    const incompleteItem = {
      id: 'incomplete-1',
      name: 'Test Model',
      source: 'Some Blog',
      lastVerifiedAt: '2026-10-01T00:00:00Z'
    };
    expect(isVerifiedItem(incompleteItem)).toBe(false);

    // Valid canonical verification statuses
    VERIFIED_STATUSES.forEach((status) => {
      expect(isVerifiedItem({ id: 'item', verificationStatus: status })).toBe(true);
    });

    // Unrecognized status
    expect(isVerifiedItem({ id: 'item', verificationStatus: 'community_upvote' })).toBe(false);
  });

  it('access classification: correctly handles open_weights, api, proprietary, hybrid, and unknown', () => {
    expect(getItemAccessType({ accessType: 'open_weights' })).toBe('open_weights');
    expect(getItemAccessType({ accessType: 'api' })).toBe('api');
    expect(getItemAccessType({ accessType: 'proprietary' })).toBe('proprietary');
    expect(getItemAccessType({ accessType: 'hybrid' })).toBe('hybrid');
    expect(getItemAccessType({ accessType: 'unknown' })).toBe('unknown');
    expect(getItemAccessType({ isOpenWeights: true })).toBe('open_weights');
    expect(getItemAccessType({ isOpenWeights: false })).toBe('proprietary');
    expect(getItemAccessType({})).toBe('unknown');

    // Hybrid access matches both open_weights and api filters
    const hybridItem = { id: 'h1', accessType: 'hybrid' };
    expect(matchesAccess(hybridItem, 'open_weights')).toBe(true);
    expect(matchesAccess(hybridItem, 'api')).toBe(true);
    expect(matchesAccess(hybridItem, 'hybrid')).toBe(true);
    expect(matchesAccess(hybridItem, 'proprietary')).toBe(false);

    // Pure API does not match open_weights
    const apiItem = { id: 'a1', accessType: 'api' };
    expect(matchesAccess(apiItem, 'open_weights')).toBe(false);
    expect(matchesAccess(apiItem, 'api')).toBe(true);
  });

  it('entity-aware filter bypass: accessFilter does not filter out companies to zero', () => {
    const testCompanies = [
      { id: 'c1', name: 'OpenAI', entityType: 'company', category: 'Foundation Models', rank: 1 },
      { id: 'c2', name: 'Anthropic', entityType: 'company', category: 'Foundation Models', rank: 2 }
    ];

    // matchesAccess returns true for company entities regardless of accessFilter
    expect(matchesAccess(testCompanies[0], 'open_weights')).toBe(true);
    expect(matchesAccess(testCompanies[0], 'api')).toBe(true);

    const view = buildLeaderboardView({
      models: [],
      tools: [],
      companies: testCompanies,
      filters: { ...DEFAULT_FILTERS, entityType: 'companies', accessFilter: 'open_weights' },
      ready: true
    });

    expect(view.rows.length).toBe(2);
    expect(view.rows.map((r) => r.name)).toEqual(['OpenAI', 'Anthropic']);
  });

  it('search filter preserves OrbitRank order and only uses search relevance as a tie-breaker', () => {
    const testModels = [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', entityType: 'model', category: 'Chat', rank: 1, tags: ['claude'] },
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', entityType: 'model', category: 'Chat', rank: 2, tags: ['claude'] },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', entityType: 'model', category: 'Chat', rank: 3, tags: ['claude'] },
      { id: 'gpt-4o', name: 'GPT-4o', entityType: 'model', category: 'Chat', rank: 4, tags: ['openai'] }
    ];

    const view = buildLeaderboardView({
      models: testModels,
      tools: [],
      filters: { ...DEFAULT_FILTERS, searchQuery: 'claude' },
      ready: true
    });

    // Should filter out GPT-4o, but retain Opus #1, Sonnet #2, Haiku #3 based on rank
    expect(view.rows.map((r) => r.name)).toEqual(['Claude 3 Opus', 'Claude 3.5 Sonnet', 'Claude 3 Haiku']);

    // Tie-breaker check: when two items share the exact same rank, exact title match wins
    const tiedModels = [
      { id: 'm1', name: 'Claude Extended Edition', entityType: 'model', category: 'Chat', rank: 1 },
      { id: 'm2', name: 'Claude', entityType: 'model', category: 'Chat', rank: 1 }
    ];
    const tiedView = buildLeaderboardView({
      models: tiedModels,
      tools: [],
      filters: { ...DEFAULT_FILTERS, searchQuery: 'claude' },
      ready: true
    });
    // 'Claude' has higher exact-match relevance score (100) than 'Claude Extended Edition' (80)
    expect(tiedView.rows[0].name).toBe('Claude');
  });

  it('self-excluding facet counts: does not zero-out candidate counts for unselected options', () => {
    const testModels = [
      { id: 'm1', name: 'Model Open', entityType: 'model', category: 'Code', accessType: 'open_weights', rank: 1 },
      { id: 'm2', name: 'Model API', entityType: 'model', category: 'Code', accessType: 'api', rank: 2 },
      { id: 'm3', name: 'Model Prop', entityType: 'model', category: 'Code', accessType: 'proprietary', rank: 3 }
    ];

    // When accessFilter is 'open_weights', the self-excluding counts for 'api' and 'proprietary'
    // reflect the pool available if that facet changes (i.e. not 0)
    const view = buildLeaderboardView({
      models: testModels,
      tools: [],
      filters: { ...DEFAULT_FILTERS, category: 'Code', accessFilter: 'open_weights' },
      ready: true
    });

    expect(view.rows.length).toBe(1);
    expect(view.facetCounts.accessCounts.open_weights).toBe(1);
    expect(view.facetCounts.accessCounts.api).toBe(1);
    expect(view.facetCounts.accessCounts.proprietary).toBe(1);
    expect(view.facetCounts.accessCounts.all).toBe(3);
  });

  it('canonical URL serialization round-trip preserves state and produces clean URLs for defaults', () => {
    // 1. Defaults serialize to empty URLSearchParams
    const defaultParams = serializeFiltersToSearchParams(DEFAULT_FILTERS);
    expect(defaultParams.toString()).toBe('');

    // 2. Deserializing empty params returns defaults
    const deserializedDefaults = deserializeSearchParamsToFilters(new URLSearchParams());
    expect(deserializedDefaults).toEqual(DEFAULT_FILTERS);

    // 3. Custom non-default filters round-trip identically
    const customFilters = {
      perspective: 'risers',
      entityType: 'agents',
      category: 'Code',
      searchQuery: 'claude',
      accessFilter: 'open_weights',
      verificationFilter: 'verified_only',
      providerFilter: 'Anthropic',
      sortBy: 'growth'
    };

    const serialized = serializeFiltersToSearchParams(customFilters);
    expect(serialized.get('type')).toBe('agents');
    expect(serialized.get('category')).toBe('Code');
    expect(serialized.get('q')).toBe('claude');
    expect(serialized.get('access')).toBe('open_weights');
    expect(serialized.get('verified')).toBe('1');
    expect(serialized.get('provider')).toBe('Anthropic');
    expect(serialized.get('perspective')).toBe('risers');
    expect(serialized.get('sort')).toBe('growth');

    const roundtrip = deserializeSearchParamsToFilters(serialized);
    expect(roundtrip).toEqual(customFilters);
  });

  it('strict end-of-pipeline pagination: filters entire dataset first, then slices visible page', () => {
    // Create 150 items, 100 of which match category 'Code'
    const largeDataset = Array.from({ length: 150 }, (_, i) => ({
      id: `model-${i}`,
      name: `Model ${i}`,
      entityType: 'model',
      category: i < 100 ? 'Code' : 'Chat',
      rank: i + 1
    }));

    const view = buildLeaderboardView({
      models: largeDataset,
      tools: [],
      filters: { ...DEFAULT_FILTERS, category: 'Code' },
      ready: true
    });

    // All 100 matching rows are in view.rows (not pre-sliced)
    expect(view.rows.length).toBe(100);

    // Progressive pagination takes the first 50 from the 100 matched rows
    const page1 = view.rows.slice(0, 50);
    expect(page1.length).toBe(50);
    expect(page1[0].id).toBe('model-0');
    expect(page1[49].id).toBe('model-49');
  });
});

