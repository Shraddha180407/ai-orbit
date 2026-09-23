// Pure leaderboard query helpers: filtering, validation, and request-generation gating.
// Kept free of React so race-condition and filter-consistency behavior can be unit-tested.

export const DEFAULT_FILTERS = {
  perspective: 'overall',
  entityType: 'all',
  category: 'All',
  sortBy: 'rank'
};

export function matchesCategory(itemCategory, targetCategory) {
  if (!targetCategory || targetCategory === 'All') return true;
  if (!itemCategory) return false;

  const itemCatLower = String(itemCategory).toLowerCase().trim();
  const targetCatLower = String(targetCategory).toLowerCase().trim();

  if (itemCatLower === targetCatLower) return true;

  if (targetCatLower === 'chat' || targetCatLower === 'chatbot' || targetCatLower === 'chat / general llm') {
    return itemCatLower.includes('chat') || itemCatLower.includes('llm') || itemCatLower.includes('general');
  }

  if (targetCatLower === 'code' || targetCatLower === 'coding' || targetCatLower === 'code assistant' || targetCatLower === 'coding / developer') {
    return itemCatLower.includes('code') || itemCatLower.includes('coding') || itemCatLower.includes('developer');
  }

  if (targetCatLower === 'reasoning') {
    return itemCatLower.includes('reason');
  }

  if (targetCatLower === 'image' || targetCatLower === 'image generation') {
    return itemCatLower.includes('image');
  }

  if (targetCatLower === 'video' || targetCatLower === 'video editing') {
    return itemCatLower.includes('video');
  }

  if (targetCatLower === 'research') {
    return itemCatLower.includes('research');
  }

  if (targetCatLower === 'agents' || targetCatLower === 'ai agents') {
    return itemCatLower.includes('agent') || itemCatLower.includes('automation');
  }

  if (targetCatLower === 'audio' || targetCatLower === 'voice' || targetCatLower === 'audio / voice' || targetCatLower === 'voice / audio') {
    return itemCatLower.includes('audio') || itemCatLower.includes('voice');
  }

  return itemCatLower.includes(targetCatLower) || targetCatLower.includes(itemCatLower);
}

export function isToolEntity(item) {
  if (!item) return false;
  return item.entityType === 'tool' || item.type === 'tool';
}

export function isOpenWeightsItem(item) {
  if (!item) return false;
  if (item.isOpenWeights === true) return true;
  if (isToolEntity(item) && item.license && String(item.license).toLowerCase().includes('open')) {
    return true;
  }
  return false;
}

export function filtersMatch(a, b) {
  if (!a || !b) return false;
  return (
    a.perspective === b.perspective &&
    a.entityType === b.entityType &&
    a.category === b.category &&
    a.sortBy === b.sortBy
  );
}

export function createRequestGate() {
  let currentId = 0;
  return {
    start(filterSnapshot) {
      currentId += 1;
      return { requestId: currentId, filters: { ...filterSnapshot } };
    },
    isCurrent(requestId) {
      return requestId === currentId;
    },
    get currentId() {
      return currentId;
    }
  };
}

export function logLeaderboard(event, payload = {}) {
  const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
  if (!isDev) return;
  console.debug(`[Leaderboard] ${event}`, payload);
}

function applyPerspective(list, perspective) {
  if (perspective === 'open_weights') {
    return list.filter(isOpenWeightsItem);
  }
  return list;
}

function sortLeaderboard(list, sortBy) {
  const sorted = [...list];
  if (sortBy === 'visits') {
    sorted.sort((a, b) => (parseFloat(b.monthlyVisits) || b.votes || 0) - (parseFloat(a.monthlyVisits) || a.votes || 0));
  } else if (sortBy === 'growth') {
    sorted.sort((a, b) => {
      const deltaA = parseInt(String(a.rankDelta || '0').replace('+', ''), 10) || 0;
      const deltaB = parseInt(String(b.rankDelta || '0').replace('+', ''), 10) || 0;
      return deltaB - deltaA;
    });
  } else if (sortBy === 'newest') {
    sorted.sort((a, b) => String(b.id || '').localeCompare(String(a.id || '')));
  } else {
    sorted.sort((a, b) => (a.rank || 0) - (b.rank || 0));
  }
  return sorted;
}

export function selectBaseLists({ models, tools, filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective);
  const perspectiveTools = applyPerspective(tools || [], filters.perspective);

  if (filters.entityType === 'tools') {
    return perspectiveTools.filter(isToolEntity);
  }
  if (filters.entityType === 'models') {
    return perspectiveModels.filter((item) => !isToolEntity(item));
  }

  const modelIds = new Set(perspectiveModels.map((m) => m.id));
  const extraTools = perspectiveTools.filter((t) => !modelIds.has(t.id));
  return [...perspectiveModels, ...extraTools];
}

export function computeEntityTypeCounts({ models, tools, filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective).filter((item) => !isToolEntity(item));
  const perspectiveTools = applyPerspective(tools || [], filters.perspective).filter(isToolEntity);

  const category = filters.category;
  const m = perspectiveModels.filter((item) => matchesCategory(item.category, category));
  const t = perspectiveTools.filter((item) => matchesCategory(item.category, category));

  return {
    all: m.length + t.length,
    models: m.length,
    tools: t.length
  };
}

export function validateLeaderboardRows(rows, filters, { logInvalid = false } = {}) {
  const valid = [];
  const invalid = [];

  for (const row of rows) {
    let reason = null;
    if (filters.entityType === 'tools' && !isToolEntity(row)) {
      reason = 'entityType mismatch (expected tool)';
    } else if (filters.entityType === 'models' && isToolEntity(row)) {
      reason = 'entityType mismatch (expected model)';
    } else if (filters.category !== 'All' && !matchesCategory(row.category, filters.category)) {
      reason = `category mismatch (expected ${filters.category})`;
    }

    if (reason) {
      invalid.push({ row, reason });
    } else {
      valid.push(row);
    }
  }

  if (logInvalid && invalid.length > 0) {
    logLeaderboard('INVALID_ROWS_DROPPED', {
      filter: {
        perspective: filters.perspective,
        entityType: filters.entityType,
        modality: filters.category
      },
      dropped: invalid.map(({ row, reason }) => ({
        id: row?.id,
        name: row?.name,
        entityType: row?.entityType,
        category: row?.category,
        reason
      }))
    });
  }

  return valid;
}

export function buildLeaderboardView({ models, tools, filters, ready = true }) {
  if (!ready) {
    return {
      appliedFilters: { ...filters },
      rows: [],
      entityTypeCounts: { all: 0, models: 0, tools: 0 },
      loading: true
    };
  }

  const base = selectBaseLists({ models, tools, filters });
  const categoryFiltered = filters.category === 'All'
    ? base
    : base.filter((item) => matchesCategory(item.category, filters.category));

  const validated = validateLeaderboardRows(categoryFiltered, filters, { logInvalid: true });
  const sorted = sortLeaderboard(validated, filters.sortBy);
  const rows = sorted.map((item, index) => ({
    ...item,
    displayRank: index + 1
  }));

  return {
    appliedFilters: { ...filters },
    rows,
    entityTypeCounts: computeEntityTypeCounts({ models, tools, filters }),
    loading: false
  };
}

export function shouldCommitRequest({ requestId, requestFilters, currentId, currentFilters }) {
  if (requestId !== currentId) return false;
  if (!filtersMatch(requestFilters, currentFilters)) return false;
  return true;
}

export function shouldCommitPerspectiveFetch({ requestId, requestPerspective, currentId, currentPerspective }) {
  return requestId === currentId && requestPerspective === currentPerspective;
}
