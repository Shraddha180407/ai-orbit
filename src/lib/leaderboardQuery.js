// Pure leaderboard query helpers: filtering, validation, and request-generation gating.
// Kept free of React so race-condition and filter-consistency behavior can be unit-tested.

export const DEFAULT_FILTERS = {
  perspective: 'overall',
  entityType: 'models',
  category: 'All',
  searchQuery: '',
  accessFilter: 'all',
  verificationFilter: 'all',
  providerFilter: 'all',
  sortBy: 'rank'
};

export const VERIFIED_STATUSES = new Set([
  'official_benchmark',
  'official_registry',
  'independent_audit',
  'curated_directory'
]);

export function isVerifiedItem(item) {
  return Boolean(
    item &&
    typeof item.verificationStatus === 'string' &&
    VERIFIED_STATUSES.has(item.verificationStatus)
  );
}

export const ACCESS_TYPES = ['all', 'open_weights', 'api', 'proprietary', 'hybrid', 'unknown'];

export function getItemAccessType(item) {
  if (!item) return 'unknown';
  if (item.accessType) return item.accessType;
  if (item.isOpenWeights === true) return 'open_weights';
  if (item.isOpenWeights === false) return 'proprietary';
  return 'unknown';
}

export function matchesAccess(item, targetAccess) {
  if (!targetAccess || targetAccess === 'all') return true;
  // Entity-aware bypass: if entity is a company, access filtering is not applicable
  if (isCompanyEntity(item)) return true;

  const access = getItemAccessType(item);
  if (targetAccess === 'hybrid') {
    return access === 'hybrid';
  }
  if (targetAccess === 'open_weights') {
    return access === 'open_weights' || access === 'hybrid';
  }
  if (targetAccess === 'api') {
    return access === 'api' || access === 'hybrid';
  }
  if (targetAccess === 'proprietary') {
    return access === 'proprietary';
  }
  return access === targetAccess;
}

export function matchesVerification(item, targetVerification) {
  if (!targetVerification || targetVerification === 'all') return true;
  if (targetVerification === 'verified_only' || targetVerification === '1' || targetVerification === true) {
    return isVerifiedItem(item);
  }
  return true;
}

export function matchesProvider(item, targetProvider) {
  if (!targetProvider || targetProvider === 'all') return true;
  const p = String(targetProvider).toLowerCase().trim();
  const itemProvider = String(item.provider || item.org || '').toLowerCase().trim();
  return itemProvider === p;
}

export function matchesSearch(item, query) {
  if (!query || !String(query).trim()) return true;
  const q = String(query).trim().toLowerCase();
  const name = String(item.name || '').toLowerCase();
  const provider = String(item.provider || item.org || '').toLowerCase();
  const cat = String(item.category || '').toLowerCase();
  const desc = String(item.shortDescription || item.description || '').toLowerCase();
  const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';

  return name.includes(q) || provider.includes(q) || cat.includes(q) || desc.includes(q) || tags.includes(q);
}

export function computeSearchRelevance(item, query) {
  if (!query || !String(query).trim()) return 0;
  const q = String(query).trim().toLowerCase();
  const name = String(item.name || '').toLowerCase();
  const provider = String(item.provider || item.org || '').toLowerCase();

  if (name === q) return 100;
  if (name.startsWith(q)) return 80;
  if (name.includes(q)) return 50;
  if (provider.includes(q)) return 30;
  return 10;
}

export const URL_PARAM_MAP = {
  entityType: 'type',
  category: 'category',
  searchQuery: 'q',
  accessFilter: 'access',
  verificationFilter: 'verified',
  providerFilter: 'provider',
  perspective: 'perspective',
  sortBy: 'sort'
};

export const REVERSE_URL_PARAM_MAP = Object.entries(URL_PARAM_MAP).reduce((acc, [k, v]) => {
  acc[v] = k;
  return acc;
}, {});

export function serializeFiltersToSearchParams(filters) {
  const params = new URLSearchParams();
  for (const [filterKey, paramKey] of Object.entries(URL_PARAM_MAP)) {
    const val = filters[filterKey];
    const defaultVal = DEFAULT_FILTERS[filterKey];
    if (val !== undefined && val !== null && val !== defaultVal && String(val).trim() !== '') {
      if (filterKey === 'verificationFilter' && val === 'verified_only') {
        params.set(paramKey, '1');
      } else {
        params.set(paramKey, String(val));
      }
    }
  }
  return params;
}

