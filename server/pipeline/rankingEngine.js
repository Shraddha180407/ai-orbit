// Server Ranking Engine — OrbitRank v3.0
// Strict domain-calibrated ranking logic without cross-entity metric conflation
// Operates on verified source data without generating fabricated or synthetic benchmark values.

function parseMetric(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).trim().toUpperCase();
  if (str === 'N/A' || str === 'NONE') return 0;
  const match = str.match(/[-+]?[0-9]*\.?[0-9]+/);
  if (!match) return 0;
  const baseNum = parseFloat(match[0]);
  if (isNaN(baseNum)) return 0;
  if (str.includes('B')) return baseNum * 1_000_000_000;
  if (str.includes('M')) return baseNum * 1_000_000;
  if (str.includes('K')) return baseNum * 1_000;
  return baseNum;
}

/**
 * Domain-Calibrated Ranking for Foundation Models
 * Respects strict no-synthetic-benchmark policy: models without Arena Elo retain arenaElo = null.
 */
export function rankLeaderboard(models = [], perspective = 'overall') {
  let list = [...models];

  switch (perspective) {
    case 'risers': {
      // Historical rank and momentum changes
      list.sort((a, b) => {
        const deltaA = parseMetric(a.rankDelta);
        const deltaB = parseMetric(b.rankDelta);
        if (deltaB !== deltaA) return deltaB - deltaA;

        const eloDiffA = parseMetric(a.eloChange);
        const eloDiffB = parseMetric(b.eloChange);
        if (eloDiffB !== eloDiffA) return eloDiffB - eloDiffA;

        const growthA = parseMetric(a.growth);
        const growthB = parseMetric(b.growth);
        if (growthB !== growthA) return growthB - growthA;

        return (b.arenaElo || 0) - (a.arenaElo || 0);
      });
      break;
    }

    case 'adopted': {
      // Verified adoption: monthly visits, API traffic, LMSYS battle volume
      list.sort((a, b) => {
        const visitsB = parseMetric(b.monthlyVisits || b.votes);
        const visitsA = parseMetric(a.monthlyVisits || a.votes);
        if (visitsB !== visitsA) return visitsB - visitsA;
        return (b.votes || 0) - (a.votes || 0);
      });
      break;
    }

    case 'speed': {
      // Verified throughput tok/s from Artificial Analysis / lab measurement
      list.sort((a, b) => {
        const speedB = b.speedNum || parseMetric(b.outputSpeed);
        const speedA = a.speedNum || parseMetric(a.outputSpeed);
        if (speedB !== speedA) return speedB - speedA;
        return (b.arenaElo || 0) - (a.arenaElo || 0);
      });
      break;
    }

    case 'open_weights': {
      // Filtered to verified open-weights models
      list = list.filter((m) => m.isOpenWeights === true);
      list.sort((a, b) => {
        if (a.arenaElo !== null && b.arenaElo !== null) {
          return b.arenaElo - a.arenaElo;
        }
        if (a.arenaElo !== null) return -1;
        if (b.arenaElo !== null) return 1;
        return parseMetric(b.monthlyVisits) - parseMetric(a.monthlyVisits);
      });
      break;
    }

    case 'overall':
    default: {
      // Verified benchmark evaluation: Arena Elo primary for evaluated models.
      // Unrated models (e.g. specialized image/audio) stay in catalog without fabricated Elo.
      list.sort((a, b) => {
        if (a.arenaElo !== null && b.arenaElo !== null) {
          return b.arenaElo - a.arenaElo;
        }
        if (a.arenaElo !== null) return -1;
        if (b.arenaElo !== null) return 1;
        // Secondary sort for non-Arena models by verified adoption
        return parseMetric(b.monthlyVisits) - parseMetric(a.monthlyVisits);
      });
      break;
    }
  }

  const ranked = list.slice(0, 500).map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  return {
    perspective,
    totalQualifying: list.length,
    returnedCount: ranked.length,
    models: ranked
  };
}

/**
 * Domain-Calibrated Ranking for AI Agent Entities
 * Ranked by Task Win Rate, Evaluation Sessions, and verified SWE-bench evidence.
 */
export function rankAgents(agents = [], perspective = 'overall') {
  let list = [...agents];

  list.sort((a, b) => {
    const scoreB = typeof b.score === 'number' ? b.score : parseMetric(b.score);
    const scoreA = typeof a.score === 'number' ? a.score : parseMetric(a.score);
    if (scoreB !== scoreA) return scoreB - scoreA;

    const sessB = parseMetric(b.monthlyVisits || b.evaluations?.evalSessions);
    const sessA = parseMetric(a.monthlyVisits || a.evaluations?.evalSessions);
    return sessB - sessA;
  });

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Domain-Calibrated Ranking for AI Tools
 * Ranked by verified developer/user adoption, traffic, and growth.
 */
export function rankTools(tools = [], perspective = 'overall') {
  let list = [...tools];

  list.sort((a, b) => {
    const vB = parseMetric(b.monthlyVisits || b.visitsNum);
    const vA = parseMetric(a.monthlyVisits || a.visitsNum);
    if (vB !== vA) return vB - vA;
    return (a.rank || 0) - (b.rank || 0);
  });

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Domain-Calibrated Ranking for MCP Servers
 * Ranked by official verification, GitHub stars, and weekly downloads.
 */
export function rankMCP(mcps = [], perspective = 'overall') {
  let list = [...mcps];

  list.sort((a, b) => {
    if (b.verified !== a.verified) return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
    const starsB = b.stars || parseMetric(b.stars);
    const starsA = a.stars || parseMetric(a.stars);
    if (starsB !== starsA) return starsB - starsA;
    const dlB = parseMetric(b.downloads);
    const dlA = parseMetric(a.downloads);
    return dlB - dlA;
  });

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}

/**
 * Domain-Calibrated Ranking for AI Companies
 * Ranked by disclosed enterprise valuation, capital raised, and ecosystem footprint.
 */
export function rankCompanies(companies = [], perspective = 'overall') {
  let list = [...companies];

  switch (perspective) {
    case 'funding':
      list.sort((a, b) => (b.fundingNum || 0) - (a.fundingNum || 0));
      break;
    case 'valuation':
      list.sort((a, b) => (b.valuationNum || 0) - (a.valuationNum || 0));
      break;
    case 'growth':
      list.sort((a, b) => (b.growthNum || parseMetric(b.growth)) - (a.growthNum || parseMetric(a.growth)));
      break;
    case 'overall':
    default:
      list.sort((a, b) => {
        const valDiff = (b.valuationNum || 0) - (a.valuationNum || 0);
        if (valDiff !== 0) return valDiff;
        return (b.fundingNum || 0) - (a.fundingNum || 0);
      });
      break;
  }

  return list.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
