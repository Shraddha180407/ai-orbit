// Server Data Fetcher
// Fetches live model evaluation data from:
// 1. LMSYS Chatbot Arena official Hugging Face dataset (rating, rank, vote_count, organization, license)
// 2. Artificial Analysis public benchmark stream (verified speed tok/s, latency TTFT, isOpenWeights, pricing, contextWindow)

export async function fetchLMSYSArenaData(maxModels = 600) {
  try {
    const allRows = [];
    const pageSize = 100;
    const pages = Math.ceil(maxModels / pageSize);

    for (let page = 0; page < pages; page++) {
      const offset = page * pageSize;
      const url = `https://datasets-server.huggingface.co/rows?dataset=lmarena-ai/leaderboard-dataset&config=text&split=latest&offset=${offset}&limit=${pageSize}`;
      
      try {
        const res = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'AI-Orbit-Data-Pipeline/2.0'
          }
        });

        if (!res.ok) {
          console.warn(`[Fetcher] Page offset ${offset} returned HTTP ${res.status}`);
          break;
        }

        const data = await res.json();
        if (data.rows && Array.isArray(data.rows) && data.rows.length > 0) {
          allRows.push(...data.rows.map((r) => r.row));
          if (data.rows.length < pageSize) break;
        } else {
          break;
        }
      } catch (pageErr) {
        console.warn(`[Fetcher] Warning on page offset ${offset}:`, pageErr.message);
        break;
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
