import React, { useState, useEffect, useRef } from 'react';
import InteractiveTopologyMap from '../components/learn/InteractiveTopologyMap';
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
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState('agent-first-lesson');
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Local storage persisted state
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

  const handleOpenLesson = (id = 'agent-first-lesson') => {
    setActiveLessonId(id);
    setIsLessonModalOpen(true);
  };

  const handleCloseLesson = () => {
    setIsLessonModalOpen(false);
  };

  // Signal filter trigger
  const handleSignalFilter = (query) => {
    setSearchQuery(query);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Keyboard shortcut Cmd/Ctrl + K and Cmd/Ctrl + J
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsLessonModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ScrollSpy for subnav highlighting
  useEffect(() => {
    const sections = [
      { id: 'overview', nav: 'overview' },
      { id: 'continue-learning', nav: 'my-learning' },
      { id: 'learning-paths', nav: 'learning-paths' },
      { id: 'recommended', nav: 'recommended' },
      { id: 'featured-labs', nav: 'featured-labs' }
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveNav(sections[i].nav);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (navId) => {
    setActiveNav(navId);
    const targetMap = {
      'overview': 'overview',
      'my-learning': 'continue-learning',
      'learning-paths': 'learning-paths',
      'recommended': 'recommended',
      'featured-labs': 'featured-labs'
    };
    const targetEl = document.getElementById(targetMap[navId]);
    if (targetEl) {
      const offset = 110;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetEl.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isCurrentLessonComplete = completedLessons.includes('agent-first-lesson');

  return (
    <div className="bg-[#020204] text-[#F4F4F7] font-sans antialiased min-h-screen selection:bg-[#6E56CF] selection:text-white pb-32 relative overflow-x-hidden">
      {/* Ambient Gradient Meshes */}
      <div className="fixed top-0 left-1/4 w-[650px] h-[500px] bg-gradient-to-tr from-[#6E56CF]/12 via-purple-600/5 to-transparent blur-[140px] pointer-events-none -z-10 animate-mesh"></div>
      <div className="fixed top-1/3 -right-20 w-[550px] h-[550px] bg-[#00E5FF]/8 blur-[160px] pointer-events-none -z-10 animate-mesh" style={{ animationDelay: '-6s' }}></div>
      <div className="fixed bottom-10 -left-20 w-[600px] h-[600px] bg-[#6E56CF]/8 blur-[170px] pointer-events-none -z-10 animate-mesh" style={{ animationDelay: '-11s' }}></div>

      {/* ========================================================================= */}
      {/* STICKY SECOND HEADER: SUBNAV PILL TABS + TELEMETRY (PERMANENTLY VISIBLE)  */}
      {/* ========================================================================= */}
      <header className="sticky top-[48px] sm:top-[52px] z-40 bg-[#09090D]/95 backdrop-blur-2xl border-b border-[#161622] px-4 sm:px-6 py-2.5 transition-all shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Streamlined Subnav Pill Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5 max-w-full">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'my-learning', label: 'My Learning' },
              { id: 'learning-paths', label: 'Learning Paths' },
              { id: 'recommended', label: 'Recommended' },
              { id: 'featured-labs', label: 'Featured Labs' },
            ].map((tab) => {
              const isActive = activeNav === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white bg-[#13131C] border border-[#202030] shadow-sm shadow-[#6E56CF]/20 font-bold'
                      : 'text-[#8E8EA0] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Only Necessary Things (Streak, Matrix, Progress) */}
          <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-xs ml-auto shrink-0">
            {/* 🔥 5-day streak */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 select-none shadow-[0_0_12px_rgba(245,166,35,0.15)]">
              <span>🔥</span>
              <span className="font-bold">5-day streak</span>
            </div>

            {/* • Matrix Drawer Button */}
            <button
              onClick={() => setIsGlossaryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101017] hover:bg-[#13131C] border border-[#161622] hover:border-[#00E5FF]/50 text-xs text-[#A1A1B5] hover:text-white font-mono transition-all hover:shadow-[0_0_14px_rgba(0,229,255,0.18)] active:scale-95 cursor-pointer"
              title="Open Frontier Concept Matrix"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
              <span>Matrix</span>
            </button>

            {/* 72% Progress */}
            <button
              onClick={() => scrollToSection('my-learning')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#101017] hover:bg-zinc-900 border border-[#161622] hover:border-[#6E56CF]/60 text-xs font-mono transition-all group cursor-pointer"
              title="Jump to Current Progress"
            >
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" fill="none" r="14" stroke="#242430" strokeWidth="3" />
                  <circle 
                    cx="18" 
                    cy="18" 
                    fill="none" 
                    r="14" 
                    stroke="#6E56CF" 
                    strokeDasharray="88" 
                    strokeDashoffset={isCurrentLessonComplete ? "0" : "25"} 
                    strokeWidth="3"
                    className="transition-all duration-500" 
                  />
                </svg>
              </div>
              <span className="text-zinc-200 group-hover:text-white font-medium text-[11px] whitespace-nowrap">
                {isCurrentLessonComplete ? '100%' : '72%'} <span className="hidden sm:inline text-[#8E8EA0] font-normal">Progress</span>
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW: HERO HEADLINE & INTERACTIVE KNOWLEDGE TOPOLOGY SVG           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 relative" id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/30 text-xs font-mono text-[#C4B5FD]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
              <span>Knowledge Topology Architecture 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-[1.03]">
              Learn AI by building <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                real systems.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#A1A1B5] font-normal leading-relaxed max-w-xl">
              Navigate connected skill topologies across autonomous agents, inference engines, vision-language-action policies, and production kernels.
            </p>

            {/* Search Input with ⌘K */}
            <div className="relative max-w-xl glow-input group rounded-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#00E5FF] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
              <input 
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Explore skill trees, modules, or CUDA kernels..."
                className="w-full bg-[#09090D] border border-[#202030] hover:border-zinc-700 focus:border-[#6E56CF] rounded-2xl pl-12 pr-28 py-3.5 text-sm text-white placeholder-zinc-500 font-sans focus:outline-none transition-all shadow-xl"
              />
              <div className="absolute inset-y-0 right-3.5 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-[#161622] text-[10px] text-zinc-400 font-mono">
                  Press ⌘K
                </span>
              </div>
            </div>

            {/* Signal Filters */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#A1A1B5] pt-1">
              <span className="text-[#8E8EA0] font-medium mr-1">Signal Filters:</span>
              <button 
                onClick={() => handleSignalFilter('LangGraph Agents')}
                className="hover:text-white hover:border-[#6E56CF]/60 hover:bg-[#101017] px-2.5 py-1 rounded-lg border border-[#161622] bg-[#09090D] transition-all cursor-pointer"
              >
                Agents
              </button>
              <span className="text-zinc-700">·</span>
              <button 
                onClick={() => handleSignalFilter('PagedAttention')}
                className="hover:text-white hover:border-[#6E56CF]/60 hover:bg-[#101017] px-2.5 py-1 rounded-lg border border-[#161622] bg-[#09090D] transition-all cursor-pointer"
              >
                Inference
              </button>
              <span className="text-zinc-700">·</span>
              <button 
                onClick={() => handleSignalFilter('OpenVLA')}
                className="hover:text-white hover:border-[#6E56CF]/60 hover:bg-[#101017] px-2.5 py-1 rounded-lg border border-[#161622] bg-[#09090D] transition-all cursor-pointer"
              >
                Robotics
              </button>
              <span className="text-zinc-700">·</span>
              <button 
                onClick={() => handleSignalFilter('RAG Rerank')}
                className="hover:text-white hover:border-[#6E56CF]/60 hover:bg-[#101017] px-2.5 py-1 rounded-lg border border-[#161622] bg-[#09090D] transition-all cursor-pointer"
              >
                RAG &amp; Embeddings
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Illustrated SVG Knowledge Topology */}
          <div className="lg:col-span-5">
            <InteractiveTopologyMap onOpenLesson={handleOpenLesson} />
          </div>
        </div>
      </section>

      {/* Hairline Divider */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="hairline-glow"></div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MY LEARNING: ACTIVE TRACK IN-PROGRESS CARD                             */}
      {/* ========================================================================= */}
      <ActiveTrackCard 
        onResumeLesson={handleOpenLesson}
        isCompleted={isCurrentLessonComplete}
      />

      {/* ========================================================================= */}
      {/* 3. AI ENGINEERING PROGRESSION RAIL                                        */}
      {/* ========================================================================= */}
      <ProgressionRail />

      {/* ========================================================================= */}
      {/* 4. LEARNING PATHS: FULL CURRICULUM GRAPH (4 EXPANDING PATH CARDS)         */}
      {/* ========================================================================= */}
      <CurriculumGraph onOpenLesson={handleOpenLesson} />

      {/* ========================================================================= */}
      {/* 5. RECOMMENDED: RECOMMENDED NEXT ACTIONS                                  */}
      {/* ========================================================================= */}
      <RecommendedActions onOpenLesson={handleOpenLesson} />

      {/* ========================================================================= */}
      {/* 6. FEATURED LABS: INTERACTIVE CONCEPT DIAGRAMS & LABS (RAG SVG PIPELINE)  */}
      {/* ========================================================================= */}
      <ConceptDiagramLab onOpenLesson={handleOpenLesson} />

      {/* ========================================================================= */}
      {/* MODALS: LESSON READER & CONCEPT MATRIX                                    */}
      {/* ========================================================================= */}
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
