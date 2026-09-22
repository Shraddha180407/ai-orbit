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
    <div className="relative mb-4 sm:mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1.5">
        <div className="flex items-center overflow-x-auto scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
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
                      : 'bg-[#16161B] text-[#F4F4F5] hover:text-white border-[#2D2D38] hover:border-white/50 hover:bg-[#1E1E26]'
                  }`}
                  title={tab.description}
                  aria-pressed={isActive}
                >
                  <Icon
                    size={14}
                    className={`transition-colors shrink-0 ${
                      isActive ? 'text-black' : 'text-[#A78BFA] group-hover:text-white'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-black/15 text-black'
                          : 'bg-[#282834] text-white border border-[#3F3F4E] group-hover:bg-[#343444]'
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
              <div className="h-5 w-[1px] bg-[#52525B] mx-3 shrink-0" aria-hidden="true" />

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
                          : 'bg-[#16161B] text-[#F4F4F5] hover:text-white border-[#2D2D38] hover:border-white/50 hover:bg-[#1E1E26]'
                      }`}
                      title={tab.description}
                      aria-pressed={isActive}
                    >
                      <Icon
                        size={14}
                        className={`transition-colors shrink-0 ${
                          isActive ? 'text-black' : 'text-[#A78BFA] group-hover:text-white'
                        }`}
                      />
                      <span>{tab.label}</span>
                      {typeof count === 'number' && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-colors ${
                            isActive
                              ? 'bg-black/15 text-black'
                              : 'bg-[#282834] text-white border border-[#3F3F4E] group-hover:bg-[#343444]'
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

        {/* Methodology & Provenance moved up to same row as perspective tabs */}
        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-[#A78BFA] hover:text-white transition-colors cursor-pointer bg-[#6E56CF]/15 hover:bg-[#6E56CF]/30 px-3 py-1.5 rounded-lg border border-[#6E56CF]/40 shadow-sm ml-auto"
          >
            <span>Methodology &amp; Provenance</span>
            <span className="text-sm font-extrabold">→</span>
          </button>
        )}
      </div>

      {/* Active tab description */}
      {activeTab?.description && (
        <div className="mt-1.5 text-xs text-[#E4E4E7] pl-0.5">
          <p className="flex items-center gap-1.5 text-xs text-[#E4E4E7]">
            <span className="text-white font-bold">{activeTab.label}:</span>{' '}
            <span className="text-[#D4D4D8]">{activeTab.description}</span>
          </p>
        </div>
      )}
    </div>
  );
}
