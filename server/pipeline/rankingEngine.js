// Server Ranking Engine
// Centralized ranking logic for the 5 official Leaderboard filters.
// Strictly operates on verified source data without generating fabricated values.
// Returns up to 100 qualifying models per filter.

export function rankLeaderboard(models = [], perspective = 'overall') {
  let list = [...models];

  switch (perspective) {
    case 'risers': {
      // Sourced from historical snapshot rank/Elo changes
      list = list.filter((m) => m.arenaElo !== null);
      list.sort((a, b) => {
        const deltaA = parseInt((a.rankDelta || '0').replace('+', ''), 10) || 0;
        const deltaB = parseInt((b.rankDelta || '0').replace('+', ''), 10) || 0;
        if (deltaB !== deltaA) return deltaB - deltaA;

        const eloDiffA = parseInt((a.eloChange || '0').replace('+', ''), 10) || 0;
        const eloDiffB = parseInt((b.eloChange || '0').replace('+', ''), 10) || 0;
        if (eloDiffB !== eloDiffA) return eloDiffB - eloDiffA;

        return (b.arenaElo || 0) - (a.arenaElo || 0);
      });
      break;
    }

    case 'adopted': {
      // Sourced from verified LMSYS user battle count / adoption volume
      list = list.filter((m) => typeof m.votes === 'number' && m.votes > 0);
      list.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      break;
    }

    case 'speed': {
      // Sourced from Artificial Analysis verified measured throughput (tok/s)
      list = list.filter((m) => typeof m.speedNum === 'number' && m.speedNum > 0);
      list.sort((a, b) => (b.speedNum || 0) - (a.speedNum || 0));
      break;
    }

    case 'open_weights': {
      // Filtered to verified open-weights models, ranked by LMSYS Elo
      list = list.filter((m) => m.isOpenWeights === true && m.arenaElo !== null);
      list.sort((a, b) => (b.arenaElo || 0) - (a.arenaElo || 0));
      break;
    }

    case 'overall':
    default: {
      // Sourced directly from LMSYS Chatbot Arena official Elo rating
      list = list.filter((m) => m.arenaElo !== null);
      list.sort((a, b) => (b.arenaElo || 0) - (a.arenaElo || 0));
      break;
    }
  }

  // Up to 100 valid models (never fabricate to force 100)
  const top100 = list.slice(0, 100).map((item, index) => ({
    ...item,
    rank: index + 1 // Assign sequential perspective rank
  }));

  return {
    perspective,
    totalQualifying: list.length,
    returnedCount: top100.length,
    models: top100
  };
}
