import React, { useState, useEffect, useRef } from 'react';
import LessonReaderModal from '../components/learn/LessonReaderModal';
import ConceptMatrixModal from '../components/learn/ConceptMatrixModal';

export default function LearnPage() {
  const [activeNav, setActiveNav] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSandboxOpen, setIsSandboxOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState('agent-first-lesson');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
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

  const openLesson = (id = 'agent-first-lesson') => {
    setActiveLessonId(id);
    setIsSandboxOpen(true);
  };

  // Trigger topic search and scroll to track
  const handleTriggerTopic = (topic, targetId) => {
    setSearchQuery(topic);
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        setIsSandboxOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ScrollSpy for subnav highlighting
  useEffect(() => {
    const sections = [
      { id: 'overview', offset: 120 },
      { id: 'continue-learning', offset: 120 },
      { id: 'curriculum-runway', offset: 120 },
      { id: 'recommended-engine', offset: 120 },
      { id: 'architectural-schematic', offset: 120 }
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && scrollPos >= el.offsetTop) {
          const navMap = {
            'overview': 'overview',
            'continue-learning': 'my-learning',
            'curriculum-runway': 'learning-paths',
            'recommended-engine': 'recommended',
            'architectural-schematic': 'featured-labs'
          };
          setActiveNav(navMap[sections[i].id] || 'overview');
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
      'learning-paths': 'curriculum-runway',
      'recommended': 'recommended-engine',
      'featured-labs': 'architectural-schematic'
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
    <div className="bg-black text-[#ECECED] font-sans antialiased selection:bg-[#6E56CF] selection:text-white pb-32 relative overflow-x-hidden min-h-screen">
      {/* Ambient Blueprint Grid & Glow Atmosphere */}
      <div className="fixed inset-0 blueprint-grid pointer-events-none opacity-40 -z-20"></div>
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#6E56CF]/14 via-[#00E5FF]/6 to-transparent blur-[160px] pointer-events-none -z-10 animate-aura"></div>
      <div className="fixed bottom-0 right-[-100px] w-[500px] h-[500px] bg-[#6E56CF]/8 blur-[160px] pointer-events-none -z-10"></div>

      {/* ========================================================================= */}
      {/* UNIFIED STICKY SECOND HEADER: TABS + TELEMETRY (ALWAYS VISIBLE ON SCROLL) */}
      {/* ========================================================================= */}
      <header className="sticky top-[48px] sm:top-[52px] z-40 bg-black/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-2.5 transition-all shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Streamlined Subnav Pill Tabs (Overview, My Learning, Learning Paths, Recommended, Featured Labs) */}
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
                      ? 'text-white bg-[#181824] border border-white/20 shadow-sm shadow-[#6E56CF]/20 font-bold'
                      : 'text-[#A1A1B5] hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Only the Necessary Controls (Streak, Matrix, Progress) */}
          <div className="flex items-center gap-2 sm:gap-2.5 font-mono text-xs ml-auto shrink-0">
            {/* 🔥 5-day streak */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 select-none shadow-[0_0_12px_rgba(245,166,35,0.15)]">
              <span>🔥</span>
              <span className="font-bold">5-day streak</span>
            </div>

            {/* • Matrix Drawer Button */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#101017] hover:bg-[#181824] border border-white/10 hover:border-[#00E5FF]/50 text-zinc-300 hover:text-white transition-all hover:shadow-[0_0_14px_rgba(0,229,255,0.18)] active:scale-95 cursor-pointer"
              title="Open Concept Matrix"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]"></span>
              <span>Matrix</span>
            </button>

            {/* 72% Progress */}
            <button
              onClick={() => scrollToSection('my-learning')}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-[#101017] hover:bg-zinc-900 border border-white/10 hover:border-[#6E56CF]/60 text-xs font-mono transition-all group cursor-pointer"
              title="Jump to Current Progress"
            >
              <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 -rotate-90" viewBox="0 0 36 36">
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
                    className="transition-all duration-500" 
                  />
                </svg>
              </div>
              <span className="text-zinc-200 group-hover:text-white font-medium text-[11px] whitespace-nowrap">
                {isCurrentLessonComplete ? '100%' : '72%'} <span className="hidden sm:inline text-zinc-400">Progress</span>
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: EDITORIAL MAGAZINE & COMMAND RUNWAY                     */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 pt-14 pb-12 border-b border-white/10" id="overview">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#0A0A0E] text-xs font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF]"></span>
              <span>SPECIALIZED CURRICULUM DOSSIER</span>
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">FOR FRONTIER AI SYSTEMS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light tracking-tight text-white leading-[1.03]">
              Learn AI by building <br className="hidden sm:block" />
              <span className="font-sans font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
                production systems.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 font-sans font-normal leading-relaxed max-w-2xl">
              A rigorous dossier of autonomous swarms, PagedAttention memory layouts, sub-millisecond VLA robotics, and self-correcting reasoning loops. Zero fluff. Pure engineering.
            </p>

            {/* Search Input with ⌘K + Quick Topic Triggers */}
            <div className="pt-2 max-w-2xl">
              <div className="relative bg-[#0A0A0E] border border-white/15 rounded-xl focus-within:border-[#6E56CF] focus-within:shadow-[0_0_25px_rgba(110,86,207,0.3)] transition-all">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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

              {/* Direct Topic Triggers */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-600 mr-1">Direct triggers:</span>
                <button 
                  onClick={() => handleTriggerTopic('ReAct Loops', 'track-agentic')}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-[#6E56CF]/60 hover:text-white transition-all cursor-pointer"
                >
                  ReAct Loops
                </button>
                <button 
                  onClick={() => handleTriggerTopic('KV-Cache Paging', 'track-systems')}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-[#00E5FF]/60 hover:text-white transition-all cursor-pointer"
                >
                  KV-Cache Paging
                </button>
                <button 
                  onClick={() => handleTriggerTopic('OpenVLA 7-DoF', 'track-robotics')}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-amber-500/60 hover:text-white transition-all cursor-pointer"
                >
                  OpenVLA 7-DoF
                </button>
                <button 
                  onClick={() => handleTriggerTopic('DeepSeek GRPO', 'track-reasoning')}
                  className="px-2 py-0.5 rounded border border-white/10 bg-[#0A0A0E] hover:border-emerald-500/60 hover:text-white transition-all cursor-pointer"
                >
                  DeepSeek GRPO
                </button>
              </div>
            </div>
          </div>

          {/* Right: Modular Illustrated System Schematic Banner */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-[#0A0A0E] border border-white/15 rounded-xl p-4 font-mono text-xs text-zinc-300 relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] text-zinc-400 uppercase tracking-widest">
                <span>Dossier Index Matrix</span>
                <span className="text-emerald-400 flex items-center gap-1">
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
                  <span className="text-[#00E5FF]">18 / 24 Modules</span>
                </div>
                <div className="flex justify-between items-center text-zinc-400">
                  <span>PRODUCTION BENCHMARK:</span>
                  <span className="text-[#F5A623]">P99 84ms Latency</span>
                </div>
              </div>

              {/* Micro Architecture Flow Strip */}
              <div className="p-2.5 rounded bg-black/70 border border-white/10 mt-1 flex items-center justify-between text-[10px] text-zinc-400">
                <span className="text-[#6E56CF]">Prompt</span>
                <span>→</span>
                <span className="text-zinc-200 bg-[#101017] px-1.5 py-0.5 rounded">ReAct Checkpoint</span>
                <span>→</span>
                <span className="text-emerald-400 font-semibold">Tool Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MY LEARNING / ACTIVE FLIGHT DECK (#continue-learning)                  */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-12" id="continue-learning">
        <div className="flex items-center justify-between mb-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6E56CF] animate-pulse"></span>
            <span className="text-white font-bold tracking-widest uppercase">CRITICAL PATH RECOVERY</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">ACTIVE FLIGHT DECK</span>
          </div>
          <div className="text-zinc-500 hidden sm:block">Session State: Persisted to Local Storage</div>
        </div>

        {/* The Heavy Card */}
        <div className="bg-[#0A0A0E] border border-[#6E56CF]/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_12px_45px_-10px_rgba(110,86,207,0.22)]">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#6E56CF]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Dual Animated Progress Rings */}
            <div className="lg:col-span-3 flex items-center justify-center lg:justify-start gap-5 border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-28 h-28" viewBox="0 0 100 100">
                  {/* Outer Ring: Track Progress */}
                  <circle className="ring-track" cx="50" cy="50" fill="none" r="45" strokeWidth="6" />
                  <circle 
                    className="ring-fill-orbit" 
                    cx="50" 
                    cy="50" 
                    fill="none" 
                    r="45" 
                    strokeLinecap="round" 
                    strokeWidth="6" 
                    style={{ strokeDashoffset: isCurrentLessonComplete ? 0 : 79 }}
                  />
                  {/* Inner Ring: Daily Goal */}
                  <circle className="ring-track" cx="50" cy="50" fill="none" r="35" strokeWidth="5" />
                  <circle className="ring-fill-cyan" cx="50" cy="50" fill="none" r="35" strokeLinecap="round" strokeWidth="5" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-sans font-black text-xl text-white leading-none">
                    {isCurrentLessonComplete ? '100%' : '72%'}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 tracking-tighter mt-0.5">TRACK</span>
                </div>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">Track Completion</div>
                  <div className="text-[#9D85FF] font-bold text-sm">
                    {isCurrentLessonComplete ? '100%' : '72%'} <span className="text-zinc-500 font-normal text-xs">(8/12 Modules)</span>
                  </div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">Daily Engineering Quota</div>
                  <div className="text-[#00E5FF] font-bold text-sm">85% <span className="text-zinc-500 font-normal text-xs">(17/20 min)</span></div>
                </div>
              </div>
            </div>

            {/* Lesson Meta & ReAct Brief */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-0.5 rounded bg-[#6E56CF]/20 border border-[#6E56CF]/40 text-[#9D85FF] font-bold">
                  AGENTIC ARCHITECTURES
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-medium">Lesson 08 of 12</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">Prereq: StateGraph v2</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-light text-white leading-tight">
                Building Stateful Reasoning Loops with LangGraph &amp; Checkpointers
              </h3>

              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                Implement multi-turn autonomous loops with SQLite checkpointing, external tool definitions, schema validation, and dynamic fallbacks when tool invocations fail.
              </p>

              {/* Heat streak tracker */}
              <div className="pt-2 flex items-center gap-3 font-mono text-xs text-zinc-400">
                <span className="text-[11px] text-zinc-500">Streak Heatmap:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" title="Monday"></span>
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" title="Tuesday"></span>
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" title="Wednesday"></span>
                  <span className="w-3 h-3 rounded-sm bg-emerald-500" title="Thursday"></span>
                  <span className="w-3 h-3 rounded-sm bg-emerald-400 animate-pulse" title="Today"></span>
                  <span className="w-3 h-3 rounded-sm bg-zinc-800" title="Saturday"></span>
                  <span className="w-3 h-3 rounded-sm bg-zinc-800" title="Sunday"></span>
                </div>
                <span className="text-amber-400 text-[11px] font-bold">+50 XP Ready</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="lg:col-span-3 flex flex-col gap-3 shrink-0">
              <button 
                onClick={() => openLesson('agent-first-lesson')}
                className="w-full py-3.5 px-5 rounded-xl bg-[#6E56CF] hover:bg-[#5D46C2] active:scale-[0.98] text-white font-mono text-xs font-bold transition-all shadow-[0_0_30px_rgba(110,86,207,0.5)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Resume Flight Deck</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>

              <button 
                onClick={() => openLesson('agent-first-lesson')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#101017] hover:bg-[#14141E] border border-white/10 text-zinc-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Launch Test Harness (.py)</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. LEARNING PATHS: PROGRESSION RUNWAY & EXPANDABLE TRACKS                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-14" id="curriculum-runway">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 mb-10 gap-3">
          <div>
            <div className="text-xs font-mono text-[#9D85FF] uppercase tracking-widest mb-1">MILESTONE RUNWAY</div>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-white">Curriculum Progression Runway</h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">Four staged flight checkpoints from Foundations to Production Principal</p>
          </div>
          <div className="font-mono text-xs text-zinc-500">
            Status: <span className="text-emerald-400 font-bold">Stage 03 Active</span> (Principal Gate locked)
          </div>
        </div>

        {/* Runway Flow Layout */}
        <div className="relative mb-16">
          <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 left-8 right-8 h-1 runway-ray -z-10 rounded-full opacity-70"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Stage 1: COMPLETE */}
            <div className="bg-[#0A0A0E] border border-emerald-500/40 rounded-xl p-5 relative flex flex-col justify-between group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">STAGE 01</span>
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
              </div>
              <div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase">Foundations</div>
                <h4 className="text-base font-sans font-bold text-white mb-2">LLM Primitive Mechanics</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Tokenization, cross-entropy loss, embeddings, basic prompt structuring, and temperature dynamics.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>12/12 Completed</span>
                <span>100%</span>
              </div>
            </div>

            {/* Stage 2: COMPLETE */}
            <div className="bg-[#0A0A0E] border border-emerald-500/40 rounded-xl p-5 relative flex flex-col justify-between group hover:border-emerald-400 transition-all">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">STAGE 02</span>
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center text-[10px] font-bold">✓</span>
              </div>
              <div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase">Pipelines</div>
                <h4 className="text-base font-sans font-bold text-white mb-2">RAG &amp; Vector Pipelines</h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-4">
                  Dense retrieval, BM25 hybrid ranking, contextual rerankers, and chunk optimization for low-latency search.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                <span>14/14 Completed</span>
                <span>100%</span>
              </div>
            </div>

            {/* Stage 3: ACTIVE MILESTONE */}
            <div className="bg-[#101017] border-2 border-[#6E56CF] rounded-xl p-5 relative flex flex-col justify-between shadow-[0_0_30px_rgba(110,86,207,0.3)]">
              <div className="absolute -top-2.5 left-5 px-2 py-0.5 bg-[#6E56CF] text-white font-mono text-[9px] font-bold rounded uppercase tracking-wider">
                CURRENT AIRSPACE
              </div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#6E56CF]/30 text-[#9D85FF] border border-[#6E56CF]/50">STAGE 03</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-ping"></span>
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#00E5FF] uppercase">Autonomous Control</div>
                <h4 className="text-base font-sans font-bold text-white mb-2">Agentic Swarms &amp; Protocols</h4>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed mb-4">
                  ReAct loops, human-in-the-loop rollback checkpoints, Model Context Protocol (MCP), and graph orchestration.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#9D85FF] font-bold">Lesson 8 of 12</span>
                <span className="text-[#00E5FF] font-semibold">Active Runway</span>
              </div>
            </div>

            {/* Stage 4: LOCKED PRINCIPAL */}
            <div className="bg-[#0A0A0E]/50 border border-white/10 rounded-xl p-5 relative flex flex-col justify-between opacity-70 group hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 text-zinc-500 border border-zinc-800">STAGE 04</span>
                <span className="text-zinc-600 text-xs">🔒 Locked</span>
              </div>
              <div>
                <div className="text-[11px] font-mono text-zinc-600 uppercase">Principal Gate</div>
                <h4 className="text-base font-sans font-bold text-zinc-300 mb-2">Cluster Scale &amp; Kernel Tuning</h4>
                <p className="text-xs text-zinc-500 font-sans leading-relaxed mb-4">
                  PagedAttention custom CUDA kernels, speculative decoding, multi-node vLLM deployment, and GRPO reasoning distillation.
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>Unlocks at Stage 03 Completion</span>
                <span>48h req</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Track Dossiers */}
        <div className="pt-6" id="expandable-paths">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 mb-8">
            <div>
              <div className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest mb-1">CORE SPECIALIZATIONS</div>
              <h3 className="text-2xl sm:text-3xl font-display font-light text-white">Expandable Track Dossiers</h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">Inspect prerequisite concepts, lesson checklists, and schematics</p>
            </div>
            <div className="text-xs font-mono text-zinc-500 mt-2 md:mt-0">
              4 Core Disciplines · Instant Sandbox Launch
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: AGENTIC AI */}
            <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl p-6 transition-all hover:border-[#6E56CF] group relative" id="track-agentic">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#9D85FF] mb-1">
                    <span>TRACK 01</span>
                    <span>•</span>
                    <span>Active Track</span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-white group-hover:text-[#9D85FF] transition-colors">
                    Agentic AI &amp; Protocol Engineering
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#6E56CF]/15 border border-[#6E56CF]/30 text-xs font-mono text-[#9D85FF] font-semibold">
                  42 Lessons
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-5">
                Build deterministic tool calling, multi-agent swarms using Model Context Protocol (MCP), and graph-based execution pipelines with rollback checkpoints.
              </p>

              <details className="cursor-pointer group/det" open>
                <summary className="flex items-center justify-between text-xs font-mono text-zinc-300 py-2.5 px-3 rounded-lg bg-[#101017] border border-white/10 list-none hover:border-zinc-700">
                  <span className="flex items-center gap-2">
                    <span className="text-[#6E56CF] font-bold">▶</span>
                    <span>Inspect Prereqs &amp; Module Syllabus</span>
                  </span>
                  <span className="text-zinc-500 text-[10px] group-open/det:rotate-90 transition-transform">▼</span>
                </summary>
                <div className="pt-4 space-y-3 font-mono text-xs border-t border-white/10 mt-3">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Required Foundations:</div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Pydantic V2 Models</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">FastAPI Async Callbacks</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Token Limits &amp; Checkpoints</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider pt-2">Module Checklist:</div>
                  <ul className="space-y-1.5 text-zinc-400 text-xs">
                    <li className="flex items-center gap-2 text-emerald-400">✓ 01: Function Calling JSON Schema Definition</li>
                    <li className="flex items-center gap-2 text-emerald-400">✓ 02: ReAct Prompt Loops with Scratchpad Buffers</li>
                    <li className="flex items-center gap-2 text-white font-medium">● 08: LangGraph Checkpointers with SQLite Snapshots</li>
                    <li className="flex items-center gap-2 text-zinc-600">○ 09: Dynamic Reflection &amp; Fallback Tree Search</li>
                    <li className="flex items-center gap-2 text-zinc-600">○ 10: Model Context Protocol (MCP) Multi-Server Setup</li>
                  </ul>
                </div>
              </details>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-zinc-500">Est. 18 hrs total</span>
                <button 
                  onClick={() => openLesson('agent-first-lesson')}
                  className="px-4 py-2 rounded-lg bg-[#6E56CF] hover:bg-[#5D46C2] text-white font-mono text-xs font-semibold transition-all cursor-pointer"
                >
                  Resume Track →
                </button>
              </div>
            </div>

            {/* Card 2: INFERENCE & SYSTEMS SCALING */}
            <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl p-6 transition-all hover:border-amber-500/60 group relative" id="track-systems">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-1">
                    <span>TRACK 02</span>
                    <span>•</span>
                    <span>High Throughput</span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-white group-hover:text-amber-300 transition-colors">
                    LLM Inference &amp; Systems Scaling
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 font-semibold">
                  58 Lessons
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-5">
                PagedAttention virtual memory tables, vLLM multi-GPU tensor parallelism, KV-cache quantization, and speculative decoding math for maximum throughput.
              </p>

              <details className="cursor-pointer group/det">
                <summary className="flex items-center justify-between text-xs font-mono text-zinc-300 py-2.5 px-3 rounded-lg bg-[#101017] border border-white/10 list-none hover:border-zinc-700">
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">▶</span>
                    <span>Inspect Prereqs &amp; Module Syllabus</span>
                  </span>
                  <span className="text-zinc-500 text-[10px] group-open/det:rotate-90 transition-transform">▼</span>
                </summary>
                <div className="pt-4 space-y-3 font-mono text-xs border-t border-white/10 mt-3">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Required Foundations:</div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">CUDA Memory Hierarchy</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">PyTorch Tensors</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">NCCL All-Reduce</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider pt-2">Module Checklist:</div>
                  <ul className="space-y-1.5 text-zinc-400 text-xs">
                    <li className="flex items-center gap-2 text-emerald-400">✓ 01: KV-Cache Anatomy &amp; Context Bottlenecks</li>
                    <li className="flex items-center gap-2 text-amber-300">● 02: PagedAttention Block Allocator in C++</li>
                    <li className="flex items-center gap-2 text-zinc-500">○ 03: Speculative Decoding with Draft Verification</li>
                    <li className="flex items-center gap-2 text-zinc-500">○ 04: vLLM Multi-GPU Cluster Setup</li>
                  </ul>
                </div>
              </details>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-zinc-500">Est. 26 hrs total</span>
                <button 
                  onClick={() => openLesson('kvcache-lesson')}
                  className="px-4 py-2 rounded-lg bg-[#101017] hover:bg-zinc-800 border border-white/10 text-amber-300 font-mono text-xs font-semibold transition-all cursor-pointer"
                >
                  Start Track →
                </button>
              </div>
            </div>

            {/* Card 3: EMBODIED ROBOTICS & VLA */}
            <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl p-6 transition-all hover:border-cyan-500/60 group relative" id="track-robotics">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#00E5FF] mb-1">
                    <span>TRACK 03</span>
                    <span>•</span>
                    <span>Physical AI</span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Embodied Robotics &amp; VLA Architectures
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-semibold">
                  36 Lessons
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-5">
                Sim-to-real domain adaptation with Mujoco, ROS 2 node messaging, OpenVLA tokenization of continuous 7-DoF actions, and tactile feedback.
              </p>

              <details className="cursor-pointer group/det">
                <summary className="flex items-center justify-between text-xs font-mono text-zinc-300 py-2.5 px-3 rounded-lg bg-[#101017] border border-white/10 list-none hover:border-zinc-700">
                  <span className="flex items-center gap-2">
                    <span className="text-[#00E5FF] font-bold">▶</span>
                    <span>Inspect Prereqs &amp; Module Syllabus</span>
                  </span>
                  <span className="text-zinc-500 text-[10px] group-open/det:rotate-90 transition-transform">▼</span>
                </summary>
                <div className="pt-4 space-y-3 font-mono text-xs border-t border-white/10 mt-3">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Required Foundations:</div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Kinematics &amp; Euler Angles</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">ROS 2 Pub/Sub</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Vision Transformers</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider pt-2">Module Checklist:</div>
                  <ul className="space-y-1.5 text-zinc-400 text-xs">
                    <li className="flex items-center gap-2 text-emerald-400">✓ 01: Isaac Sim &amp; Mujoco Physics Environments</li>
                    <li className="flex items-center gap-2 text-cyan-300">● 02: OpenVLA: Discretizing Continuous Trajectories</li>
                    <li className="flex items-center gap-2 text-zinc-500">○ 03: Telemetry Feedback Loop under 40ms Latency</li>
                  </ul>
                </div>
              </details>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-zinc-500">Est. 22 hrs total</span>
                <button 
                  onClick={() => openLesson('vla-lesson')}
                  className="px-4 py-2 rounded-lg bg-[#101017] hover:bg-zinc-800 border border-white/10 text-cyan-300 font-mono text-xs font-semibold transition-all cursor-pointer"
                >
                  Start Track →
                </button>
              </div>
            </div>

            {/* Card 4: REASONING & GRPO */}
            <div className="bg-[#0A0A0E] border border-white/10 rounded-2xl p-6 transition-all hover:border-emerald-500/60 group relative" id="track-reasoning">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 mb-1">
                    <span>TRACK 04</span>
                    <span>•</span>
                    <span>Post-Training</span>
                  </div>
                  <h4 className="text-xl font-sans font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Reasoning Models &amp; GRPO Distillation
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300 font-semibold">
                  30 Lessons
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed mb-5">
                Reinforcement learning via Group Relative Policy Optimization (GRPO), eliminating critic models to distill DeepSeek-R1 style CoT traces on single GPUs.
              </p>

              <details className="cursor-pointer group/det">
                <summary className="flex items-center justify-between text-xs font-mono text-zinc-300 py-2.5 px-3 rounded-lg bg-[#101017] border border-white/10 list-none hover:border-zinc-700">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">▶</span>
                    <span>Inspect Prereqs &amp; Module Syllabus</span>
                  </span>
                  <span className="text-zinc-500 text-[10px] group-open/det:rotate-90 transition-transform">▼</span>
                </summary>
                <div className="pt-4 space-y-3 font-mono text-xs border-t border-white/10 mt-3">
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Required Foundations:</div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">PPO vs DPO Math</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">LoRA &amp; QLoRA Configs</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-300">Rule-based Verifiers</span>
                  </div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider pt-2">Module Checklist:</div>
                  <ul className="space-y-1.5 text-zinc-400 text-xs">
                    <li className="flex items-center gap-2 text-emerald-400">✓ 01: Group Sampling &amp; Advantage Estimation</li>
                    <li className="flex items-center gap-2 text-emerald-300">● 02: Reward Function Design for Verifiers</li>
                    <li className="flex items-center gap-2 text-zinc-500">○ 03: Training Llama-3.1 with Unsloth</li>
                  </ul>
                </div>
              </details>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-zinc-500">Est. 19 hrs total</span>
                <button 
                  onClick={() => openLesson('grpo-lesson')}
                  className="px-4 py-2 rounded-lg bg-[#101017] hover:bg-zinc-800 border border-white/10 text-emerald-300 font-mono text-xs font-semibold transition-all cursor-pointer"
                >
                  Start Track →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED SECTION (#recommended-engine)                             */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-white/10" id="recommended-engine">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#9D85FF] uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#6E56CF] animate-pulse"></span>
              ADAPTIVE RECOMMENDATION ENGINE
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-white">Suggested for Your Velocity</h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">Calculated from recent Agentic AI checkpoints and low-latency benchmark runs</p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#0A0A0E] border border-white/10 text-xs font-mono text-zinc-400 self-start sm:self-auto">
            Profile Velocity: <span className="text-emerald-400 font-bold">Top 8% this week</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rec 1 */}
          <article className="bg-[#0A0A0E] border border-white/10 hover:border-[#6E56CF]/60 rounded-xl p-5 flex flex-col justify-between group transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="px-2 py-0.5 rounded bg-[#6E56CF]/15 text-[#9D85FF] border border-[#6E56CF]/30 font-semibold">Agent Pattern</span>
                <span className="text-zinc-500">22 min</span>
              </div>
              <h4 className="text-base font-sans font-bold text-white group-hover:text-[#9D85FF] transition-colors mb-2">
                Self-Reflective Evaluator Loops &amp; Hallucination Guardrails
              </h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Construct an asynchronous critic node that intercepts tool payloads before database commits, preventing cascade failures.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">Matches: LangGraph</span>
              <button 
                onClick={() => openLesson('mcp-lesson')}
                className="text-[#9D85FF] group-hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Launch</span> <span>→</span>
              </button>
            </div>
          </article>

          {/* Rec 2 */}
          <article className="bg-[#0A0A0E] border border-white/10 hover:border-amber-500/60 rounded-xl p-5 flex flex-col justify-between group transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">Systems</span>
                <span className="text-zinc-500">30 min</span>
              </div>
              <h4 className="text-base font-sans font-bold text-white group-hover:text-amber-300 transition-colors mb-2">
                vLLM Multi-GPU Serving for Agent Parallelism
              </h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Configure continuous batching with preemption queues to run 50+ concurrent ReAct agent sessions without VRAM crashes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">Matches: Latency Bottleneck</span>
              <button 
                onClick={() => openLesson('kvcache-lesson')}
                className="text-amber-400 group-hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Launch</span> <span>→</span>
              </button>
            </div>
          </article>

          {/* Rec 3 */}
          <article className="bg-[#0A0A0E] border border-white/10 hover:border-emerald-500/60 rounded-xl p-5 flex flex-col justify-between group transition-all">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">Post-Training</span>
                <span className="text-zinc-500">35 min</span>
              </div>
              <h4 className="text-base font-sans font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                DeepSeek GRPO Distillation for Reasoning Agents
              </h4>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Distill mathematical reasoning into lightweight 8B models to cut agent API costs by 94% on consumer hardware.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
              <span className="text-zinc-500">Matches: Reasoning Depth</span>
              <button 
                onClick={() => openLesson('grpo-lesson')}
                className="text-emerald-400 group-hover:text-white font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Launch</span> <span>→</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED LABS: ILLUSTRATED CONCEPT ARCHITECTURE (#architectural-schematic) */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-6 py-14 border-t border-white/10" id="architectural-schematic">
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-4">
          <div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">DATA FLOW BLUEPRINT</div>
            <h2 className="text-2xl sm:text-3xl font-display font-light text-white">Illustrated Concept Architecture</h2>
            <p className="text-xs font-mono text-zinc-400 mt-1">Multi-Turn Stateful Agent Runtime with Model Context Protocol (MCP) &amp; PagedAttention Cache</p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs mt-3 md:mt-0">
            <span className="text-zinc-500">Format: Production Vector Schematic</span>
            <button 
              onClick={() => openLesson('rag-lesson')}
              className="px-3 py-1.5 rounded-lg bg-[#6E56CF]/20 hover:bg-[#6E56CF] text-white transition-all cursor-pointer font-semibold"
            >
              Launch Interactive Lab →
            </button>
          </div>
        </div>

        {/* The Detailed SVG Schematic Box */}
        <div className="bg-[#07070B] border border-white/15 rounded-2xl p-6 sm:p-8 relative overflow-hidden font-mono shadow-2xl">
          <div className="absolute inset-0 opacity-20 pointer-events-none blueprint-grid"></div>

          <div className="relative z-10 w-full overflow-x-auto">
            <div className="min-w-[820px] py-4">
              <svg className="w-full h-auto" fill="none" viewBox="0 0 940 380">
                {/* Group 1: Client Query & Routing */}
                <rect fill="#0E0E16" height="90" rx="10" stroke="#2B2B3D" strokeWidth="1.5" width="160" x="20" y="40" />
                <text fill="#ECECED" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="12" fontWeight="600" x="35" y="70">User &amp; Task Stream</text>
                <text fill="#8E8E98" fontFamily="JetBrains Mono" fontSize="10" x="35" y="90">REST / WebSocket API</text>
                <text fill="#34D399" fontFamily="JetBrains Mono" fontSize="9" x="35" y="108">● Latency: 4ms</text>

                {/* Connector 1 */}
                <path d="M180 85 H 240" stroke="#6E56CF" strokeDasharray="4 4" strokeWidth="2" />
                <circle cx="240" cy="85" fill="#6E56CF" r="3" />

                {/* Group 2: Agent Orchestration Engine */}
                <rect fill="#10101B" height="280" rx="12" stroke="#6E56CF" strokeWidth="1.8" width="260" x="240" y="25" />
                <text fill="#9D85FF" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fontWeight="700" x="258" y="55">Agent Reasoning Swarm</text>
                <text fill="#8E8E98" fontFamily="JetBrains Mono" fontSize="10" x="258" y="73">StateGraph / Cyclic ReAct</text>

                {/* Sub-Nodes */}
                <rect fill="#181828" height="42" rx="6" stroke="#373752" width="224" x="258" y="90" />
                <text fill="#ECECED" fontFamily="JetBrains Mono" fontSize="11" x="272" y="115">1. Planner &amp; Decomposition</text>

                <rect fill="#181828" height="42" rx="6" stroke="#373752" width="224" x="258" y="145" />
                <text fill="#22D3EE" fontFamily="JetBrains Mono" fontSize="11" x="272" y="170">2. Tool JSON Schema Evaluator</text>

                <rect fill="#181828" height="42" rx="6" stroke="#373752" width="224" x="258" y="200" />
                <text fill="#FBBF24" fontFamily="JetBrains Mono" fontSize="11" x="272" y="225">3. Self-Correction &amp; Filter</text>
                <text fill="#525263" fontFamily="JetBrains Mono" fontSize="9" x="258" y="275">Checkpointer: SQLite / Postgres Snapshots</text>

                {/* Connector to MCP */}
                <path d="M500 166 H 570" stroke="#00E5FF" strokeWidth="2" />
                <polygon fill="#00E5FF" points="570,166 564,162 564,170" />

                {/* Group 3: Model Context Protocol (MCP) Server Farm */}
                <rect fill="#0C131D" height="240" rx="12" stroke="#00E5FF" strokeWidth="1.5" width="200" x="570" y="40" />
                <text fill="#67E8F9" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="13" fontWeight="700" x="588" y="68">MCP Tool Gateway</text>
                <text fill="#64748B" fontFamily="JetBrains Mono" fontSize="10" x="588" y="86">JSON-RPC Standard</text>

                <rect fill="#131E2E" height="34" rx="6" stroke="#1E293B" width="164" x="588" y="105" />
                <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="10" x="600" y="126">POSTGRES VECTOR DB</text>

                <rect fill="#131E2E" height="34" rx="6" stroke="#1E293B" width="164" x="588" y="148" />
                <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="10" x="600" y="169">LOCAL SANDBOX SHELL</text>

                <rect fill="#131E2E" height="34" rx="6" stroke="#1E293B" width="164" x="588" y="191" />
                <text fill="#E2E8F0" fontFamily="JetBrains Mono" fontSize="10" x="600" y="212">ROBOTIC 7-DoF ROS 2</text>
                <text fill="#38BDF8" fontFamily="JetBrains Mono" fontSize="9" x="588" y="255">Secure RPC Sandbox Isolation</text>

                {/* Connector to vLLM */}
                <path d="M370 305 V 330 H 800 V 270" stroke="#F5A623" strokeDasharray="3 3" strokeWidth="2" />

                {/* Group 4: High-Throughput Inference (vLLM & PagedAttention) */}
                <rect fill="#161208" height="150" rx="10" stroke="#F5A623" strokeWidth="1.5" width="120" x="800" y="120" />
                <text fill="#FBBF24" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="11" fontWeight="700" x="812" y="145">vLLM Cluster</text>
                <text fill="#78716C" fontFamily="JetBrains Mono" fontSize="9" x="812" y="162">PagedAttention</text>
                <rect fill="#241B08" height="30" rx="4" stroke="#451A03" width="96" x="812" y="175" />
                <text fill="#FDE68A" fontFamily="JetBrains Mono" fontSize="9" x="820" y="194">KV-Pages: 99.2%</text>
                <text fill="#A8A29E" fontFamily="JetBrains Mono" fontSize="8" x="812" y="230">Triton / TensorRT</text>
                <text fill="#34D399" fontFamily="JetBrains Mono" fontSize="8" x="812" y="245">CUDA FP8 Kernel</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#6E56CF]"></span> LangGraph Swarm</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#00E5FF]"></span> MCP Server Gateway</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#F5A623]"></span> PagedAttention Engine</span>
            </div>
            <div className="text-zinc-500">
              Source: AI Orbit Architecture Standard 04-2026
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MODALS: LESSON READER / SANDBOX & CONCEPT MATRIX                          */}
      {/* ========================================================================= */}
      <LessonReaderModal 
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        lessonId={activeLessonId}
        completedLessons={completedLessons}
        onToggleComplete={handleToggleCompleteLesson}
      />

      <ConceptMatrixModal 
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
