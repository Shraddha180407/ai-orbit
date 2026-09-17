import React from 'react';
import { ACTIVE_TRACK } from '../../data/learnData';

export default function ActiveTrackCard({ onResumeLesson, progressPercent = 72, isCompleted = false }) {
  const currentProgress = isCompleted ? 100 : progressPercent;

  return (
    <section className="max-w-7xl mx-auto px-6 mb-20" id="continue-learning">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#161622]/80">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h2 className="text-xs font-mono font-bold tracking-widest text-[#A1A1B5] uppercase">
            ACTIVE TRACK IN-PROGRESS
          </h2>
        </div>
        <div className="text-xs font-mono text-[#8E8EA0]">
          Target: <strong className="text-white">{ACTIVE_TRACK.targetRole}</strong>
        </div>
      </div>

      {/* Expansive Card */}
      <div className="bg-[#09090D] border border-[#202030] hover:border-[#6E56CF]/50 rounded-3xl p-7 sm:p-8 transition-all relative overflow-hidden group shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#6E56CF]/12 rounded-full blur-3xl pointer-events-none group-hover:bg-[#6E56CF]/20 transition-all duration-700"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#6E56CF]/20 border border-[#6E56CF]/40 text-[#C4B5FD] font-semibold">
                {ACTIVE_TRACK.discipline}
              </span>
              <span className="text-[#8E8EA0]">•</span>
              <span className="text-emerald-400 font-medium">Unit 08 of 12</span>
              <span className="text-[#8E8EA0]">•</span>
              <span className="text-[#A1A1B5]">LangGraph State Checkpointing</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {ACTIVE_TRACK.unitTitle}
            </h3>

            <p className="text-sm text-[#A1A1B5] font-sans max-w-2xl leading-relaxed">
              {ACTIVE_TRACK.description}
            </p>

            {/* Shimmer Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-[#8E8EA0]">Track Mastery</span>
                <span className="text-emerald-400 font-bold">
                  {currentProgress}% Completed ({isCompleted ? '12/12 Lessons' : '8/12 Lessons'})
                </span>
              </div>
              <div className="w-full bg-[#050508] h-2.5 rounded-full overflow-hidden border border-[#161622] relative">
                <div 
                  className="bg-gradient-to-r from-[#6E56CF] via-purple-500 to-emerald-400 h-full rounded-full relative shimmer-bar shadow-[0_0_14px_rgba(52,211,153,0.35)] transition-all duration-500"
                  style={{ width: `${currentProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Up Next Preview Banner */}
            <div className="flex items-center gap-3 p-3 bg-[#13131C]/90 rounded-xl border border-[#161622]/70 text-xs font-mono text-[#8E8EA0]">
              <span className="text-[#6E56CF]">⏭ Up Next:</span>
              <span className="text-white font-medium">{ACTIVE_TRACK.nextUp}</span>
              <span className="text-zinc-600 hidden sm:inline">|</span>
              <span className="text-zinc-400 hidden sm:inline">{ACTIVE_TRACK.nextUpTime}</span>
            </div>
          </div>

          {/* Telemetry Metrics & Primary Launch Button */}
          <div className="lg:col-span-4 lg:border-l lg:border-[#161622]/80 lg:pl-8 flex flex-col justify-between gap-6">
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-[#050508] border border-[#161622] rounded-xl text-center">
                <div className="text-lg font-mono font-bold text-white">{ACTIVE_TRACK.investedHours}</div>
                <div className="text-[10px] font-mono text-[#8E8EA0] uppercase">Invested</div>
              </div>
              <div className="p-3 bg-[#050508] border border-[#161622] rounded-xl text-center">
                <div className="text-lg font-mono font-bold text-emerald-400">{isCompleted ? '12/12' : `${ACTIVE_TRACK.completedUnits}/${ACTIVE_TRACK.totalUnits}`}</div>
                <div className="text-[10px] font-mono text-[#8E8EA0] uppercase">Units</div>
              </div>
              <div className="p-3 bg-[#050508] border border-[#161622] rounded-xl text-center">
                <div className="text-lg font-mono font-bold text-amber-400">{ACTIVE_TRACK.streakDays} Days</div>
                <div className="text-[10px] font-mono text-[#8E8EA0] uppercase">Streak</div>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => onResumeLesson(ACTIVE_TRACK.lessonId)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6E56CF] hover:bg-[#5E44C5] active:scale-95 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(110,86,207,0.45)] hover:shadow-[0_0_40px_rgba(110,86,207,0.7)] hover:-translate-y-0.5 transition-all group/btn cursor-pointer"
              >
                <span>Resume Lesson 08</span>
                <span className="text-base leading-none transition-transform group-hover/btn:translate-x-1.5">→</span>
              </button>
              <div className="text-center font-mono text-[11px] text-zinc-500">
                Checkpoint saved {ACTIVE_TRACK.lastCheckpoint}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
