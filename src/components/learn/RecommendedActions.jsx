import React from 'react';
import { RECOMMENDED_ACTIONS } from '../../data/learnData';

export default function RecommendedActions({ onOpenLesson }) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24" id="recommended">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#161622]/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#6E56CF]/15 border border-[#6E56CF]/30 text-[11px] font-mono font-semibold text-[#6E56CF]">
              Personalized Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white">
              Recommended Next Actions
            </h2>
          </div>
          <p className="text-xs text-[#8E8EA0] font-mono mt-1">
            Calculated from your active progress in Agentic AI Architectures
          </p>
        </div>
        <div className="text-xs font-mono text-[#A1A1B5]">
          Based on: <span className="text-white">Unit 08 ReAct Completion</span>
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECOMMENDED_ACTIONS.map((rec) => {
          const isOrbit = rec.accent === 'orbit';
          const isEmerald = rec.accent === 'emerald';
          const isAmber = rec.accent === 'amber';

          const borderHover = isOrbit
            ? 'hover:border-[#6E56CF]/50'
            : isEmerald
            ? 'hover:border-emerald-500/50'
            : 'hover:border-amber-500/50';

          const titleHover = isOrbit
            ? 'group-hover:text-[#6E56CF]'
            : isEmerald
            ? 'group-hover:text-emerald-400'
            : 'group-hover:text-amber-400';

          const btnBg = isOrbit
            ? 'bg-[#6E56CF]/20 hover:bg-[#6E56CF]'
            : isEmerald
            ? 'bg-emerald-500/20 hover:bg-emerald-500'
            : 'bg-amber-500/20 hover:bg-amber-500';

          const levelColor = isOrbit
            ? 'text-zinc-400'
            : isEmerald
            ? 'text-emerald-400'
            : 'text-amber-400';

          return (
            <div
              key={rec.id}
              className={`bg-[#09090D] border border-[#161622] ${borderHover} rounded-2xl p-6 transition-all group flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded-full ${
                    isAmber ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400' : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  } font-bold`}>
                    {rec.matchScore}
                  </span>
                  <span className="text-[#8E8EA0]">{rec.duration}</span>
                </div>

                <h3 className={`text-lg font-display font-bold text-white ${titleHover} transition-colors`}>
                  {rec.title}
                </h3>

                <p className="text-xs text-[#A1A1B5] font-sans leading-relaxed">
                  {rec.desc}
                </p>

                <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-[#8E8EA0]">
                  {rec.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#050508] border border-[#161622]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#161622] flex items-center justify-between">
                <span className={`text-xs font-mono ${levelColor}`}>{rec.level}</span>
                <button
                  onClick={() => onOpenLesson(rec.lessonId)}
                  className={`px-3.5 py-1.5 rounded-xl ${btnBg} text-white font-mono text-xs font-semibold transition-all cursor-pointer`}
                >
                  Launch Lab →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
