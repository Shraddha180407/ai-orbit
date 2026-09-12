import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Package,
  Layers,
  Database,
  BarChart2,
  FileText,
  Users,
  Globe2,
  Search,
  SlidersHorizontal,
  Link2,
  TrendingUp,
  Target,
  Shield,
  Eye,
  Heart,
  RefreshCw,
  Microscope,
  Code,
  Users2,
  GraduationCap,
  Activity,
  Cpu,
  Radio,
  Zap,
  Network
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white/30 pb-20 overflow-x-hidden relative">
      
      {/* Global CSS Dot Matrix Background Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%),url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMwNTA1MDUiLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMjcyNzJhIi8+PC9zdmc+')] opacity-60 z-0"></div>

      <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 relative z-10">
        
        {/* 1. Hero Section (Enhanced with Floating 3D Elements) */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-16 lg:pt-24 pb-12 gap-12 relative">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start relative z-20">
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#6E56CF]/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#27272a] bg-black/50 backdrop-blur-md mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#6E56CF]/30 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a1a1aa] flex items-center gap-2">
                 <Radio size={12} className="text-[#6E56CF] animate-pulse" />
                 Your Mission Control for AI Discovery
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#a1a1aa]">
              Navigate the<br />AI Universe.<br />Stay Ahead.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-[#a1a1aa] mb-8 max-w-[500px]">
              AI Orbit helps you discover, evaluate, and track the best AI models, datasets, benchmarks, and research — all in one unified, real-time platform.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all text-sm shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Explore Now <ArrowRight size={16} />
              </Link>
              <Link
                href="#architecture"
                className="inline-flex items-center justify-center gap-2 bg-black/50 backdrop-blur-md border border-[#3f3f46] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#121212] transition-all text-sm"
              >
                View Architecture <Code size={14} className="ml-1" />
              </Link>
            </div>
          </div>

          {/* Right Content - Orbital Visualization with Glass UI */}
          <div className="w-full lg:w-1/2 relative h-[500px] flex items-center justify-center">
             
             {/* Central Glow & Planet */}
             <div className="absolute w-40 h-40 bg-black rounded-full shadow-[0_0_120px_rgba(255,255,255,0.15)] z-10 border border-white/20 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
                <Globe2 size={32} className="text-white mb-2" strokeWidth={1} />
                <span className="text-[14px] font-black text-white tracking-widest">AI ORBIT</span>
             </div>
             
             {/* Orbits */}
             <div className="absolute w-[350px] h-[120px] border border-[#27272a] rounded-[100%] rotate-[-15deg] shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
             <div className="absolute w-[550px] h-[200px] border border-[#3f3f46] rounded-[100%] rotate-[-15deg]"></div>
             <div className="absolute w-[750px] h-[280px] border border-dashed border-[#52525b]/50 rounded-[100%] rotate-[-15deg]"></div>

             {/* Floating Frosted Glass UI Card 1 (Live Benchmarks) */}
             <div className="absolute top-[10%] left-[0%] z-30 bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-[bounce_4s_infinite]">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Live Evaluation</span>
               </div>
               <div className="text-white font-mono text-sm mb-1">GPT-4.5 vs Claude 3.5</div>
               {/* CSS Sparkline */}
               <div className="flex items-end gap-1 h-8 mt-2">
                 {[40, 60, 45, 80, 50, 90, 75, 100].map((h, i) => (
                   <div key={i} className="w-1.5 bg-gradient-to-t from-[#6E56CF] to-[#38BDF8] rounded-t-sm" style={{ height: `${h}%` }}></div>
                 ))}
               </div>
             </div>

             {/* Floating Frosted Glass UI Card 2 (Model Activity) */}
             <div className="absolute bottom-[10%] right-[0%] z-30 bg-[#121212]/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] animate-[bounce_5s_infinite_reverse]">
               <div className="flex items-center gap-3 mb-3">
                 <Cpu size={14} className="text-[#38BDF8]" />
                 <span className="text-[10px] text-[#a1a1aa] uppercase font-bold tracking-wider">Global Nodes</span>
               </div>
               <div className="flex items-center gap-4">
                 <div>
                   <div className="text-2xl font-black text-white">5,102</div>
                   <div className="text-[9px] text-[#71717a]">Active Models</div>
                 </div>
                 <div className="w-8 h-8 rounded-full border-2 border-[#38BDF8] border-r-transparent animate-spin"></div>
               </div>
             </div>

             {/* Smaller Orbital Nodes */}
             <div className="absolute top-[25%] left-[25%] w-10 h-10 rounded-full bg-black border border-[#3f3f46] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Package size={16} className="text-white" /></div>
             <div className="absolute bottom-[25%] left-[20%] w-10 h-10 rounded-full bg-black border border-[#3f3f46] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Database size={16} className="text-white" /></div>
             <div className="absolute top-[25%] right-[25%] w-10 h-10 rounded-full bg-black border border-[#3f3f46] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><Target size={16} className="text-white" /></div>
             <div className="absolute bottom-[30%] right-[15%] w-10 h-10 rounded-full bg-black border border-[#3f3f46] flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.1)]"><FileText size={16} className="text-white" /></div>
          </div>

        </div>

        {/* 2. Stats Bar with Rich CSS Gradients */}
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center py-10 border-y border-[#27272a] my-8 gap-4 bg-gradient-to-r from-transparent via-[#121212]/50 to-transparent">
          <div className="flex items-center gap-4 px-4">
             <Layers size={32} className="text-white" strokeWidth={1} />
             <div>
               <div className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a1a1aa]">500+</div>
               <div className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">AI Models</div>
             </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-[#3f3f46] to-transparent"></div>
          
          <div className="flex items-center gap-4 px-4">
             <BarChart2 size={32} className="text-white" strokeWidth={1} />
             <div>
               <div className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a1a1aa]">200+</div>
               <div className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">Benchmarks</div>
             </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-[#3f3f46] to-transparent"></div>

          <div className="flex items-center gap-4 px-4">
             <Database size={32} className="text-white" strokeWidth={1} />
             <div>
               <div className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a1a1aa]">150+</div>
               <div className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">Datasets</div>
             </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-[#3f3f46] to-transparent"></div>

          <div className="flex items-center gap-4 px-4">
             <Users size={32} className="text-white" strokeWidth={1} />
             <div>
               <div className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a1a1aa]">50K+</div>
               <div className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">Researchers</div>
             </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-[#3f3f46] to-transparent"></div>

          <div className="flex items-center gap-4 px-4">
             <Globe2 size={32} className="text-white" strokeWidth={1} />
             <div>
               <div className="text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#a1a1aa]">100+</div>
               <div className="text-[11px] text-[#71717a] font-bold uppercase tracking-wider">Countries</div>
             </div>
          </div>
        </div>

        {/* 2.5 NEW: Architecture of Discovery (Extra Content & Graphics) */}
        <div id="architecture" className="py-20 scroll-mt-24">
           <div className="text-center mb-16">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#27272a] mb-4">
               <Zap size={14} className="text-[#38BDF8]" />
               <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#a1a1aa]">Platform Capabilities</span>
             </div>
             <h2 className="text-4xl font-black text-white mb-4">The Architecture of Discovery</h2>
             <p className="text-lg text-[#a1a1aa] max-w-[700px] mx-auto">AI Orbit isn't just a directory. It is a highly technical indexing engine built to process, evaluate, and categorize intelligence.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Architecture Card 1 */}
              <div className="bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Database size={100} />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-[#3f3f46] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                   <Search size={20} className="text-white" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Semantic Indexing</h3>
                 <p className="text-sm text-[#a1a1aa] leading-relaxed">
                   We use advanced embedding models to semantically map every tool and model on our platform. This means you don't just search by keywords, you search by architectural capability and intended use-case.
                 </p>
              </div>

              {/* Architecture Card 2 */}
              <div className="bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Network size={100} />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-[#3f3f46] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                   <Code size={20} className="text-white" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">MCP Integration</h3>
                 <p className="text-sm text-[#a1a1aa] leading-relaxed">
                   Our databases natively track Model Context Protocol (MCP) servers. We analyze how agents connect to local resources, allowing developers to discover standard protocols for their LLM architectures.
                 </p>
              </div>

              {/* Architecture Card 3 */}
              <div className="bg-[#0a0a0a] border border-[#27272a] hover:border-[#52525b] transition-colors rounded-3xl p-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    <Activity size={100} />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-[#3f3f46] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                   <SlidersHorizontal size={20} className="text-white" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Live Benchmarking</h3>
                 <p className="text-sm text-[#a1a1aa] leading-relaxed">
                   Static leaderboards are obsolete. AI Orbit ingests live evaluation data from automated API testing suites to provide real-time latency, throughput, and accuracy metrics across 200+ benchmarks.
                 </p>
              </div>
           </div>
        </div>

        {/* 3. Timeline Section (Enhanced) */}
        <div className="text-center py-20 bg-[#0a0a0a]/30 rounded-3xl border border-[#18181b] mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px)] bg-[size:40px_100%]"></div>
          
          <div className="relative z-10">
            <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71717a] mb-3">WHAT WE DO</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">From Discovery to Decision</h2>
            <p className="text-base text-[#a1a1aa] mb-20 max-w-[600px] mx-auto">AI Orbit brings structure to the fast-moving world of AI, automating the heavy lifting of evaluation.</p>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4 px-8 xl:px-16 relative">
               {/* Animated Dashed line background */}
               <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[#27272a] -z-10">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-1/3 h-full animate-[slide_3s_linear_infinite]"></div>
               </div>
               
               {[
                 { num: "01", title: "Discover", icon: Search, desc: "Find the right models, datasets, and tools effortlessly using semantic search." },
                 { num: "02", title: "Evaluate", icon: SlidersHorizontal, desc: "Access live benchmarks and automated evaluations to make informed choices." },
                 { num: "03", title: "Compare", icon: Link2, desc: "Side-by-side data comparisons help you pick the absolute best option." },
                 { num: "04", title: "Track", icon: TrendingUp, desc: "Stay updated with the latest releases, latency changes, and cost reductions." },
                 { num: "05", title: "Decide", icon: Target, desc: "Make smarter architectural decisions faster with all the right telemetry." }
               ].map((step, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center w-full md:w-1/5 relative group">
                   <div className="w-16 h-16 rounded-full border-2 border-[#27272a] bg-[#050505] flex items-center justify-center mb-6 group-hover:border-white transition-colors relative shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                     <div className="absolute -top-3 -right-3 text-[10px] font-black text-[#52525b]">{step.num}</div>
                     <step.icon size={24} className="text-white group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                   </div>
                   <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                   <p className="text-sm text-[#a1a1aa] leading-relaxed max-w-[200px]">{step.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* 4. Split Boxes (Enhanced Depth) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          
          {/* Left Box: Philosophy */}
          <div className="border border-[#27272a] bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-[32px] p-10 lg:p-14 flex flex-col relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>
            
            <div className="relative z-10">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71717a] mb-4">OUR PHILOSOPHY</div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 max-w-[300px] leading-tight">Principles That Guide Us</h2>
              
              <div className="space-y-8">
                 <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#27272a] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                     <Shield size={20} className="text-white group-hover:text-black transition-colors" strokeWidth={1.5} />
                   </div>
                   <div>
                     <div className="text-lg font-bold text-white mb-2">Signal over Noise</div>
                     <div className="text-sm text-[#a1a1aa] leading-relaxed">The AI space is crowded. We aggressively curate and evaluate tools to ensure we only highlight what truly matters.</div>
                   </div>
                 </div>
                 <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#27272a] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                     <Eye size={20} className="text-white group-hover:text-black transition-colors" strokeWidth={1.5} />
                   </div>
                   <div>
                     <div className="text-lg font-bold text-white mb-2">Transparency</div>
                     <div className="text-sm text-[#a1a1aa] leading-relaxed">Our benchmarks and comparisons are clear, unbiased, and entirely data-driven. We don't hide the methodology.</div>
                   </div>
                 </div>
                 <div className="flex items-start gap-6 group">
                   <div className="w-12 h-12 rounded-xl bg-[#121212] border border-[#27272a] flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                     <Heart size={20} className="text-white group-hover:text-black transition-colors" strokeWidth={1.5} />
                   </div>
                   <div>
                     <div className="text-lg font-bold text-white mb-2">Community First</div>
                     <div className="text-sm text-[#a1a1aa] leading-relaxed">Built with and for the AI community. Developers, researchers, and founders directly contribute to the platform.</div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Right Box: Built For */}
          <div className="border border-[#27272a] bg-gradient-to-b from-[#0a0a0a] to-[#050505] rounded-[32px] p-10 lg:p-14 flex flex-col shadow-2xl">
            <div className="flex justify-between items-start mb-12">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71717a] mb-2">BUILT FOR</div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white">Who We Serve</h2>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
               {[
                 { title: "Researchers", icon: Microscope, desc: "Stay on top of the latest models, datasets, and breakthrough academic research." },
                 { title: "Developers", icon: Code, desc: "Find the best tools, MCP servers, and APIs to build and ship robust applications faster." },
                 { title: "Founders & Teams", icon: Users2, desc: "Evaluate SaaS solutions and make data-backed procurement decisions." },
                 { title: "Students & Learners", icon: GraduationCap, desc: "Learn, explore, and grow with highly curated educational resources and guides." }
               ].map((item, idx) => (
                 <div key={idx} className="bg-[#050505] border border-[#18181b] hover:border-[#3f3f46] transition-colors rounded-2xl p-6 flex flex-col">
                   <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#27272a] flex items-center justify-center mb-6">
                     <item.icon size={20} className="text-white" strokeWidth={1.5} />
                   </div>
                   <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                   <p className="text-sm text-[#71717a] leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
          </div>

        </div>

        {/* 5. Ecosystem Box (Enhanced Width & Graphics) */}
        <div className="border border-[#27272a] bg-[#0a0a0a] rounded-[32px] p-10 lg:p-16 flex flex-col xl:flex-row items-center gap-16 mb-6 shadow-2xl relative overflow-hidden">
           
           <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzZjNmNDYiLz48L3N2Zz4=')] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"></div>

           <div className="w-full xl:w-1/3 relative z-10">
             <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71717a] mb-6">THE AI ECOSYSTEM, CONNECTED</div>
             <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1]">Everything You Need.<br/>One Unified Platform.</h2>
             <p className="text-lg text-[#a1a1aa] leading-relaxed mb-8">
               AI Orbit connects the dots across foundational models, live benchmarks, rich datasets, and bleeding-edge research — empowering you to navigate the universe with confidence.
             </p>
             <Link href="/tools" className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all">
               Explore the Ecosystem <ArrowRight size={16} />
             </Link>
           </div>
           
           <div className="w-full xl:w-2/3 relative h-[400px] flex items-center justify-center z-10">
             {/* Central Glow */}
             <div className="absolute w-32 h-32 bg-black rounded-full shadow-[0_0_100px_rgba(255,255,255,0.2)] z-10 border border-white/20 flex flex-col items-center justify-center">
                <Globe2 size={28} className="text-white mb-2" strokeWidth={1.5} />
                <span className="text-[12px] font-black tracking-widest text-white">AI ORBIT</span>
             </div>
             
             {/* Massive Wide Orbits */}
             <div className="absolute w-[95%] h-[100px] border border-[#27272a] rounded-[100%] rotate-[-5deg] shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]"></div>
             <div className="absolute w-[100%] h-[200px] border border-[#3f3f46] rounded-[100%] rotate-[-5deg]"></div>
             <div className="absolute w-[80%] h-[300px] border border-dashed border-[#52525b]/50 rounded-[100%] rotate-[-5deg]"></div>

             {/* Enhanced Orbital Tags */}
             <div className="absolute top-[10%] left-[30%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><Layers size={14}/> Models</div>
             <div className="absolute bottom-[20%] left-[10%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><Database size={14}/> Datasets</div>
             <div className="absolute top-[20%] right-[15%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><BarChart2 size={14}/> Benchmarks</div>
             <div className="absolute bottom-[10%] left-[45%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><Package size={14}/> Tools</div>
             <div className="absolute bottom-[20%] right-[30%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><FileText size={14}/> Research</div>
             <div className="absolute top-[40%] right-[5%] border border-[#3f3f46] bg-[#121212]/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white z-20 shadow-xl flex items-center gap-2"><Target size={14}/> Leaderboards</div>
           </div>
        </div>

        {/* 6. Massive CTA Footer Box */}
        <div className="relative border border-[#27272a] bg-[#050505] rounded-[32px] p-16 lg:p-24 overflow-hidden flex flex-col lg:flex-row justify-between items-center shadow-2xl mt-6">
           {/* Enhanced Deep Earth Glow CSS Simulation */}
           <div className="absolute inset-x-0 bottom-[-50%] h-[150%] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/20 via-[#6E56CF]/10 to-transparent z-0 opacity-80"></div>
           <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-0 shadow-[0_0_40px_white]"></div>
           <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/10 to-transparent z-0"></div>
           
           <div className="relative z-10 flex flex-col items-center lg:items-start mb-10 lg:mb-0 text-center lg:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
               <Globe2 size={14} className="text-white" />
               <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white">Global Network</span>
             </div>
             <h2 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-4">Let's navigate it together.</h2>
             <div className="text-lg text-white/80 max-w-[500px]">The future of artificial intelligence is moving incredibly fast. Join 50,000+ researchers and builders navigating the frontier.</div>
           </div>
           
           <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <Link
                href="/submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-200 hover:scale-105 transition-all text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Join AI Orbit <ArrowRight size={20} />
              </Link>
           </div>
        </div>

      </div>

      {/* Global CSS Animation for dashed timeline */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
