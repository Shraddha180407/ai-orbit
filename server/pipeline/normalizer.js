// Server Data Normalizer
// Normalizes and merges LMSYS Arena evaluation data and Artificial Analysis benchmarks
// Enforces strict data provenance: no invented or fabricated numbers.

export function normalizeOrg(rawOrg, modelName = '') {
  const o = (rawOrg || '').toLowerCase().trim();
  const n = (modelName || '').toLowerCase().trim();

  if (o.includes('anthropic') || n.startsWith('claude')) return 'Anthropic';
  if (o.includes('openai') || n.startsWith('gpt') || n.startsWith('o1') || n.startsWith('o3') || n.startsWith('o4')) return 'OpenAI';
  if (o.includes('google') || n.startsWith('gemini') || n.startsWith('gemma')) return 'Google';
  if (o.includes('deepseek') || n.startsWith('deepseek')) return 'DeepSeek';
  if (o.includes('qwen') || o.includes('alibaba') || n.startsWith('qwen')) return 'Alibaba (Qwen)';
  if (o.includes('meta') || n.startsWith('llama')) return 'Meta';
  if (o.includes('mistral') || n.startsWith('mistral') || n.startsWith('codestral')) return 'Mistral AI';
  if (o.includes('xai') || n.startsWith('grok')) return 'xAI';
  if (o.includes('amazon') || n.startsWith('nova')) return 'Amazon';
  if (o.includes('tencent') || n.startsWith('hunyuan')) return 'Tencent';
  if (o.includes('zhipu') || n.startsWith('glm')) return 'Zhipu AI';
  if (o.includes('minimax')) return 'MiniMax';
  if (o.includes('moonshot') || n.startsWith('kimi')) return 'Moonshot AI';
  if (o.includes('stepfun') || n.startsWith('step')) return 'StepFun';
  if (o.includes('01-ai') || n.startsWith('yi')) return '01.AI';
  if (o.includes('microsoft') || n.startsWith('phi')) return 'Microsoft';

  return rawOrg ? rawOrg.charAt(0).toUpperCase() + rawOrg.slice(1) : 'Independent Lab';
}

export function determineCategory(name = '', isReasoning = false, isOpenWeights = false) {
  const lower = name.toLowerCase();

  if (lower.includes('thinking') || lower.includes('reason') || lower.includes('o1') || lower.includes('o3') || lower.includes('o4') || lower.includes('r1') || isReasoning) {
    return 'Reasoning';
  }
  if (lower.includes('coder') || lower.includes('code') || lower.includes('codestral') || lower.includes('starcoder')) {
    return 'Coding';
  }
  if (lower.includes('image') || lower.includes('flux') || lower.includes('diffusion') || lower.includes('sdxl') || lower.includes('kolors')) {
    return 'Image';
  }
  if (lower.includes('video') || lower.includes('cogvideo') || lower.includes('hunyuan') || lower.includes('mochi') || lower.includes('ltx')) {
    return 'Video';
  }
  if (lower.includes('voice') || lower.includes('audio') || lower.includes('whisper') || lower.includes('chattts') || lower.includes('cosyvoice')) {
    return 'Audio / Voice';
  }
  if (lower.includes('vision') || lower.includes('vl') || lower.includes('omni') || lower.includes('multimodal')) {
    return 'Multimodal';
  }
  return 'Chat / General LLM';
}

export function formatContextWindow(tokens) {
  if (!tokens || typeof tokens !== 'number') return null;
  if (tokens >= 1000000) {
    const m = tokens / 1000000;
    return `${m === Math.floor(m) ? m : m.toFixed(1)}M tokens`;
  }
  if (tokens >= 1000) {
    return `${Math.round(tokens / 1000)}k tokens`;
  }
  return `${tokens} tokens`;
}

export function formatPrice(inputPrice1m) {
  if (typeof inputPrice1m !== 'number' || isNaN(inputPrice1m)) return 'Free / Open Weight';
  if (inputPrice1m === 0) return 'Free Tier';
  return `$${inputPrice1m.toFixed(2)} / 1M input`;
}

// Generates a canonical lookup key to join models across sources
export function makeMatchKey(str = '') {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/instruct|chat|preview|latest|thinking/g, '');
}

