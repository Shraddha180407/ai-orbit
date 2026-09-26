// Server Data Fetcher
// Fetches live ecosystem evaluation data across all 5 modules:
// 1. LMSYS Chatbot Arena official Hugging Face dataset (text, vision, webdev configs)
// 2. LMSYS Arena Agent dataset (config=agent, split=latest)
// 3. Official Model Context Protocol Registry (GET /v0.1/servers)
// 4. Reliable Public Tools Registry (npm search API)
// 5. Artificial Analysis public benchmark stream (verified speed tok/s, latency TTFT, pricing)

export async function fetchLMSYSArenaData(maxModels = 600, configs = ['text', 'vision', 'webdev']) {
  try {
    const allRows = [];
    const seenNames = new Set();
    const pageSize = 100;

    for (const config of configs) {
      try {
        const url = `https://datasets-server.huggingface.co/rows?dataset=lmarena-ai/leaderboard-dataset&config=${config}&split=latest&offset=0&limit=${pageSize}`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
          }
        });

        if (!res.ok) {
          console.warn(`[Fetcher] Config ${config} returned HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();
        if (data.rows && Array.isArray(data.rows)) {
          for (const r of data.rows) {
            const raw = r.row;
            const name = raw?.model_name || raw?.name;
            if (name && !seenNames.has(name)) {
              seenNames.add(name);
              allRows.push({ ...raw, sourceConfig: config });
            }
          }
        }
      } catch (cErr) {
        console.warn(`[Fetcher] Warning on LMSYS config ${config}:`, cErr.message);
      }
    }

    if (allRows.length === 0) {
      throw new Error('No rows retrieved from LMSYS dataset.');
    }

    return allRows;
  } catch (err) {
    console.error('[Fetcher] Error fetching LMSYS Arena data:', err.message);
    throw err;
  }
}

export async function fetchArenaAgentData(maxAgents = 200) {
  try {
    const configs = [
      'agent',
      'agent_bash_recovery_steps',
      'agent_praise_complaint',
      'agent_steerability',
      'agent_task_outcome_explicit',
      'agent_tool_hallucination'
    ];
    const allAgentRows = [];

    // Fetch from official LMSYS Agent evaluation configs
    for (const config of configs) {
      try {
        const url = `https://datasets-server.huggingface.co/rows?dataset=lmarena-ai/leaderboard-dataset&config=${config}&split=latest&offset=0&limit=100`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (res.ok) {
          const data = await res.json();
          if (data.rows && Array.isArray(data.rows)) {
            for (const r of data.rows) {
              allAgentRows.push({
                ...r.row,
                sourceConfig: config
              });
            }
          }
        }
      } catch (cErr) {
        console.warn(`[Fetcher] LMSYS Agent config ${config} warning:`, cErr.message);
      }
    }

    // Also fetch public registry agent packages (e.g., AutoGen, LangChain Agent, CrewAI, etc.)
    try {
      const npmUrl = 'https://registry.npmjs.org/-/v1/search?text=keywords:agent,ai-agent,autonomous-agent,agentic&size=50';
      const npmRes = await fetch(npmUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
        },
        signal: AbortSignal.timeout(8000)
      });
      if (npmRes.ok) {
        const npmData = await npmRes.json();
        if (npmData.objects && Array.isArray(npmData.objects)) {
          for (const item of npmData.objects) {
            allAgentRows.push({
              isNpmAgent: true,
              package: item.package,
              score: item.score
            });
          }
        }
      }
    } catch (npmErr) {
      console.warn('[Fetcher] NPM agent search warning:', npmErr.message);
    }

    return allAgentRows;
  } catch (err) {
    console.error('[Fetcher] Error fetching Arena Agent data:', err.message);
    throw err;
  }
}

