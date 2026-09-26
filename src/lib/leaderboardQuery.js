// Pure leaderboard query helpers: filtering, validation, and request-generation gating.
// Kept free of React so race-condition and filter-consistency behavior can be unit-tested.

export const DEFAULT_FILTERS = {
  perspective: 'overall',
  entityType: 'models',
  category: 'All',
  sortBy: 'rank'
};

/**
 * Serialize the perspective, entity type, and category for cache lookup.
 * Sorting does not affect which rows belong to the filter selection.
 */
export function computeFilterKey(filters) {
  return `${filters.perspective}|${filters.entityType}|${filters.category}`;
}


/**
 * Match a catalog category against a filter, including equivalent category labels.
 * An empty or "All" filter accepts every category.
 */
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

  // "Agents" pill must match both "AI Agents" AND "Automation" tool categories
  if (targetCatLower === 'agents' || targetCatLower === 'ai agents') {
    return itemCatLower.includes('agent') || itemCatLower.includes('automat');
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

export function isAgentEntity(item) {
  if (!item) return false;
  return item.entityType === 'agent' || item.type === 'agent';
}

export function isMCPEntity(item) {
  if (!item) return false;
  return item.entityType === 'mcp' || item.type === 'mcp';
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

export function selectBaseLists({ models, tools, agents = [], mcp = [], filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective);
  const perspectiveTools = applyPerspective(tools || [], filters.perspective);
  const perspectiveAgents = applyPerspective(agents || [], filters.perspective);
  const perspectiveMcps = applyPerspective(mcp || [], filters.perspective);

  if (filters.entityType === 'tools') {
    return perspectiveTools.filter(isToolEntity);
  }
  if (filters.entityType === 'models') {
    return perspectiveModels.filter((item) => !isToolEntity(item) && !isAgentEntity(item) && !isMCPEntity(item));
  }
  if (filters.entityType === 'agents') {
    const fromModels = perspectiveModels.filter(isAgentEntity);
    return (perspectiveAgents.length >= fromModels.length && perspectiveAgents.length > 0)
      ? perspectiveAgents
      : (fromModels.length > 0 ? fromModels : perspectiveAgents);
  }
  if (filters.entityType === 'mcp') {
    const fromModels = perspectiveModels.filter(isMCPEntity);
    return (perspectiveMcps.length >= fromModels.length && perspectiveMcps.length > 0)
      ? perspectiveMcps
      : (fromModels.length > 0 ? fromModels : perspectiveMcps);
  }

  const modelIds = new Set(perspectiveModels.map((m) => m.id));
  const extraTools = perspectiveTools.filter((t) => !modelIds.has(t.id));
  const extraAgents = perspectiveAgents.filter((a) => !modelIds.has(a.id));
  const extraMcps = perspectiveMcps.filter((c) => !modelIds.has(c.id));
  return [...perspectiveModels, ...extraTools, ...extraAgents, ...extraMcps];
}

export function computeEntityTypeCounts({ models, tools, agents = [], mcp = [], filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective).filter((item) => !isToolEntity(item) && !isAgentEntity(item) && !isMCPEntity(item));
  const perspectiveTools = applyPerspective(tools || [], filters.perspective).filter(isToolEntity);
  
  let perspectiveAgents = applyPerspective(agents && agents.length > 0 ? agents : models || [], filters.perspective);
  if (perspectiveAgents.length === 0 && agents.length > 0) {
    perspectiveAgents = applyPerspective(agents, filters.perspective);
  }

  let perspectiveMcps = applyPerspective(mcp && mcp.length > 0 ? mcp : models || [], filters.perspective);
  if (perspectiveMcps.length === 0 && mcp.length > 0) {
    perspectiveMcps = applyPerspective(mcp, filters.perspective);
  }

  const category = filters.category;
  const m = perspectiveModels.filter((item) => matchesCategory(item.category, category));
  const t = perspectiveTools.filter((item) => matchesCategory(item.category, category));
  const a = perspectiveAgents.filter((item) => matchesCategory(item.category, category));
  const c = perspectiveMcps.filter((item) => matchesCategory(item.category, category));

  return {
    all: m.length + t.length + a.length + c.length,
    models: m.length,
    tools: t.length,
    agents: a.length,
    mcp: c.length
  };
}

export function validateLeaderboardRows(rows, filters, { logInvalid = false } = {}) {
  const valid = [];
  const invalid = [];

  for (const row of rows) {
    let reason = null;
    if (filters.entityType === 'tools' && !isToolEntity(row)) {
      reason = 'entityType mismatch (expected tool)';
    } else if (filters.entityType === 'models' && (isToolEntity(row) || isAgentEntity(row) || isMCPEntity(row))) {
      reason = 'entityType mismatch (expected model)';
    } else if (filters.entityType === 'agents' && !isAgentEntity(row)) {
      reason = 'entityType mismatch (expected agent)';
    } else if (filters.entityType === 'mcp' && !isMCPEntity(row)) {
      reason = 'entityType mismatch (expected mcp)';
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

export function buildLeaderboardView({ models, tools, agents = [], mcp = [], filters, ready = true }) {
  if (!ready) {
    return {
      appliedFilters: { ...filters },
      rows: [],
      entityTypeCounts: { all: 0, models: 0, tools: 0, agents: 0, mcp: 0 },
      loading: true
    };
  }

  const base = selectBaseLists({ models, tools, agents, mcp, filters });
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
    entityTypeCounts: computeEntityTypeCounts({ models, tools, agents, mcp, filters }),
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