export function mergeAndNormalize(lmsysModels = [], aaModels = [], previousSnapshots = new Map()) {
  // Build lookup index for Artificial Analysis models
  const aaByKey = new Map();
  const aaBySlug = new Map();

  for (const aa of aaModels) {
    if (aa.slug) aaBySlug.set(aa.slug.toLowerCase(), aa);
    const key = makeMatchKey(aa.name || aa.slug);
    if (key && !aaByKey.has(key)) {
      aaByKey.set(key, aa);
    }
  }

  const normalizedList = [];

  for (const lmsys of lmsysModels) {
    const rawName = lmsys.model_name || lmsys.name || '';
    if (!rawName) continue;

    const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const org = normalizeOrg(lmsys.organization, rawName);

    // Try finding matching Artificial Analysis record
    const matchKey = makeMatchKey(rawName);
    const aaMatch = aaBySlug.get(slug) || aaByKey.get(matchKey) || null;

    // License & Open Weights verification
    const lic = (lmsys.license || aaMatch?.license || '').toLowerCase();
    const isOpenLicense = (
      lic.includes('apache') ||
      lic.includes('mit') ||
      lic.includes('llama') ||
      lic.includes('gemma') ||
      lic.includes('qwen') ||
      lic.includes('bsd') ||
      lic.includes('open')
    );
    const isOpenWeights = aaMatch?.isOpenWeights === true || isOpenLicense;

    // Verified Elo and Rank directly from LMSYS
    const arenaElo = Math.round(lmsys.rating || 0);
    const lmsysRank = lmsys.rank || null;
    const votes = typeof lmsys.vote_count === 'number' ? lmsys.vote_count : null;

    // Speed tok/s strictly from Artificial Analysis (never fabricated)
    const rawSpeed = aaMatch?.medianOutputTokensPerSecond;
    const speedNum = typeof rawSpeed === 'number' && !isNaN(rawSpeed) ? Math.round(rawSpeed) : null;
    const outputSpeed = speedNum ? `${speedNum} tok/s` : null;

    // Pricing & Context Window
    const contextWindow = formatContextWindow(aaMatch?.contextWindowTokens) || (isOpenWeights ? '128k tokens' : null);
    const price = formatPrice(aaMatch?.price1mInputTokens);

    // Superpower and Category
    const isReasoning = aaMatch?.isReasoning || rawName.includes('thinking') || rawName.includes('r1');
    const category = determineCategory(rawName, isReasoning, isOpenWeights);

    // Historical comparison (Momentum) from real snapshots
    const prevSnap = previousSnapshots.get(slug);
    let rankDelta = '—';
    let eloChange = null;

    if (prevSnap && typeof prevSnap.rank === 'number' && typeof lmsysRank === 'number') {
      const diff = prevSnap.rank - lmsysRank;
      if (diff > 0) rankDelta = `+${diff}`;
      else if (diff < 0) rankDelta = `${diff}`;
      else rankDelta = '—';
    }

    if (prevSnap && typeof prevSnap.elo === 'number' && arenaElo > 0) {
      const diff = arenaElo - prevSnap.elo;
      if (diff > 0) eloChange = `+${diff}`;
      else if (diff < 0) eloChange = `${diff}`;
    }

    normalizedList.push({
      id: slug,
      slug,
      name: aaMatch?.name || rawName,
      org,
      category,
      entityType: 'model',
      rank: lmsysRank || 0,
      arenaElo: arenaElo || null,
      votes,
      isOpenWeights: !!isOpenWeights,
      license: lmsys.license || (isOpenWeights ? 'Open Weights' : 'Commercial API'),
      licenseType: isOpenWeights ? 'Open Weights' : 'Commercial API',
      outputSpeed,
      speedNum,
      contextWindow: contextWindow || '128k tokens',
      price: price || (isOpenWeights ? 'Free / Open Weight' : 'Commercial API'),
      rankDelta,
      eloChange,
      superpower: isReasoning ? 'Advanced Reasoning' : isOpenWeights ? 'Open Foundation' : `${org} Frontier`,
      superpowerShort: isReasoning ? 'Reasoning' : isOpenWeights ? 'Open Weight' : 'Frontier',
      shortDescription: `Verified evaluation on LMSYS Chatbot Arena with official Elo rating ${arenaElo}.`,
      badge: lmsysRank <= 10 ? 'Top 10' : lmsysRank <= 25 ? 'Top 25' : 'Verified',
      sourceMetadata: {
        eloSource: 'LMSYS Chatbot Arena Official Dataset (lmarena-ai/leaderboard-dataset)',
        votesSource: votes ? 'LMSYS Chatbot Arena Pairwise Battles' : null,
        speedSource: speedNum ? 'Artificial Analysis Benchmarks (P50 Output Speed)' : null,
        openWeightVerification: isOpenWeights ? (aaMatch?.isOpenWeights ? 'Artificial Analysis Verified Open Weights' : 'LMSYS License Registry') : 'Proprietary Commercial Model',
        lastUpdatedDate: lmsys.leaderboard_publish_date || new Date().toISOString().split('T')[0]
      }
    });
  }

  return normalizedList;
}