export async function fetchMCPRegistryData(minUniqueServers = 150) {
  try {
    let cursor = null;
    const allServers = [];
    const uniqueNames = new Set();
    let page = 0;
    const maxPages = 30;

    while (page < maxPages && uniqueNames.size < minUniqueServers) {
      const url = `https://registry.modelcontextprotocol.io/v0.1/servers?limit=50${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
        },
        signal: AbortSignal.timeout(8000)
      });

      if (!res.ok) {
        console.warn(`[Fetcher] MCP Registry returned HTTP ${res.status}`);
        break;
      }

      const data = await res.json();
      const list = data.servers || [];
      if (list.length === 0) break;

      for (const item of list) {
        const s = item.server || item;
        const name = s.name || s.id;
        if (name) {
          uniqueNames.add(name);
          allServers.push(item);
        }
      }

      cursor = data.nextCursor || data.metadata?.nextCursor || null;
      page++;
      if (!cursor) break;
    }

    console.log(`[Fetcher] Collected ${allServers.length} raw MCP registry items across ${uniqueNames.size} unique servers.`);
    return allServers;
  } catch (err) {
    console.error('[Fetcher] Error fetching MCP Registry data:', err.message);
    throw err;
  }
}

export async function fetchToolsRegistryData(limit = 60) {
  try {
    const url = `https://registry.npmjs.org/-/v1/search?text=keywords:ai-tools,agent,mcp,llm&size=${limit}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
      }
    });

    if (!res.ok) {
      throw new Error(`Tools registry returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.objects || [];
  } catch (err) {
    console.error('[Fetcher] Error fetching Tools registry data:', err.message);
    throw err;
  }
}

export async function fetchArtificialAnalysisData() {
  try {
    const res = await fetch('https://artificialanalysis.ai/embed/llm-leaderboard', {
      headers: {
        'Accept': 'text/html,application/xhtml+xml',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`Artificial Analysis responded with HTTP ${res.status}: ${res.statusText}`);
    }

    const html = await res.text();
    const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g)];
    let combined = '';
    for (const m of matches) {
      combined += m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    const models = [];
    let pos = 0;
    while ((pos = combined.indexOf('{"slug":"', pos)) !== -1) {
      let end = combined.indexOf(',{"slug":"', pos + 1);
      if (end === -1) end = combined.indexOf('}]', pos);
      if (end === -1) break;
      const chunk = combined.slice(pos, end);
      try {
        const obj = JSON.parse(chunk);
        if (obj.slug && obj.name) {
          models.push(obj);
        }
      } catch (e) {
        // Skip malformed chunk
      }
      pos = end;
    }

    return models;
  } catch (err) {
    console.error('[Fetcher] Error fetching Artificial Analysis data:', err.message);
    throw err;
  }
}

/**
 * Fetch real Hugging Face ecosystem stats for major AI company orgs.
 * Returns a map of { hfOrgId → { modelCount, totalDownloads, totalLikes, trendingScore } }
 * These stats are used to power the "growth" and "overall" company perspectives with real signals.
 *
 * HF public API: GET /api/models?author=<org>&limit=100&sort=downloads
 * No auth required for public models.
 */
export async function fetchCompaniesEnrichmentData() {
  // Map of company slug → HF org ID(s) to look up
  const ORG_MAP = {
    'openai':         ['openai'],
    'anthropic':      ['anthropic'],
    'deepseek':       ['deepseek-ai'],
    'google-deepmind':['google', 'google-deepmind'],
    'meta-ai':        ['meta-llama', 'facebook'],
    'mistral':        ['mistralai'],
    'cohere':         ['CohereForAI'],
    'ai21':           ['ai21-labs'],
    'xai':            ['xai-org'],
    'nvidia':         ['nvidia'],
    'microsoft':      ['microsoft'],
    'amazon':         ['amazon'],
    'huggingface':    ['huggingface'],
    'stability-ai':   ['stabilityai'],
    'together-ai':    ['togethercomputer'],
    'aleph-alpha':    ['Aleph-Alpha'],
    'inflection-ai':  ['pi-ai'],
    'runway':         ['runwayml'],
    'elevenlabs':     ['elevenlabs'],
    'perplexity':     ['perplexity-ai'],
    'cerebras':       ['cerebras'],
    'groq':           ['groq'],
    'databricks':     ['databricks'],
    'snowflake':      ['Snowflake'],
    'salesforce':     ['Salesforce'],
    'adobe':          ['adobe'],
    'apple':          ['apple'],
    'character-ai':   ['CharacterAI'],
    'replit':         ['replit'],
  };

  const result = {};

  for (const [slug, orgIds] of Object.entries(ORG_MAP)) {
    let totalModels = 0;
    let totalDownloads = 0;
    let totalLikes = 0;
    let maxTrending = 0;

    for (const orgId of orgIds) {
      try {
        const url = `https://huggingface.co/api/models?author=${orgId}&limit=100&sort=downloads&direction=-1`;
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
          },
          signal: AbortSignal.timeout(8000)
        });

        if (!res.ok) continue;
        const models = await res.json();
        if (!Array.isArray(models)) continue;

        totalModels += models.length;
        for (const m of models) {
          totalDownloads += (m.downloads || 0);
          totalLikes += (m.likes || 0);
          if ((m.trendingScore || 0) > maxTrending) maxTrending = m.trendingScore;
        }
      } catch {
        // Network error for this org — skip silently
      }
    }

    if (totalModels > 0 || totalDownloads > 0) {
      result[slug] = {
        hfModelCount: totalModels,
        hfDownloads: totalDownloads,
        hfLikes: totalLikes,
        hfTrendingScore: maxTrending,
      };
    }
  }

  return result;
}
