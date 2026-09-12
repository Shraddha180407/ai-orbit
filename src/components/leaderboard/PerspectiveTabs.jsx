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
      <div className="flex items-center overflow-x-auto scrollbar-none pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {/* Ranking Perspective Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {rankingPerspectives.map((tab) => {
            const Icon = ICON_MAP[tab.icon] || Trophy;
            const isActive = activePerspective === tab.id;
            const count = perspectiveCounts[tab.id];

            return (
              <button
                key={tab.id}
                onClick={() => onSelectPerspective(tab.id)}
                className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-[#121215] text-[#A1A1AA] hover:text-white border-[#222226] hover:border-white/20 hover:bg-[#18181c]'
                }`}
                title={tab.description}
              >
                <Icon
                  size={12}
                  className={`transition-colors ${
                    isActive ? 'text-black' : 'text-[#71717A] group-hover:text-white'
                  }`}
                />
                <span>{tab.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-black/15 text-black'
                        : 'bg-[#1e1e24] text-[#71717A] border border-[#27272e]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Distinct Divider & Spacing Gap separating ranking perspectives from architecture filter */}
        {filterPerspectives.length > 0 && (
          <>
            <div className="h-4 sm:h-5 w-[1px] bg-[#3F3F46] mx-2.5 shrink-0" aria-hidden="true" />
            
            {/* Filter Pills (Open Weights) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {filterPerspectives.map((tab) => {
                const Icon = ICON_MAP[tab.icon] || Unlock;
                const isActive = activePerspective === tab.id;
                const count = perspectiveCounts[tab.id];

                return (
                  <button
                    key={tab.id}
                    onClick={() => onSelectPerspective(tab.id)}
                    className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-white text-black border-white shadow-sm'
                        : 'bg-[#121215] text-[#A1A1AA] hover:text-white border-[#222226] hover:border-white/20 hover:bg-[#18181c]'
                    }`}
                    title={tab.description}
                  >
                    <Icon
                      size={12}
                      className={`transition-colors ${
                        isActive ? 'text-black' : 'text-[#71717A] group-hover:text-white'
                      }`}
                    />
                    <span>{tab.label}</span>
                    {typeof count === 'number' && (
                      <span
                        className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-black/15 text-black'
                            : 'bg-[#1e1e24] text-[#71717A] border border-[#27272e]'
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
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#71717A] pl-0.5">
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
            <span>Methodology &amp; Trust</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