export function deserializeSearchParamsToFilters(searchParams) {
  const result = { ...DEFAULT_FILTERS };
  if (!searchParams) return result;
  
  const sp = typeof searchParams.get === 'function' 
    ? searchParams 
    : new URLSearchParams(typeof searchParams === 'string' ? searchParams : Object.entries(searchParams));

  for (const [paramKey, filterKey] of Object.entries(REVERSE_URL_PARAM_MAP)) {
    if (sp.has(paramKey)) {
      const val = sp.get(paramKey);
      if (filterKey === 'verificationFilter') {
        result[filterKey] = (val === '1' || val === 'verified_only') ? 'verified_only' : 'all';
      } else {
        result[filterKey] = val;
      }
    }
  }
  return result;
}

/**
 * Serialize filter state for cache lookup.
 */
export function computeFilterKey(filters) {
  return [
    filters.perspective || 'overall',
    filters.entityType || 'models',
    filters.category || 'All',
    filters.searchQuery || '',
    filters.accessFilter || 'all',
    filters.verificationFilter || 'all',
    filters.providerFilter || 'all',
    filters.sortBy || 'rank'
  ].join('|');
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

  if (targetCatLower === 'code' || targetCatLower === 'coding' || targetCatLower === 'code assistant' || targetCatLower === 'coding / developer' || targetCatLower === 'code & ide') {
    return itemCatLower.includes('code') || itemCatLower.includes('coding') || itemCatLower.includes('developer');
  }

  if (targetCatLower === 'reasoning') {
    return itemCatLower.includes('reason');
  }

  if (targetCatLower === 'image' || targetCatLower === 'image generation' || targetCatLower === 'vision & design') {
    return itemCatLower.includes('image') || itemCatLower.includes('vision') || itemCatLower.includes('design');
  }

  if (targetCatLower === 'video' || targetCatLower === 'video editing' || targetCatLower === 'creative & video ai') {
    return itemCatLower.includes('video') || itemCatLower.includes('creative');
  }

  if (targetCatLower === 'research') {
    return itemCatLower.includes('research');
  }

  // "Agents" pill must match both "AI Agents" AND "Automation" tool categories
  if (targetCatLower === 'agents' || targetCatLower === 'ai agents' || targetCatLower === 'browser & workflow' || targetCatLower === 'multi-agent') {
    return itemCatLower.includes('agent') || itemCatLower.includes('automat') || itemCatLower.includes('workflow');
  }

  if (targetCatLower === 'audio' || targetCatLower === 'voice' || targetCatLower === 'audio / voice' || targetCatLower === 'voice / audio' || targetCatLower === 'audio & speech') {
    return itemCatLower.includes('audio') || itemCatLower.includes('voice') || itemCatLower.includes('speech');
  }

  if (targetCatLower === 'search & knowledge' || targetCatLower === 'ai search & assistants') {
    return itemCatLower.includes('search') || itemCatLower.includes('knowledge') || itemCatLower.includes('assistant');
  }

  if (targetCatLower === 'devops & cloud') {
    return itemCatLower.includes('devops') || itemCatLower.includes('cloud') || itemCatLower.includes('infra');
  }

  if (targetCatLower === 'databases & storage') {
    return itemCatLower.includes('database') || itemCatLower.includes('storage') || itemCatLower.includes('sql') || itemCatLower.includes('data');
  }

  if (targetCatLower === 'productivity & workspace' || targetCatLower === 'productivity' || targetCatLower === 'enterprise & productivity') {
    return itemCatLower.includes('productiv') || itemCatLower.includes('work') || itemCatLower.includes('enterprise');
  }

  if (targetCatLower === 'foundation models') {
    return itemCatLower.includes('foundation') || itemCatLower.includes('model') || itemCatLower.includes('frontier');
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

export function isCompanyEntity(item) {
  if (!item) return false;
  return item.entityType === 'company' || item.type === 'company';
}

export function isOpenWeightsItem(item) {
  if (!item) return false;
  if (item.accessType === 'open_weights' || item.accessType === 'hybrid') return true;
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
    (a.searchQuery || '') === (b.searchQuery || '') &&
    (a.accessFilter || 'all') === (b.accessFilter || 'all') &&
    (a.verificationFilter || 'all') === (b.verificationFilter || 'all') &&
    (a.providerFilter || 'all') === (b.providerFilter || 'all') &&
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

export function parseMetricNumber(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim();
  if (/^(N\/A|NONE|NULL|UNDEFINED)$/i.test(str)) return 0;
  
  // Extract base numerical characters
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!match) return 0;
  const baseNum = parseFloat(match[0]);
  if (isNaN(baseNum)) return 0;

  // Check unit multipliers using word boundaries or immediate suffix on numbers
  if (/[0-9.]\s*b(?:\b|[^a-z])/i.test(str)) return baseNum * 1_000_000_000;
  if (/[0-9.]\s*m(?:\b|[^a-z])/i.test(str)) return baseNum * 1_000_000;
  if (/[0-9.]\s*k(?:\b|[^a-z])/i.test(str)) return baseNum * 1_000;
  return baseNum;
}

export function computePercentileRank(values, targetValue) {
  if (!values || values.length === 0 || targetValue === null || targetValue === undefined) return 0;
  const target = parseMetricNumber(targetValue);
  const parsedValues = values
    .map(parseMetricNumber)
    .filter((v) => typeof v === 'number' && !isNaN(v))
    .sort((a, b) => a - b);
  
  if (parsedValues.length === 0) return 0;
  
  let lower = 0;
  let equal = 0;
  for (const v of parsedValues) {
    if (v < target) lower++;
    else if (v === target) equal++;
  }
  return Math.round(((lower + 0.5 * equal) / parsedValues.length) * 1000) / 10;
}

function applyPerspective(list, perspective) {
  if (perspective === 'open_weights') {
    return list.filter(isOpenWeightsItem);
  }
  return list;
}

function sortLeaderboard(list, sortBy, searchQuery) {
  const sorted = [...list];
  sorted.sort((a, b) => {
    let diff = 0;
    if (sortBy === 'visits') {
      const vB = parseMetricNumber(b.monthlyVisits || b.votes || 0);
      const vA = parseMetricNumber(a.monthlyVisits || a.votes || 0);
      diff = vB - vA;
    } else if (sortBy === 'growth') {
      const gB = parseMetricNumber(b.growth || b.growthNum || b.rankDelta || 0);
      const gA = parseMetricNumber(a.growth || a.growthNum || a.rankDelta || 0);
      diff = gB - gA;
    } else if (sortBy === 'newest') {
      diff = String(b.id || '').localeCompare(String(a.id || ''));
    } else {
      diff = (a.rank || 0) - (b.rank || 0);
    }

    if (diff !== 0) return diff;

    // Tie-breaker: if primary sort is tied, use search relevance (higher score first)
    if (searchQuery && String(searchQuery).trim()) {
      const relA = computeSearchRelevance(a, searchQuery);
      const relB = computeSearchRelevance(b, searchQuery);
      if (relB !== relA) return relB - relA;
    }

    return (a.rank || 0) - (b.rank || 0);
  });
  return sorted;
}

export function selectBaseLists({ models = [], tools = [], agents = [], mcp = [], companies = [], filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective);
  const perspectiveTools = applyPerspective(tools || [], filters.perspective);
  const perspectiveAgents = applyPerspective(agents || [], filters.perspective);
  const perspectiveMcps = applyPerspective(mcp || [], filters.perspective);
  const perspectiveCompanies = applyPerspective(companies || [], filters.perspective);

  if (filters.entityType === 'tools') {
    return perspectiveTools.filter(isToolEntity);
  }
  if (filters.entityType === 'models') {
    return perspectiveModels.filter((item) => !isToolEntity(item) && !isAgentEntity(item) && !isMCPEntity(item) && !isCompanyEntity(item));
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
  if (filters.entityType === 'companies') {
    return perspectiveCompanies.length > 0 ? perspectiveCompanies : perspectiveModels.filter(isCompanyEntity);
  }

  const modelIds = new Set(perspectiveModels.map((m) => m.id));
  const extraTools = perspectiveTools.filter((t) => !modelIds.has(t.id));
  const extraAgents = perspectiveAgents.filter((a) => !modelIds.has(a.id));
  const extraMcps = perspectiveMcps.filter((c) => !modelIds.has(c.id));
  const extraCompanies = perspectiveCompanies.filter((comp) => !modelIds.has(comp.id));
  return [...perspectiveModels, ...extraTools, ...extraAgents, ...extraMcps, ...extraCompanies];
}

export function computeEntityTypeCounts({ models = [], tools = [], agents = [], mcp = [], companies = [], filters }) {
  const perspectiveModels = applyPerspective(models || [], filters.perspective).filter((item) => !isToolEntity(item) && !isAgentEntity(item) && !isMCPEntity(item) && !isCompanyEntity(item));
  const perspectiveTools = applyPerspective(tools || [], filters.perspective).filter(isToolEntity);
  
  let perspectiveAgents = applyPerspective(agents && agents.length > 0 ? agents : models || [], filters.perspective);
  if (perspectiveAgents.length === 0 && agents.length > 0) {
    perspectiveAgents = applyPerspective(agents, filters.perspective);
  }

  let perspectiveMcps = applyPerspective(mcp && mcp.length > 0 ? mcp : models || [], filters.perspective);
  if (perspectiveMcps.length === 0 && mcp.length > 0) {
    perspectiveMcps = applyPerspective(mcp, filters.perspective);
  }

  let perspectiveCompanies = applyPerspective(companies && companies.length > 0 ? companies : models || [], filters.perspective);
  if (perspectiveCompanies.length === 0 && companies.length > 0) {
    perspectiveCompanies = applyPerspective(companies, filters.perspective);
  }

  const category = filters.category;
  const m = perspectiveModels.filter((item) => matchesCategory(item.category, category));
  const t = perspectiveTools.filter((item) => matchesCategory(item.category, category));
  const a = perspectiveAgents.filter((item) => matchesCategory(item.category, category));
  const c = perspectiveMcps.filter((item) => matchesCategory(item.category, category));
  const comp = perspectiveCompanies.filter((item) => matchesCategory(item.category, category));

  return {
    all: m.length + t.length + a.length + c.length + comp.length,
    models: m.length,
    tools: t.length,
    agents: a.length,
    mcp: c.length,
    companies: comp.length
  };
}

export function computeSelfExcludingFacetCounts({ baseItems, filters }) {
  const q = filters.searchQuery || '';
  const cat = filters.category || 'All';
  const access = filters.accessFilter || 'all';
  const ver = filters.verificationFilter || 'all';
  const prov = filters.providerFilter || 'all';

  // Pool for Access: apply Search, Category, Verification, Provider (EXCLUDE Access)
  const poolForAccess = baseItems.filter((item) =>
    matchesSearch(item, q) &&
    matchesCategory(item.category, cat) &&
    matchesVerification(item, ver) &&
    matchesProvider(item, prov)
  );

  const accessCounts = {
    all: poolForAccess.length,
    open_weights: poolForAccess.filter((i) => matchesAccess(i, 'open_weights')).length,
    api: poolForAccess.filter((i) => matchesAccess(i, 'api')).length,
    proprietary: poolForAccess.filter((i) => matchesAccess(i, 'proprietary')).length,
    hybrid: poolForAccess.filter((i) => getItemAccessType(i) === 'hybrid').length
  };

  // Pool for Verification: apply Search, Category, Access, Provider (EXCLUDE Verification)
  const poolForVerification = baseItems.filter((item) =>
    matchesSearch(item, q) &&
    matchesCategory(item.category, cat) &&
    matchesAccess(item, access) &&
    matchesProvider(item, prov)
  );

  const verificationCounts = {
    all: poolForVerification.length,
    verified_only: poolForVerification.filter(isVerifiedItem).length
  };

  return { accessCounts, verificationCounts };
}

export function validateLeaderboardRows(rows, filters, { logInvalid = false } = {}) {
  const valid = [];
  const invalid = [];

  for (const row of rows) {
    let reason = null;
    if (filters.entityType === 'tools' && !isToolEntity(row)) {
      reason = 'entityType mismatch (expected tool)';
    } else if (filters.entityType === 'models' && (isToolEntity(row) || isAgentEntity(row) || isMCPEntity(row) || isCompanyEntity(row))) {
      reason = 'entityType mismatch (expected model)';
    } else if (filters.entityType === 'agents' && !isAgentEntity(row)) {
      reason = 'entityType mismatch (expected agent)';
    } else if (filters.entityType === 'mcp' && !isMCPEntity(row)) {
      reason = 'entityType mismatch (expected mcp)';
    } else if (filters.entityType === 'companies' && !isCompanyEntity(row)) {
      reason = 'entityType mismatch (expected company)';
    } else if (filters.category && filters.category !== 'All' && !matchesCategory(row.category, filters.category)) {
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

export function buildLeaderboardView({ models = [], tools = [], agents = [], mcp = [], companies = [], filters = DEFAULT_FILTERS, ready = true }) {
  if (!ready) {
    return {
      appliedFilters: { ...filters },
      rows: [],
      entityTypeCounts: { all: 0, models: 0, tools: 0, agents: 0, mcp: 0, companies: 0 },
      facetCounts: {
        accessCounts: { all: 0, open_weights: 0, api: 0, proprietary: 0, hybrid: 0 },
        verificationCounts: { all: 0, verified_only: 0 }
      },
      loading: true
    };
  }

  // 1. Select base list according to entityType
  const base = selectBaseLists({ models, tools, agents, mcp, companies, filters });

  // 2. Search query filter
  const searchFiltered = filters.searchQuery
    ? base.filter((item) => matchesSearch(item, filters.searchQuery))
    : base;

  // 3. Category filter
  const categoryFiltered = (!filters.category || filters.category === 'All')
    ? searchFiltered
    : searchFiltered.filter((item) => matchesCategory(item.category, filters.category));

  // 4. Access filter (entity-aware)
  const accessFiltered = (!filters.accessFilter || filters.accessFilter === 'all')
    ? categoryFiltered
    : categoryFiltered.filter((item) => matchesAccess(item, filters.accessFilter));

  // 5. Verification filter
  const verificationFiltered = (!filters.verificationFilter || filters.verificationFilter === 'all')
    ? accessFiltered
    : accessFiltered.filter((item) => matchesVerification(item, filters.verificationFilter));

  // 6. Provider filter
  const providerFiltered = (!filters.providerFilter || filters.providerFilter === 'all')
    ? verificationFiltered
    : verificationFiltered.filter((item) => matchesProvider(item, filters.providerFilter));

  const validated = validateLeaderboardRows(providerFiltered, filters, { logInvalid: true });
  const sorted = sortLeaderboard(validated, filters.sortBy || 'rank', filters.searchQuery);
  
  // Calculate total counts per entityType for domain percentile determination
  const domainTotals = {
    model: models.filter((m) => !isToolEntity(m) && !isAgentEntity(m) && !isMCPEntity(m) && !isCompanyEntity(m)).length || 1,
    tool: tools.length || 1,
    agent: agents.length || 1,
    mcp: mcp.length || 1,
    company: companies.length || 1
  };

  const rows = sorted.map((item, index) => {
    const eType = isToolEntity(item) ? 'tool' : isAgentEntity(item) ? 'agent' : isMCPEntity(item) ? 'mcp' : isCompanyEntity(item) ? 'company' : 'model';
    const totalInDomain = domainTotals[eType] || 1;
    const itemDomainRank = item.rank || (index + 1);
    const domainPercentile = Math.max(0.1, Math.min(99.9, Math.round((1 - (itemDomainRank - 0.5) / totalInDomain) * 1000) / 10));

    return {
      ...item,
      displayRank: index + 1,
      domainPercentile,
      domainType: eType
    };
  });

  return {
    appliedFilters: { ...filters },
    rows,
    entityTypeCounts: computeEntityTypeCounts({ models, tools, agents, mcp, companies, filters }),
    facetCounts: computeSelfExcludingFacetCounts({ baseItems: base, filters }),
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
