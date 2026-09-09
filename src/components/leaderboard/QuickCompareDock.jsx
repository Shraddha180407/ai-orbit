import React, { useMemo } from 'react';
import { GitCompare, X, ArrowRight, Trophy, Zap, DollarSign, Globe, Award } from 'lucide-react';

export default function QuickCompareDock({
  selectedModels = [],
  onToggleCompare,
  onClearCompare,
  onOpenModal
}) {
  if (selectedModels.length === 0) return null;

  // Compute Dimension Winners automatically when 2+ models are chosen
  const dimensionWinners = useMemo(() => {
    if (selectedModels.length < 2) return null;

    const winners = [];

    // 1. Coding Winner (SWE-bench / codingScore)
    const codingModels = selectedModels.filter((m) => m.codingScore && m.codingScore !== 'N/A');
    if (codingModels.length >= 2) {
      const bestCoding = [...codingModels].sort(
        (a, b) => parseFloat(b.codingScore) - parseFloat(a.codingScore)
      )[0];
      winners.push({
        dimension: 'Coding',
        winner: bestCoding.name.split(' ')[0],
        stat: bestCoding.codingScore,
        icon: Award
      });
    }

    // 2. Speed Winner (tok/s throughput)
    const speedModels = selectedModels.filter((m) => m.speedNum || parseInt(m.outputSpeed, 10));
    if (speedModels.length >= 2) {
      const bestSpeed = [...speedModels].sort(
        (a, b) => (b.speedNum || parseInt(b.outputSpeed, 10) || 0) - (a.speedNum || parseInt(a.outputSpeed, 10) || 0)
      )[0];
      winners.push({
        dimension: 'Speed',
        winner: bestSpeed.name.split(' ')[0],
        stat: bestSpeed.outputSpeed,
        icon: Zap
      });
    }

    // 3. Elo Winner (LMSYS Arena)
    const bestElo = [...selectedModels].sort((a, b) => b.arenaElo - a.arenaElo)[0];
    if (bestElo) {
      winners.push({
        dimension: 'Elo',
        winner: bestElo.name.split(' ')[0],
        stat: `${bestElo.arenaElo}`,
        icon: Trophy
      });
    }

    // 4. Context Winner
    const contextWinner = selectedModels.find((m) => m.contextWindow?.includes('2M') || m.contextWindow?.includes('2,000k'));
    if (contextWinner) {
      winners.push({
        dimension: 'Context',
        winner: contextWinner.name.split(' ')[0],
        stat: '2M tokens',
        icon: Globe
      });
    }

    return winners;
  }, [selectedModels]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-3xl">
      <div className="p-3 sm:p-3.5 rounded-2xl border border-[#3b3b44] bg-[#111115]/95 backdrop-blur-xl shadow-2xl shadow-[#6E56CF]/25 text-white">
        {/* Top Row: Selected items + Action buttons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 min-w-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#6E56CF]/20 text-[#C4B5FD] text-xs font-semibold shrink-0">
              <GitCompare size={14} />
              <span>{selectedModels.length}/3 Compare</span>
            </div>

            {selectedModels.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1a20] border border-[#27272e] shrink-0 text-xs"
              >
                <span className="text-white max-w-[120px] truncate font-medium">{m.name}</span>
                <button
                  onClick={() => onToggleCompare(m)}
                  className="text-[#71717A] hover:text-white cursor-pointer ml-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClearCompare}
              className="text-[#71717A] hover:text-white text-xs px-2 py-1 transition-colors cursor-pointer hidden sm:inline"
            >
              Clear
            </button>
            <button
              onClick={onOpenModal}
              disabled={selectedModels.length < 2}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer ${
                selectedModels.length >= 2
                  ? 'bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-[#6E56CF]/30 active:scale-95'
                  : 'bg-[#232326] text-[#71717A] cursor-not-allowed'
              }`}
            >
              <span>Compare Full Matrix</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Bottom Row: Instant Dimension Winners Pill Snapshot */}
        {dimensionWinners && dimensionWinners.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-[#232328] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-[#71717A] uppercase tracking-wider font-semibold text-[10px] shrink-0 font-mono">
              Dimension Winners:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              {dimensionWinners.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#18181f] border border-[#2d2d38] text-white whitespace-nowrap"
                  >
                    <Icon size={10} className="text-[#A78BFA]" />
                    <span className="text-[#A1A1AA]">{item.dimension}:</span>
                    <strong className="text-white font-semibold">{item.winner}</strong>
                    <span className="text-[9.5px] font-mono text-[#10B981]">({item.stat})</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
