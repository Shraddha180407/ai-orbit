import React from 'react';
import { Trophy, TrendingUp, Flame, Zap, Unlock } from 'lucide-react';

const ICON_MAP = {
  Trophy,
  TrendingUp,
  Flame,
  Zap,
  Unlock
};

export default function PerspectiveTabs({
  perspectives = [],
  activePerspective = 'overall',
  onSelectPerspective,
  perspectiveCounts = {},
  onOpenMethodology
}) {
  const activeTab = perspectives.find((p) => p.id === activePerspective);
  const rankingPerspectives = perspectives.filter((p) => p.id !== 'open_weights');
  const filterPerspectives = perspectives.filter((p) => p.id === 'open_weights');

  return (
    <div className="relative mb-6 sm:mb-8">
      <div className="flex items-center overflow-x-auto scrollbar-none pb-1.5 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {/* Primary Ranking Perspectives */}
        <div className="flex items-center gap-2 shrink-0">
          {rankingPerspectives.map((tab) => {
            const Icon = ICON_MAP[tab.icon] || Trophy;
            const isActive = activePerspective === tab.id;
            const count = perspectiveCounts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => onSelectPerspective(tab.id)}
                className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-white text-black border-white shadow-md shadow-white/10 ring-2 ring-white/20 font-bold'
                    : 'bg-[#141418] text-[#D4D4D8] hover:text-white border-[#2A2A32] hover:border-white/30 hover:bg-[#1A1A20]'
                }`}
                title={tab.description}
                aria-pressed={isActive}
              >
                <Icon
                  size={14}
                  className={`transition-colors shrink-0 ${
                    isActive ? 'text-black' : 'text-[#A1A1AA] group-hover:text-white'
                  }`}
                />
                <span>{tab.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-black/15 text-black'
                        : 'bg-[#22222A] text-[#A1A1AA] border border-[#2E2E38] group-hover:text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Distinct Divider separating rankings from Open Weights architectural filter */}
        {filterPerspectives.length > 0 && (
          <>
            <div className="h-5 w-[1px] bg-[#3F3F46] mx-3 shrink-0" aria-hidden="true" />

            {/* Filter Pills (Open Weights) */}
            <div className="flex items-center gap-2 shrink-0">
              {filterPerspectives.map((tab) => {
                const Icon = ICON_MAP[tab.icon] || Unlock;
                const isActive = activePerspective === tab.id;
                const count = perspectiveCounts[tab.id];

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectPerspective(tab.id)}
                    className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 active:scale-95 ${
                      isActive
                        ? 'bg-white text-black border-white shadow-md shadow-white/10 ring-2 ring-white/20 font-bold'
                        : 'bg-[#141418] text-[#D4D4D8] hover:text-white border-[#2A2A32] hover:border-white/30 hover:bg-[#1A1A20]'
                    }`}
                    title={tab.description}
                    aria-pressed={isActive}
                  >
                    <Icon
                      size={14}
                      className={`transition-colors shrink-0 ${
                        isActive ? 'text-black' : 'text-[#A1A1AA] group-hover:text-white'
                      }`}
                    />
                    <span>{tab.label}</span>
                    {typeof count === 'number' && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                          isActive
                            ? 'bg-black/15 text-black'
                            : 'bg-[#22222A] text-[#A1A1AA] border border-[#2E2E38] group-hover:text-white'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Active tab description & ranking explanation trigger */}
      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#8E8EA0] pl-0.5">
        {activeTab?.description ? (
          <p>
            <span className="text-white font-semibold">{activeTab.label}:</span>{' '}
            {activeTab.description}
          </p>
        ) : <div />}

        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1 text-[#A1A1AA] hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>Methodology &amp; Provenance</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