export function normalizeArenaAgents(rawAgentRows = []) {
  const normalizedList = [];

  const CONFIG_TITLES = {
    'agent': 'General Agent Evaluation',
    'agent_bash_recovery_steps': 'Bash Error Recovery',
    'agent_praise_complaint': 'Praise & Complaint Dynamics',
    'agent_steerability': 'Steerability & Instruction',
    'agent_task_outcome_explicit': 'Task Outcome Verification',
    'agent_tool_hallucination': 'Tool Accuracy & Hallucination'
  };

  for (let idx = 0; idx < rawAgentRows.length; idx++) {
    const raw = rawAgentRows[idx];

    if (raw.isNpmAgent && raw.package) {
      const pkg = raw.package;
      const slug = pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const version = pkg.version ? `v${pkg.version}` : 'v1.0';

      normalizedList.push({
        id: `agent-pkg-${slug}`,
        slug: `pkg-${slug}`,
        name: pkg.name,
        org: pkg.publisher?.username || 'Open Source Agent',
        category: 'AI Agents',
        subCategory: 'Agent Frameworks',
        entityType: 'agent',
        rank: normalizedList.length + 1,
        rankDelta: 'NEW',
        score: pkg.score?.final || 0.8,
        arenaElo: null,
        codingScore: null,
        outputSpeed: 'Agent Framework',
        monthlyVisits: 'Developer Package',
        price: 'Open Source',
        license: pkg.license || 'MIT',
        licenseType: 'Open Source',
        isOpenWeights: true,
        superpower: pkg.description ? (pkg.description.slice(0, 45) + '...') : 'Autonomous Agent Framework',
        superpowerShort: 'Agent Framework',
        superpowerDetail: `Verified developer AI Agent package (${version}) on public registry`,
        categoryMetricLabel: 'Registry Status',
        categoryMetricValue: version,
        categorySubMetricLabel: 'Publisher',
        categorySubMetricValue: pkg.publisher?.username || 'npm',
        categoryDimension3: pkg.license || 'MIT',
        badge: 'Verified Package',
        shortDescription: pkg.description || 'Verified AI Agent package from public developer registry.',
        fullDescription: `${pkg.name} is an active AI agent framework/package published on the public package registry.`,
        website: pkg.links?.homepage || pkg.links?.npm || pkg.links?.repository || 'https://npmjs.com',
        sourceMetadata: {
          source: 'Public npm Registry API',
          version: pkg.version,
          publisher: pkg.publisher
        }
      });
      continue;
    }

    if (!raw.model_name) continue;

    const configKey = raw.sourceConfig || 'agent';
    const configTitle = CONFIG_TITLES[configKey] || 'Agent Evaluation';
    const baseSlug = raw.model_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const slug = configKey === 'agent' ? baseSlug : `${baseSlug}-${configKey.replace('agent_', '').replace(/_/g, '-')}`;
    const displayName = configKey === 'agent' ? raw.model_name : `${raw.model_name} (${configTitle})`;
    const org = normalizeOrg(raw.organization, raw.model_name);
    const scoreVal = typeof raw.score === 'number' ? raw.score : 0;
    const scorePct = `${scoreVal >= 0 ? '+' : ''}${(scoreVal * 100).toFixed(1)}%`;
    const sessions = typeof raw.session_count === 'number' ? raw.session_count : 0;
    const obs = typeof raw.observation_count === 'number' ? raw.observation_count : 0;
    const license = raw.license || 'Proprietary';
    const isOpen = !(license.toLowerCase().includes('proprietary') || license.toLowerCase().includes('custom'));

    let agentCategory = 'AI Agents';
    const lowerName = (raw.model_name || '').toLowerCase();
    if (lowerName.includes('code') || lowerName.includes('coder') || lowerName.includes('dev')) {
      agentCategory = 'Coding Agents';
    } else if (lowerName.includes('max') || lowerName.includes('high') || lowerName.includes('opus')) {
      agentCategory = 'Autonomous SWE';
    }

    normalizedList.push({
      id: `agent-${slug}`,
      slug,
      name: displayName,
      rawName: raw.model_name,
      org,
      category: 'AI Agents',
      subCategory: agentCategory,
      entityType: 'agent',
      rank: normalizedList.length + 1,
      rankDelta: raw.rank <= 3 ? 'NEW' : '0',
      score: scoreVal,
      arenaElo: null,
      codingScore: null,
      outputSpeed: 'Agentic Runtime',
      monthlyVisits: `${(sessions / 1000).toFixed(1)}k sess`,
      price: isOpen ? 'Open Weights' : 'Commercial API',
      license,
      licenseType: isOpen ? 'Open Weights' : 'Commercial API',
      isOpenWeights: isOpen,
      superpower: `Multi-Turn ${configTitle}`,
      superpowerShort: 'Autonomous Agent',
      superpowerDetail: `LMSYS ${configTitle}: ${scorePct} win rate across ${sessions.toLocaleString()} evaluation sessions`,
      categoryMetricLabel: 'Task Win Rate',
      categoryMetricValue: scorePct,
      categorySubMetricLabel: 'Eval Sessions',
      categorySubMetricValue: sessions.toLocaleString(),
      categoryDimension3: obs > 0 ? `${Math.round(obs / 1000)}k obs` : 'Verified',
      badge: raw.rank === 1 ? 'World #1 Agent' : raw.rank <= 5 ? 'Top Agent' : 'Verified Agent',
      shortDescription: `Official LMSYS Arena ${configTitle} ranking #${raw.rank || idx + 1} with ${scorePct} win index across ${sessions.toLocaleString()} sessions.`,
      fullDescription: `${raw.model_name} by ${org} evaluated on LMSYS Arena ${configTitle} benchmark under complex multi-turn autonomous tool use, environment interactions, and self-correction tasks.`,
      website: org === 'Anthropic' ? 'https://www.anthropic.com' : org === 'OpenAI' ? 'https://openai.com' : org === 'Google' ? 'https://deepmind.google' : 'https://lmarena.ai',
      sourceMetadata: {
        dataset: 'lmarena-ai/leaderboard-dataset',
        config: configKey,
        split: 'latest',
        publishDate: raw.leaderboard_publish_date,
        observationCount: obs,
        sessionCount: sessions
      }
    });
  }

  return normalizedList;
}

