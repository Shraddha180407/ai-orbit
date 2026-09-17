import React from 'react';
import { PROGRESSION_LEVELS } from '../../data/learnData';

export default function ProgressionRail() {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24">
      <div className="bg-[#09090D] border border-[#161622] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-6 border-b border-[#161622]/80">
          <div>
            <h3 className="text-base font-display font-bold text-white">AI Engineering Progression Rail</h3>
            <p className="text-xs text-[#8E8EA0] font-mono">Real-time mastery levels across the system stack</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Current: Advanced Level
            </span>
          </div>
        </div>

        {/* Progression Rail Visual Nodes */}
        <div className="relative mt-8 pt-4 pb-2">
          {/* Connecting Line Background */}
          <div className="absolute top-9 left-6 right-6 h-0.5 bg-[#161622] hidden md:block"></div>
          
          {/* Active Progress Line */}
          <div className="absolute top-9 left-6 w-[70%] h-0.5 bg-gradient-to-r from-emerald-500 via-[#6E56CF] to-[#00E5FF] hidden md:block"></div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {PROGRESSION_LEVELS.map((level) => {
              const isCompleted = level.statusType === 'completed';
              const isActive = level.statusType === 'active';
              const isLocked = level.statusType === 'locked';

              return (
                <div 
                  key={level.id}
                  className={`flex flex-col items-start md:items-center text-left md:text-center group ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  {isCompleted && (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-mono text-xs font-bold mb-3 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      ✓
                    </div>
                  )}

                  {isActive && (
                    <div className="w-10 h-10 rounded-full bg-[#6E56CF]/30 border-2 border-[#6E56CF] flex items-center justify-center text-white font-mono text-xs font-bold mb-3 shadow-[0_0_20px_rgba(110,86,207,0.5)] animate-pulse">
                      ●
                    </div>
                  )}

                  {isLocked && (
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center text-zinc-500 font-mono text-xs font-bold mb-3">
                      🔒
                    </div>
                  )}

                  <div className={`font-mono text-xs font-bold ${isLocked ? 'text-zinc-300' : 'text-white'} flex items-center gap-1`}>
                    <span>{level.name}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"></span>}
                  </div>

                  <div className={`text-[11px] font-mono mt-0.5 ${
                    isCompleted ? 'text-emerald-400' : isActive ? 'text-[#6E56CF] font-bold' : 'text-zinc-500'
                  }`}>
                    {level.status}
                  </div>

                  <div className="text-[11px] text-[#8E8EA0] mt-1 max-w-[170px]">
                    {level.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
