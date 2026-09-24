import { describe, expect, it } from 'vitest';
import { AI_TOOLS_DATA } from '../data/toolsData.js';
import { AI_MODELS_DATA } from '../data/modelsData.js';
import {
  buildLeaderboardView,
  createRequestGate,
  isToolEntity,
  matchesCategory,
  shouldCommitPerspectiveFetch,
  shouldCommitRequest
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