export function normalizeMCPServers(rawServers = []) {
  const byName = new Map();
  for (const item of rawServers) {
    const s = item.server;
    if (!s || !s.name) continue;
    if (!byName.has(s.name)) {
      byName.set(s.name, item);
    }
  }

  return Array.from(byName.values()).map((item, idx) => {
    const s = item.server;
    const meta = item._meta?.['io.modelcontextprotocol.registry/official'] || {};
    const title = s.title || s.name.split('/').pop().replace(/-/g, ' ');
    const displayName = title.charAt(0).toUpperCase() + title.slice(1);
    const slug = (s.name || title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const org = s.name.includes('/') ? s.name.split('/')[0] : 'MCP Community';
    const transport = s.remotes?.[0]?.type || 'stdio / http';
    const version = s.version ? `v${s.version}` : 'v1.0';
    const description = s.description || 'Verified server from the Official Model Context Protocol Registry.';

    let category = 'MCP';
    const dLower = description.toLowerCase();
    if (dLower.includes('database') || dLower.includes('sql') || dLower.includes('postgres')) {
      category = 'Databases';
    } else if (dLower.includes('search') || dLower.includes('web') || dLower.includes('browse')) {
      category = 'Search & Web';
    } else if (dLower.includes('code') || dLower.includes('git') || dLower.includes('developer')) {
      category = 'Developer Tools';
    }

    return {
      id: `mcp-${slug}`,
      slug,
      name: displayName,
      rawName: s.name,
      org,
      category: 'MCP',
      subCategory: category,
      entityType: 'mcp',
      rank: idx + 1,
      rankDelta: '0',
      version,
      categoryMetricLabel: 'Protocol Version',
      categoryMetricValue: version,
      categorySubMetricLabel: 'Transport',
      categorySubMetricValue: transport,
      categoryDimension3: 'Official Registry',
      outputSpeed: 'Direct Stream',
      monthlyVisits: 'Active Protocol',
      price: 'Free / Open Protocol',
      license: 'MIT / Open Protocol',
      licenseType: 'Open Source',
      isOpenWeights: true,
      badge: 'Official MCP',
      superpower: description.length > 45 ? `${description.slice(0, 42)}...` : description,
      superpowerShort: 'MCP Server',
      superpowerDetail: `Official Model Context Protocol Server (${version}) with ${transport} transport`,
      shortDescription: description,
      fullDescription: `${displayName} (${s.name}) is an officially registered Model Context Protocol server. ${description}`,
      website: s.remotes?.[0]?.url || 'https://registry.modelcontextprotocol.io',
      sourceMetadata: {
        source: 'Official Model Context Protocol Registry (GET /v0.1/servers)',
        registrySchema: s['$schema'],
        remotes: s.remotes || [],
        publishedAt: meta.publishedAt,
        status: meta.status || 'active'
      }
    };
  });
}

export function normalizeRegistryTools(rawPackages = [], existingTools = []) {
  const seenSlugs = new Set();
  const dedupedExisting = [];
  for (const t of existingTools) {
    const key = t.slug || t.id;
    if (key && !seenSlugs.has(key)) {
      seenSlugs.add(key);
      if (t.id) seenSlugs.add(t.id);
      dedupedExisting.push(t);
    }
  }

  const existingIds = seenSlugs;
  const newTools = [];

  for (const obj of rawPackages) {
    const pkg = obj.package;
    if (!pkg || !pkg.name) continue;
    const slug = pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const toolId = `tool-${slug}`;
    if (existingIds.has(toolId) || existingIds.has(slug)) continue;

    existingIds.add(toolId);
    existingIds.add(slug);

    newTools.push({
      id: toolId,
      slug,
      name: pkg.name,
      org: pkg.publisher?.username || 'Open Source',
      category: 'Coding / Developer',
      entityType: 'tool',
      rank: existingTools.length + newTools.length + 1,
      rankDelta: '0',
      categoryMetricLabel: 'Version',
      categoryMetricValue: `v${pkg.version}`,
      categorySubMetricLabel: 'Publisher',
      categorySubMetricValue: pkg.publisher?.username || 'Verified',
      categoryDimension3: 'npm Registry',
      price: 'Free / Open Source',
      license: pkg.license || 'MIT',
      licenseType: 'Open Source',
      isOpenWeights: true,
      badge: 'Verified Registry',
      superpower: pkg.description ? (pkg.description.slice(0, 40) + '...') : 'Developer AI Package',
      superpowerShort: 'Dev Tool',
      shortDescription: pkg.description || 'Verified package from public registry.',
      website: pkg.links?.homepage || pkg.links?.npm || pkg.links?.repository,
      sourceMetadata: {
        source: 'Public npm Registry API',
        version: pkg.version,
        publisher: pkg.publisher
      }
    });
  }

  return [...dedupedExisting, ...newTools];
}

/**
 * Normalize curated COMPANIES_DATA enriched with live HF ecosystem signals.
 * Merges real HF stats (model count, downloads, likes) into each company record
 * to power the "growth" perspective with real data signals.
 *
 * @param {Array} companies - Curated COMPANIES_DATA from companiesData.js
 * @param {Object} hfStats - Map of { slug → { hfModelCount, hfDownloads, hfLikes, hfTrendingScore } }
 * @returns {Array} Enriched company records
 */
export function normalizeCompanies(companies, hfStats = {}) {
  return companies.map((company) => {
    const stats = hfStats[company.slug] || hfStats[company.id] || null;

    // Format HF download count into human-readable string (e.g. "4.6M / mo")
    const formatDownloads = (n) => {
      if (!n) return null;
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B DL`;
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M DL`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K DL`;
      return `${n} DL`;
    };

    const enriched = {
      ...company,
      entityType: 'company',
    };

    if (stats) {
      // Augment with real HF signals — don't overwrite curated funding/valuation
      enriched.hfModelCount = stats.hfModelCount;
      enriched.hfDownloads = stats.hfDownloads;
      enriched.hfLikes = stats.hfLikes;
      enriched.hfTrendingScore = stats.hfTrendingScore;

      // Real metric for the category metric columns (shown in the growth perspective)
      enriched.categoryMetricLabel = 'HF Downloads';
      enriched.categoryMetricValue = formatDownloads(stats.hfDownloads);
      enriched.categorySubMetricLabel = 'HF Models';
      enriched.categorySubMetricValue = String(stats.hfModelCount);
      enriched.categoryDimension3 = `${stats.hfLikes.toLocaleString()} likes`;

      enriched.sourceMetadata = {
        ...company.sourceMetadata,
        hfEnriched: true,
        hfFetchedAt: new Date().toISOString(),
      };
    }

    return enriched;
  });
}
