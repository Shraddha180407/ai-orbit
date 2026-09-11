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

  return (
    <div className="relative mb-6 sm:mb-8">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {perspectives.map((tab) => {
          const Icon = ICON_MAP[tab.icon] || Trophy;
          const isActive = activePerspective === tab.id;
          const count = perspectiveCounts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onSelectPerspective(tab.id)}
              className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#6E56CF]/20 text-[#A78BFA] border-[#6E56CF]/50 shadow-md shadow-[#6E56CF]/10'
                  : 'bg-[#131316]/80 text-[#A1A1AA] hover:text-white border-[#232326] hover:border-white/20 hover:bg-[#18181c]'
              }`}
              title={tab.description}
            >
              <Icon
                size={13}
                className={`transition-colors ${
                  isActive ? 'text-[#A78BFA]' : 'text-[#71717A] group-hover:text-white'
                }`}
              />
              <span>{tab.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-[#6E56CF]/30 text-[#A78BFA]'
                      : 'bg-[#27272e] text-[#A1A1AA] group-hover:text-[#A1A1AA]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active tab description & ranking explanation trigger */}
      <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-[#71717A] pl-0.5">
        {activeTab?.description ? (
          <p>
            <span className="text-[#A78BFA] font-semibold">{activeTab.label}:</span>{' '}
            {activeTab.description}
          </p>
        ) : <div />}

        {onOpenMethodology && (
          <button
            onClick={onOpenMethodology}
            className="inline-flex items-center gap-1 text-[#A78BFA] hover:text-white transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>How ranking works</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
