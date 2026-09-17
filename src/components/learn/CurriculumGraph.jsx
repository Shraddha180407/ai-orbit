import React from 'react';
import { CURRICULUM_PATHS } from '../../data/learnData';

export default function CurriculumGraph({ onOpenLesson }) {
  return (
    <section className="max-w-7xl mx-auto px-6 mb-24" id="learning-paths">
      <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#161622]/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white">
            Full Curriculum Graph
          </h2>
          <p className="text-xs text-[#8E8EA0] font-mono mt-1">
            Hover or tap cards to expand extended syllabus modules and sandboxes
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-[#A1A1B5]">
          <span className="hidden sm:inline">Interactive Syllabus Preview</span>
        </div>
      </div>

      {/* 4 Expanding Path Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CURRICULUM_PATHS.map((path) => (
          <div
            key={path.id}
            onClick={() => onOpenLesson(path.lessonId)}
            className={`expand-card bg-[#09090D] border border-[#161622] ${path.borderHover} rounded-2xl p-6 flex flex-col justify-between group cursor-pointer`}
          >
            <div>
              {/* Thumbnail Motif Area */}
              <div className={`h-28 w-full rounded-xl bg-gradient-to-br ${path.bgGradient} border border-[#161622]/80 p-3.5 mb-4 flex flex-col justify-between relative overflow-hidden`}>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span 
                    className="px-2 py-0.5 rounded font-semibold border"
                    style={{
                      backgroundColor: `${path.accentColor}25`,
                      borderColor: `${path.accentColor}40`,
                      color: path.accentColor === '#6E56CF' ? '#C4B5FD' : path.accentColor
                    }}
                  >
                    {path.pathNumber}
                  </span>
                  
                  {path.isActive ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                    </span>
                  ) : (
                    <span className="text-[#8E8EA0]">{path.status}</span>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-mono" style={{ color: path.accentColor }}>
                    {path.category}
                  </div>
                  <div className="text-base font-display font-bold text-white">
                    {path.shortName}
                  </div>
                </div>
              </div>

              <div className="text-[11px] font-mono text-[#8E8EA0] mb-1.5">
                {path.stats}
              </div>

              <h3 className="text-base font-display font-bold text-white group-hover:text-[#B8A4FF] transition-colors">
                {path.title}
              </h3>

              <p className="text-xs text-[#8E8EA0] font-sans mt-1 leading-relaxed">
                {path.desc}
              </p>

              {/* Hidden Expandable Extended Syllabus */}
              <div className="expand-card-body pt-2 border-t border-[#161622]/70 text-xs font-mono">
                <div className="text-[11px] font-semibold text-white uppercase tracking-wider mb-2">
                  Detailed Syllabus
                </div>
                <ul className="space-y-1.5 text-[#A1A1B5] text-[11px]">
                  {path.syllabus.map((item, idx) => {
                    const isDone = item.status === 'done';
                    const isActive = item.status === 'active';
                    return (
                      <li key={idx} className={`flex items-center gap-1.5 ${
                        isDone ? 'text-emerald-400' : isActive ? 'text-[#6E56CF] font-bold' : 'text-zinc-500'
                      }`}>
                        <span>{isDone ? '✓' : isActive ? '●' : '○'}</span>
                        <span>{item.num}. {item.title}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 p-2 bg-[#050508] rounded-lg text-[10px] text-[#8E8EA0] flex items-center justify-between">
                  <span>{path.sandbox}</span>
                  <span className={path.isActive ? 'text-[#00E5FF]' : 'text-emerald-400'}>
                    {path.sandboxStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-[#161622]/60 flex items-center justify-between">
              <span className={`text-xs font-mono ${path.isActive ? 'text-emerald-400' : 'text-[#8E8EA0]'}`}>
                {path.progress}
              </span>
              <span className="text-xs font-mono text-white group-hover:translate-x-1 transition-transform">
                {path.isActive ? 'Continue →' : 'Inspect →'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
