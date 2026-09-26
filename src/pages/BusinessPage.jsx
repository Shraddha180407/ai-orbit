import React, { useState } from 'react';
import { Briefcase, TrendingUp, Users, Headphones, DollarSign, Settings, Shield, ArrowUpRight, CheckCircle2, Search } from 'lucide-react';

export default function BusinessPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  const businessFunctions = [
    {
      id: 'customer-service',
      category: 'Customer Service & Support',
      adoptionRate: '80% Enterprise Adoption',
      description: 'Autonomous AI customer agents, voice bots, sentiment analytics, and tier-1 ticket deflection.',
      icon: Headphones,
      tools: [
        { name: 'Decagon AI', rating: '4.9', role: 'Enterprise AI Customer Support Agent', roi: '+72% First Contact Deflection' },
        { name: 'Fin by Intercom', rating: '4.8', role: 'Autonomous Resolution Engine', roi: '51% Instant Resolution Rate' },
        { name: 'Sierra AI', rating: '4.9', role: 'Conversational Business Agents', roi: '99.4% CSAT Consistency' }
      ]
    },
    {
      id: 'sales',
      category: 'Sales & Revenue Operations',
      adoptionRate: '33% Enterprise Adoption',
      description: 'Outbound pipeline generation, real-time objection handling, CRM automation, and meeting intelligence.',
      icon: DollarSign,
      tools: [
        { name: 'Clay.com', rating: '4.9', role: 'Automated Account Research & Waterfall Enrichment', roi: '4.2x Outbound Pipeline' },
        { name: 'Apollo AI', rating: '4.8', role: 'Buyer Intelligence & Auto-Sequencing', roi: '60% Rep Time Saved' },
        { name: 'Gong.io AI', rating: '4.9', role: 'Deal Execution & Revenue Intelligence', roi: '22% Higher Win Rates' }
      ]
    },
    {
      id: 'operations',
      category: 'Operations & Project Management',
      adoptionRate: '25% Enterprise Adoption',
      description: 'Document extraction, workflow automation, inventory forecasting, and multimodal data ingestion.',
      icon: Settings,
      tools: [
        { name: 'Zapier Central', rating: '4.8', role: 'Autonomous Cross-App Bot Automation', roi: '14 hrs/week Saved' },
        { name: 'Cursor AI Team', rating: '4.9', role: 'Automated Software Dev Workflows', roi: '2.5x Velocity Multiplier' },
        { name: 'Notion AI Enterprise', rating: '4.8', role: 'Universal Company Brain & Knowledge Sync', roi: '85% Search Time Cut' }
      ]
    },
    {
      id: 'back-office',
      category: 'Finance, HR & Legal Compliance',
      adoptionRate: '20% Enterprise Adoption',
      description: 'Automated contract redlining, compliance audits, invoice reconciliation, and candidate screening.',
      icon: Shield,
      tools: [
        { name: 'Robin AI', rating: '4.8', role: 'Legal Contract Review & Clause Extraction', roi: '80% Contract Cycle Reduction' },
        { name: 'Ramp AI Accounting', rating: '4.9', role: 'Autonomous Expense Auditing & OCR', roi: 'Zero Manual Reconciliation' },
        { name: 'Eightfold.ai', rating: '4.8', role: 'Talent Intelligence & Skill Matching', roi: '3.4x Faster Time-to-Hire' }
      ]
    },
    {
      id: 'marketing',
      category: 'Growth & Content Marketing',
      adoptionRate: '45% Enterprise Adoption',
      description: 'Personalized ad generation, programmatic SEO, creative variant testing, and multimodal brand assets.',
      icon: TrendingUp,
      tools: [
        { name: 'Midjourney v6.1 Enterprise', rating: '4.9', role: 'Photorealistic Ad Creative Suite', roi: '90% Asset Cost Reduction' },
        { name: 'Jasper Business', rating: '4.7', role: 'On-Brand Enterprise Content Operations', roi: '5x Content Throughput' },
        { name: 'HeyGen Team', rating: '4.8', role: 'Localized AI Video Generation in 40+ Languages', roi: '10x Faster Video Output' }
      ]
    }
  ];

  const filteredFunctions = businessFunctions.filter((fn) => {
    if (activeTab !== 'All' && fn.category !== activeTab) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return fn.category.toLowerCase().includes(q) || fn.description.toLowerCase().includes(q) || fn.tools.some(t => t.name.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-16">
      {/* Header Banner */}
      <div className="border-b border-[#1C1C1F] bg-[#09090b] py-10 sm:py-14 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6E56CF] bg-[#6E56CF]/15 px-3 py-1 rounded-full border border-[#6E56CF]/30 inline-block mb-3">
            Business AI Directory • Futurepedia Ref
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            AI by Business Function
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl leading-relaxed">
            Discover how Fortune 500 enterprises and hyper-growth scaleups implement artificial intelligence across customer service, revenue, operations, and compliance.
          </p>

          {/* Search bar */}
          <div className="mt-6 max-w-md relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              id="business-search-input"
              name="businessSearch"
              type="text"
              placeholder="Search business functions, tools, or ROI metrics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131316] border border-[#232326] text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#6E56CF]"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8">
        <div className="space-y-8">
          {filteredFunctions.map((fn) => {
            const Icon = fn.icon;
            return (
              <div key={fn.id} className="p-6 sm:p-8 rounded-2xl border border-[#232326] bg-[#111115]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#1F1F24]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6E56CF]/20 border border-[#6E56CF]/40 flex items-center justify-center text-[#A78BFA]">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{fn.category}</h3>
                      <p className="text-xs text-[#A1A1AA]">{fn.description}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 w-fit font-mono">
                    {fn.adoptionRate}
                  </span>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {fn.tools.map((tool, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-[#232326] bg-[#16161c] hover:border-[#3b3b44] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-sm">{tool.name}</span>
                        <span className="text-[11px] font-mono text-[#F5A623]">★ {tool.rating}</span>
                      </div>
                      <span className="text-xs text-[#A1A1AA] block mb-3">{tool.role}</span>
                      <div className="pt-2 border-t border-[#232326] flex items-center justify-between text-xs">
                        <span className="text-[11px] font-semibold text-[#10B981]">{tool.roi}</span>
                        <span className="text-[#6E56CF] font-medium flex items-center gap-0.5">
                          Explore <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
