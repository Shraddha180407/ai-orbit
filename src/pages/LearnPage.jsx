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

      {/* STICKY FLOATING SUB-NAVIGATION PILL BAR */}
      <div className="sticky top-[58px] z-40 py-2.5 px-4 pointer-events-none flex justify-center">
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

      {/* HERO SECTION: HEADLINE & INTERACTIVE TOPOLOGY GRAPH */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-16 relative" id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6E56CF]/15 border border-[#6E56CF]/30 text-xs font-mono text-[#C4B5FD]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse"></span>
                <span>Knowledge Topology Architecture 2026</span>
              </div>

              {/* 5-Day Streak Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs font-mono text-amber-400 select-none shadow-[0_0_12px_rgba(245,166,35,0.15)]">
                <span className="text-sm">🔥</span>
                <span className="font-semibold tracking-wide">5-day streak</span>
              </div>

              {/* Concept Matrix Button */}
              <button 
                onClick={() => setIsGlossaryModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101017] hover:bg-[#13131C] border border-[#161622] hover:border-[#00E5FF]/50 text-xs text-[#A1A1B5] hover:text-white font-mono transition-all hover:shadow-[0_0_14px_rgba(0,229,255,0.18)] active:scale-95 cursor-pointer"
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
                className="flex items-center gap-2 pl-2 pr-3 py-0.5 rounded-full bg-[#101017] hover:bg-zinc-900 border border-[#161622] hover:border-[#6E56CF]/60 text-xs font-mono transition-all group cursor-pointer"
              >
                <svg className="w-5 h-5 circle-progress" viewBox="0 0 36 36">
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
                <span className="text-zinc-200 group-hover:text-white font-medium text-[11px]">
                  {isCurrentLessonComplete ? '100%' : '72%'} <span className="text-[#8E8EA0] font-normal">Mastery</span>
                </span>
              </a>
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

            {/* Search Bar with ⌘K */}
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

            {/* Topic Filter Tags */}
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

          {/* Right Column: Interactive Illustrated SVG Topology Map */}
          <div className="lg:col-span-5">
            <InteractiveTopologyMap onOpenLesson={handleOpenLesson} />
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
