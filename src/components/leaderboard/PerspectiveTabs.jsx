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
  perspectiveCounts = {}
}) {
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
                  ? 'bg-white text-black border-white shadow-md shadow-white/10'
                  : 'bg-[#131316]/80 text-[#A1A1AA] hover:text-white border-[#232326] hover:border-white/20 hover:bg-[#18181c]'
              }`}
              title={tab.description}
            >
              <Icon
                size={13}
                className={`transition-colors ${
                  isActive
                    ? 'text-black'
                    : 'text-[#71717A] group-hover:text-white'
                }`}
              />
              <span>{tab.label}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-black/15 text-black'
                      : 'bg-[#1e1e24] text-[#71717A] group-hover:text-[#A1A1AA]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
