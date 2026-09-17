import React, { useState, useEffect, useRef } from 'react';
import ActiveTrackCard from '../components/learn/ActiveTrackCard';
import ProgressionRail from '../components/learn/ProgressionRail';
import CurriculumGraph from '../components/learn/CurriculumGraph';
import RecommendedActions from '../components/learn/RecommendedActions';
import ConceptDiagramLab from '../components/learn/ConceptDiagramLab';
import LessonReaderModal from '../components/learn/LessonReaderModal';
import ConceptMatrixModal from '../components/learn/ConceptMatrixModal';

export default function LearnPage() {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Local storage persisted completed lessons
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      const saved = localStorage.getItem('orbit_completed_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleCompleteLesson = (id) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('orbit_completed_lessons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleOpenLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setIsLessonModalOpen(true);
  };

  const handleCloseLesson = () => {
    setIsLessonModalOpen(false);
  };

  const handleSignalFilter = (query) => {
    setSearchQuery(query);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Keyboard shortcut Cmd/Ctrl + K for local search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        // If event default wasn't already handled by global search
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ScrollSpy for subnav
  useEffect(() => {
    const sections = ['overview', 'continue-learning', 'learning-paths', 'recommended', 'featured-labs'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveNav(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isCurrentLessonComplete = completedLessons.includes('agent-first-lesson');

  return (
    <div className="bg-[#020204] text-[#F4F4F7] font-sans antialiased min-h-screen selection:bg-[#6E56CF] selection:text-white pb-28 relative overflow-x-hidden">
      {/* Atmospheric Gradient Meshes */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[500px] bg-gradient-to-tr from-[#6E56CF]/12 via-purple-600/5 to-transparent blur-[140px] pointer-events-none -z-10 animate-mesh"></div>
      <div className="fixed top-1/3 -right-20 w-[550px] h-[550px] bg-[#00E5FF]/8 blur-[160px] pointer-events-none -z-10 animate-mesh" style={{ animationDelay: '-6s' }}></div>
      <div className="fixed bottom-10 -left-20 w-[600px] h-[600px] bg-[#6E56CF]/8 blur-[170px] pointer-events-none -z-10 animate-mesh" style={{ animationDelay: '-11s' }}></div>

      {/* 1. STICKY SUBNAV BAR: TABS + TELEMETRY (STAYS VISIBLE ON SCROLL) */}
      <div className="sticky top-[48px] sm:top-[53px] z-40 bg-black/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Streamlined Subnav Pill Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'continue-learning', label: 'My Learning' },
              { id: 'learning-paths', label: 'Learning Paths' },
              { id: 'recommended', label: 'Recommended' },
              { id: 'featured-labs', label: 'Featured Labs' },
            ].map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                    isActive 
                      ? 'text-white bg-[#101017] border border-[#6E56CF]/60 shadow-[0_0_12px_rgba(110,86,207,0.25)]' 
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Essential Telemetry (Streak, Matrix, Progress) */}
          <div className="flex items-center gap-2.5 font-mono text-xs shrink-0 ml-auto">
            {/* 5-Day Streak Capsule */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 select-none text-xs">
              <span>🔥</span>
              <span className="font-bold">5d</span>
              <span className="text-zinc-500 hidden sm:inline">streak</span>
            </div>

            {/* Matrix Drawer Trigger */}
            <button 
              onClick={() => setIsGlossaryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101017] hover:bg-[#14141E] border border-white/10 hover:border-[#00E5FF]/50 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
              <span>Matrix</span>
            </button>

            {/* Profile Progress Ringlet */}
            <a 
              href="#continue-learning"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('continue-learning');
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#101017] border border-white/10 hover:border-[#6E56CF] transition-all group cursor-pointer text-xs"
            >
              <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="none" r="14" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <circle 
                    cx="18" 
                    cy="18" 
                    fill="none" 
                    r="14" 
                    stroke="#6E56CF" 
                    strokeDasharray="88" 
                    strokeDashoffset={isCurrentLessonComplete ? "0" : "25"} 
                    strokeWidth="3" 
                  />
                </svg>
              </div>
              <span className="text-zinc-200 group-hover:text-white font-medium">
                {isCurrentLessonComplete ? '100%' : '72%'} <span className="text-zinc-500 font-normal">Progress</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MONUMENTAL HERO SECTION (MATCHING SCREENSHOT) */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-14 border-b border-white/10" id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          {/* Left Column: Headline, Description, Search, Direct Triggers */}
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-white/10 bg-[#0A0A0E] text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"></span>
              <span>SPECIALIZED CURRICULUM DOSSIER</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">FOR FRONTIER AI SYSTEMS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-light tracking-tight text-white leading-[1.03]">
              Learn AI by building <br className="hidden sm:block"/>
              <span className="font-sans font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                production systems.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-sans font-normal leading-relaxed max-w-2xl">
              A rigorous dossier of autonomous swarms, PagedAttention memory layouts, sub-millisecond VLA robotics, and self-correcting reasoning loops. Zero fluff. Pure engineering.
            </p>

            {/* Centered Search Command Input with Instantaneous Topic Triggers */}
            <div className="pt-2 max-w-2xl">
              <div className="relative bg-[#0A0A0E] border border-white/15 rounded-xl focus-within:border-[#6E56CF] focus-within:shadow-[0_0_25px_rgba(110,86,207,0.3)] transition-all">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </div>
                <input 
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search concepts, CUDA kernels, tool schemas, or papers (e.g. GRPO, LangGraph, vLLM)..."
                  className="w-full bg-transparent border-0 pl-11 pr-24 py-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 font-mono focus:ring-0 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                  <kbd className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">⌘K</kbd>
                </div>
              </div>

              {/* Direct Triggers */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-600 mr-1">Direct triggers:</span>
                <button 
                  onClick={() => {
                    handleSignalFilter('ReAct Loops');
                    scrollToSection('continue-learning');
                  }}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-[#6E56CF]/60 hover:text-white transition-all cursor-pointer"
                >
                  ReAct Loops
                </button>
                <button 
                  onClick={() => {
                    handleSignalFilter('KV-Cache Paging');
                    scrollToSection('learning-paths');
                  }}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-[#00E5FF]/60 hover:text-white transition-all cursor-pointer"
                >
                  KV-Cache Paging
                </button>
                <button 
                  onClick={() => {
                    handleSignalFilter('OpenVLA 7-DoF');
                    scrollToSection('learning-paths');
                  }}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-[#F5A623]/60 hover:text-white transition-all cursor-pointer"
                >
                  OpenVLA 7-DoF
                </button>
                <button 
                  onClick={() => {
                    handleSignalFilter('DeepSeek GRPO');
                    scrollToSection('recommended');
                  }}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-emerald-500/60 hover:text-white transition-all cursor-pointer"
                >
                  DeepSeek GRPO
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Modular Illustrated Dossier Index Matrix */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-[#0A0A0E] border border-white/15 rounded-xl p-4 font-mono text-xs text-zinc-300 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] text-zinc-400 uppercase tracking-widest">
                <span>Dossier Index Matrix</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live Telemetry
                </span>
              </div>
              <div className="py-3 space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-zinc-400">
                  <span>ACTIVE DISCIPLINE:</span>
                  <span className="text-white font-bold">Agentic AI (Level 03)</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>UNLOCKED KERNELS:</span>
                  <span className="text-[#00E5FF] font-semibold">18 / 24 Modules</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>PRODUCTION BENCHMARK:</span>
                  <span className="text-[#F5A623] font-semibold">P99 84ms Latency</span>
                </div>
              </div>
              {/* Micro Architecture Flow Strip */}
              <div className="p-2.5 rounded bg-black/70 border border-white/10 mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="text-[#6E56CF] font-semibold">Prompt</span>
                <span className="text-zinc-600">→</span>
                <span className="text-zinc-200 bg-[#101017] px-1.5 py-0.5 rounded border border-white/10">ReAct Checkpoint</span>
                <span className="text-zinc-600">→</span>
                <span className="text-emerald-400 font-semibold">Tool Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="hairline-glow"></div>
      </div>

      {/* 4. ACTIVE TRACK IN-PROGRESS CARD */}
      <ActiveTrackCard 
        onResumeLesson={handleOpenLesson}
        isCompleted={isCurrentLessonComplete}
      />

      {/* 5. ANIMATED PROGRESSION RAIL */}
      <ProgressionRail />

      {/* 6. FULL CURRICULUM GRAPH */}
      <CurriculumGraph onOpenLesson={handleOpenLesson} />

      {/* 7. RECOMMENDED NEXT ACTIONS */}
      <RecommendedActions onOpenLesson={handleOpenLesson} />

      {/* 8. FEATURED LABS & SVG ARCHITECTURE DIAGRAM */}
      <ConceptDiagramLab onOpenLesson={handleOpenLesson} />

      {/* MODALS */}
      <LessonReaderModal 
        isOpen={isLessonModalOpen}
        onClose={handleCloseLesson}
        lessonId={activeLessonId}
        completedLessons={completedLessons}
        onToggleComplete={handleToggleCompleteLesson}
      />

      <ConceptMatrixModal 
        isOpen={isGlossaryModalOpen}
        onClose={() => setIsGlossaryModalOpen(false)}
      />
    </div>
  );
}
