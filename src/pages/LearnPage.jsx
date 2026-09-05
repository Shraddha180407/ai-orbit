import React, { useState } from 'react';
import { BookOpen, Video, FileText, CheckCircle2, Clock, Star, ArrowUpRight, Search, Award } from 'lucide-react';

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const guides = [
    {
      id: 1,
      title: 'The Ultimate Guide to Physical AI & Embodied Robotics',
      type: 'Executive Guide',
      source: 'The Rundown AI Ref',
      level: 'Intermediate',
      readTime: '18 min read',
      rating: 4.96,
      students: '14,200 reads',
      description: 'Understanding Vision-Language-Action (VLA) foundation models, Sim-to-Real Isaac Gym workflows, and actuator kinematics in 2026.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
      badge: 'Bestseller'
    },
    {
      id: 2,
      title: 'Skill Leap: Autonomous Agent Architecture Masterclass',
      type: 'Video Course',
      source: 'Futurepedia Courses Ref',
      level: 'Advanced',
      readTime: '3.5 hours • 12 Lessons',
      rating: 4.92,
      students: '8,400 students',
      description: 'Build multi-agent decision loops with LangGraph, MCP server routing, and self-correcting code execution sandboxes.',
      image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&auto=format&fit=crop&q=80',
      badge: 'Certified'
    },
    {
      id: 3,
      title: 'The Contrarian AI Strategy & Prompt Systems E-Book',
      type: 'E-Book / PDF',
      source: "There's An AI For That Ref",
      level: 'All Levels',
      readTime: '124 pages • PDF/ePub',
      rating: 4.88,
      students: '21,000 downloads',
      description: 'Challenging mainstream AI hype with structured contrarian reasoning frameworks, evaluation rubrics, and high-leverage prompts.',
      image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&auto=format&fit=crop&q=80',
      badge: 'Free Download'
    },
    {
      id: 4,
      title: 'ROS 2 Humble & Iron Robotics Pipeline for LLM Agents',
      type: 'Interactive Tutorial',
      source: 'AI Orbit Academy',
      level: 'Developer',
      readTime: '25 min code lab',
      rating: 4.95,
      students: '6,100 developers',
      description: 'Bridge Python LLM function calling to real-time micro-ROS hardware controllers, joint torque publishers, and LiDAR subscriber nodes.',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      badge: 'New Lab'
    }
  ];

  const filtered = guides.filter((g) => {
    if (activeTab !== 'All' && g.type !== activeTab) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-16">
      {/* Header */}
      <div className="border-b border-[#1C1C1F] bg-[#09090b] py-10 sm:py-14 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30 inline-block mb-3">
            AI Academy • Futurepedia &amp; The Rundown Guides
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Learn AI, Agents &amp; Physical Robotics
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl leading-relaxed">
            Curated expert courses, comprehensive industry guides, and battle-tested developer e-books to master modern artificial intelligence.
          </p>

          <div className="mt-6 max-w-md relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search guides, courses, or e-books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131316] border border-[#232326] text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#6E56CF]"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="p-5 sm:p-6 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all flex flex-col justify-between group">
              <div>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-[#0a0a0d] border border-[#232326]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#6E56CF] text-white">
                    {item.badge}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-black/70 backdrop-blur-md text-[#E4E4E7] border border-white/10">
                    {item.source}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#71717A] mb-2 font-mono">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{item.level}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#F5A623]">
                    ★ {item.rating}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-[#A78BFA] transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#1F1F24] flex items-center justify-between text-xs">
                <span className="text-[#71717A] flex items-center gap-1">
                  <Clock size={12} /> {item.readTime}
                </span>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-black font-semibold hover:bg-[#E4E4E7] transition-colors cursor-pointer">
                  <span>Open Resource</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
