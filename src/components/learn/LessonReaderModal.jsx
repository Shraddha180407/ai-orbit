import React, { useState, useEffect } from 'react';
import { LESSONS_CONTENT } from '../../data/learnData';

export default function LessonReaderModal({ 
  lessonId, 
  isOpen, 
  onClose,
  completedLessons = [],
  onToggleComplete
}) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lesson = LESSONS_CONTENT[lessonId] || LESSONS_CONTENT['agent-first-lesson'];
  const isCompleted = completedLessons.includes(lesson.id);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(lesson.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col justify-end transition-opacity duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Sheet Container */}
      <div className="relative w-full h-[94vh] bg-[#09090D] border-t border-[#161622] rounded-t-3xl flex flex-col overflow-hidden shadow-2xl z-10 animate-in slide-in-from-bottom duration-300">
        {/* Top Handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1 rounded-full bg-zinc-700 hover:bg-zinc-500 transition-colors"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-3.5 border-b border-[#161622] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#6E56CF]/15 text-[#6E56CF] border border-[#6E56CF]/30">
              {lesson.badge}
            </span>
            <span className="text-xs font-mono text-[#A1A1B5] truncate">
              {lesson.breadcrumb}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className="w-8 h-8 rounded-lg bg-[#050508] hover:bg-zinc-800 border border-[#161622] flex items-center justify-center text-[#A1A1B5] hover:text-white transition-colors cursor-pointer"
              title="Bookmark Lesson"
            >
              <svg 
                className="w-4 h-4" 
                fill={bookmarked ? "#6E56CF" : "none"} 
                stroke={bookmarked ? "#6E56CF" : "currentColor"} 
                viewBox="0 0 24 24"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#050508] hover:bg-[#13131C] border border-[#161622] flex items-center justify-center text-[#A1A1B5] hover:text-white transition-colors cursor-pointer text-sm font-mono"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-[#050508] h-1">
          <div 
            className="bg-gradient-to-r from-[#6E56CF] via-[#00E5FF] to-emerald-400 h-full transition-all duration-500 shimmer-bar relative"
            style={{ width: isCompleted ? '100%' : '72%' }}
          ></div>
        </div>

        {/* Scrollable Lesson Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-zinc-300 font-sans text-sm leading-relaxed max-w-4xl mx-auto w-full">
          <div>
            <div className="text-xs font-mono text-[#8E8EA0] mb-1">
              {lesson.remainingTime}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
              {lesson.title}
            </h1>
          </div>

          <p className="text-[#A1A1B5] leading-relaxed">
            {lesson.overview}
          </p>

          {/* Runnable Sandbox Snippet */}
          <div className="bg-[#050508] border border-[#161622] rounded-xl overflow-hidden font-mono text-xs">
            <div className="px-4 py-2.5 bg-[#13131C] border-b border-[#161622] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="text-zinc-400 ml-1">{lesson.filename}</span>
              </div>

              <button 
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span className={copied ? "text-emerald-400 font-bold" : ""}>
                  {copied ? 'Copied!' : 'Copy Code'}
                </span>
              </button>
            </div>

            <pre className="p-4 text-zinc-300 overflow-x-auto leading-relaxed font-mono">
              <code>{lesson.code}</code>
            </pre>
          </div>

          {/* Key Takeaways */}
          <div className="p-4 bg-[#050508] rounded-xl border border-[#161622] space-y-2">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Key Architectural Takeaways
            </div>
            <ul className="text-xs text-[#A1A1B5] space-y-1.5 list-disc list-inside">
              {lesson.takeaways.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 border-t border-[#161622] bg-black/80 backdrop-blur-xl flex items-center justify-between">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={isCompleted}
              onChange={() => onToggleComplete(lesson.id)}
              className="w-4 h-4 rounded bg-[#050508] border-zinc-700 text-[#6E56CF] focus:ring-[#6E56CF] cursor-pointer"
            />
            <span className="text-xs font-mono text-zinc-300">
              Mark Lesson as Complete (+50 XP)
            </span>
          </label>

          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#6E56CF] hover:bg-[#5E44C5] active:scale-95 text-white font-mono text-xs font-semibold transition-all shadow-[0_0_20px_rgba(110,86,207,0.5)] cursor-pointer"
          >
            Complete &amp; Next Unit →
          </button>
        </div>
      </div>
    </div>
  );
}
