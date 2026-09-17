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

      {/* 1. TOP MINIMALIST EDITORIAL NAV */}
      <header className="sticky top-0 z-50 bg-[#020204]/90 backdrop-blur-xl border-b border-[#161622]/80 px-6 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Monogram & Brand */}
          <div className="flex items-center gap-8">
            <a className="flex items-center gap-2.5 group" href="#">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white via-zinc-400 to-zinc-900 p-[1px] flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#020204] rounded-full flex items-center justify-center relative">
                  <span className="w-2 h-2 rounded-full bg-[#6E56CF] group-hover:scale-125 group-hover:shadow-[0_0_12px_#6E56CF] transition-all"></span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-black tracking-widest text-white uppercase">AI Orbit</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#6E56CF]/20 border border-[#6E56CF]/40 text-[#C4B5FD] font-mono">TOPOLOGY v2</span>
                </div>
                <span className="text-[9px] font-mono tracking-widest text-[#8E8EA0] uppercase">Frontier Systems Graph</span>
              </div>
            </a>
            <div className="hidden lg:flex items-center gap-5 text-xs font-mono text-[#A1A1B5] pl-6 border-l border-[#161622]">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Cluster: 99.98%
              </span>
              <span className="text-zinc-700">/</span>
              <span className="text-[#8E8EA0]">4 Tracks</span>
              <span className="text-zinc-700">/</span>
              <span className="text-[#8E8EA0]">164 Frontier Units</span>
            </div>
          </div>

          {/* Right Profile Telemetry Pill & Matrix */}
          <div className="flex items-center gap-3">
            {/* 5-Day Streak Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 hover:bg-amber-500/20 transition-all cursor-default select-none shadow-[0_0_12px_rgba(245,166,35,0.15)]">
              <span className="animate-bounce text-sm">🔥</span>
              <span className="font-semibold tracking-wide">5-day streak</span>
            </div>

            {/* Concept Matrix Button */}
            <button 
              onClick={() => setIsGlossaryModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101017] hover:bg-[#13131C] border border-[#161622] hover:border-[#00E5FF]/50 text-xs text-[#A1A1B5] hover:text-white font-mono transition-all hover:shadow-[0_0_14px_rgba(0,229,255,0.18)] active:scale-95 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
              <span>Matrix</span>
            </button>

            {/* Profile Progress Radial */}
            <a 
              href="#continue-learning"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('continue-learning');
              }}
              className="flex items-center gap-2 pl-2 pr-3.5 py-1 rounded-full bg-[#101017] hover:bg-zinc-900 border border-[#161622] hover:border-[#6E56CF]/60 text-xs font-mono transition-all group cursor-pointer"
            >
              <svg className="w-6 h-6 circle-progress" viewBox="0 0 36 36">
                <path className="text-zinc-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path 
                  className="text-[#6E56CF]" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeDasharray={isCurrentLessonComplete ? "100, 100" : "72, 100"} 
                  strokeLinecap="round" 
                  strokeWidth="3" 
                />
              </svg>
              <span className="text-zinc-200 group-hover:text-white font-medium">
                {isCurrentLessonComplete ? '100%' : '72%'} <span className="hidden md:inline text-[#8E8EA0] font-normal">Mastery</span>
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. STICKY FLOATING SUB-NAVIGATION PILL BAR (INTERACTIVE SECTION INDICATOR) */}
      <div className="sticky top-[61px] z-40 py-2.5 px-4 pointer-events-none flex justify-center">
        <nav className="pointer-events-auto bg-[#09090D]/90 backdrop-blur-xl border border-[#202030] rounded-full px-2 py-1 flex items-center gap-1 shadow-2xl text-[11px] font-mono text-[#8E8EA0]">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'continue-learning', label: 'Active Track' },
            { id: 'learning-paths', label: 'Curriculum Graph' },
            { id: 'recommended', label: 'Recommended' },
            { id: 'featured-labs', label: 'Featured Labs' },
          ].map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`subnav-link px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-white bg-[#13131C] border border-[#161622]' 
                    : 'hover:text-white hover:bg-[#101017]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. HERO SECTION: MASSIVE HEADLINE & INTERACTIVE KNOWLEDGE TOPOLOGY SVG */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 relative" id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0e0e16] border border-[#232336] text-[10px] font-mono tracking-wider text-zinc-300 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C65C1]"></span>
              <span>SPECIALIZED CURRICULUM DOSSIER</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-400 font-semibold">FOR FRONTIER AI SYSTEMS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl tracking-tight text-white leading-[1.05]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Learn AI by building<br />
              <span className="italic font-serif font-black tracking-tight text-white" style={{ fontStyle: 'italic' }}>
                production <span className="text-zinc-400 font-serif italic">systems.</span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-xl">
              A rigorous dossier of autonomous swarms, PagedAttention memory layouts, sub-millisecond VLA robotics, and self-correcting reasoning loops. Zero fluff. Pure engineering.
            </p>

            <div className="relative max-w-xl rounded-xl">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <input 
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts, CUDA kernels, tool schemas, or papers (e.g. GR"
                className="w-full bg-[#08080D] border border-zinc-800 hover:border-zinc-700 focus:border-[#6E56CF] rounded-xl pl-10 pr-14 py-3 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none transition-colors"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">⌘K</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-zinc-500 pt-1">
              <span className="mr-1 text-zinc-500">Direct triggers:</span>
              <button 
                onClick={() => {
                  handleSignalFilter('ReAct Loops');
                  scrollToSection('continue-learning');
                }}
                className="px-2 py-0.5 rounded border border-zinc-800 bg-[#09090E] hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                ReAct Loops
              </button>
              <button 
                onClick={() => {
                  handleSignalFilter('KV-Cache Paging');
                  scrollToSection('learning-paths');
                }}
                className="px-2 py-0.5 rounded border border-zinc-800 bg-[#09090E] hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                KV-Cache Paging
              </button>
              <button 
                onClick={() => {
                  handleSignalFilter('OpenVLA 7-DoF');
                  scrollToSection('learning-paths');
                }}
                className="px-2 py-0.5 rounded border border-zinc-800 bg-[#09090E] hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                OpenVLA 7-DoF
              </button>
              <button 
                onClick={() => {
                  handleSignalFilter('DeepSeek GRPD');
                  scrollToSection('recommended');
                }}
                className="px-2 py-0.5 rounded border border-zinc-800 bg-[#09090E] hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                DeepSeek GRPD
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-end">
            <div className="w-full max-w-md bg-[#08080C] border border-zinc-800/90 rounded-2xl p-5 font-mono shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-zinc-800/80">
                <span className="text-[11px] tracking-wider text-zinc-400 font-bold uppercase">DOSSIER INDEX MATRIX</span>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE TELEMETRY</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 tracking-wider text-[11px]">ACTIVE DISCIPLINE:</span>
                  <span className="font-bold text-white text-xs">Agentic AI (Level 03)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 tracking-wider text-[11px]">UNLOCKED KERNELS:</span>
                  <span className="font-bold text-cyan-400 text-xs">18 / 24 Modules</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 tracking-wider text-[11px]">PRODUCTION BENCHMARK:</span>
                  <span className="font-bold text-amber-400 text-xs">P99 84ms Latency</span>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <div className="p-2 rounded-xl bg-[#040407] border border-zinc-800/60 flex items-center justify-around text-xs">
                  <span className="text-[#9B87F5] font-medium">Prompt</span>
                  <span className="text-zinc-600 font-mono">→</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#13131C] border border-zinc-700 text-white font-semibold text-[11px]">ReAct Checkpoint</span>
                  <span className="text-zinc-600 font-mono">→</span>
                  <span className="text-emerald-400 font-semibold">Tool Execution</span>
                </div>
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
