import React, { useState } from 'react';
import { Cpu, Search, ArrowUpRight, Building, Globe, ShieldCheck, MapPin, DollarSign, Users } from 'lucide-react';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  const companies = [
    {
      name: 'Figure AI',
      hq: 'Sunnyvale, CA, United States',
      founded: 2022,
      valuation: '$2.6 Billion',
      status: 'Commercial Fleet Scale',
      investors: ['OpenAI', 'Microsoft', 'Nvidia', 'Jeff Bezos'],
      flagshipProduct: 'Figure 02 Autonomous Humanoid',
      description: 'Developing commercially viable autonomous humanoids combining dexterity with cutting-edge conversational speech-to-speech reasoning.',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'Boston Dynamics',
      hq: 'Waltham, MA, United States',
      founded: 1992,
      valuation: 'Hyundai Motor Group Subsidiary',
      status: 'Global Industrial Leader',
      investors: ['Hyundai Motor Group', 'SoftBank'],
      flagshipProduct: 'Atlas All-Electric & Spot Enterprise',
      description: 'Global pioneer in dynamic quadruped and humanoid mobility with over three decades of field-proven robotics innovation.',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'Unitree Robotics',
      hq: 'Hangzhou, China',
      founded: 2016,
      valuation: '$1.2 Billion',
      status: 'High Volume Production',
      investors: ['Sequoia China', 'Matrix Partners'],
      flagshipProduct: 'Unitree G1 & B2 Industrial Quadruped',
      description: 'Leader in democratizing high-performance quadruped and bipedal humanoid platforms with competitive price-to-torque ratios.',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: '1X Technologies',
      hq: 'Moss, Norway & Sunnyvale, CA',
      founded: 2014,
      valuation: '$400 Million',
      status: 'Pre-Order Pilot Rollout',
      investors: ['OpenAI Startup Fund', 'Tiger Global', 'EQT Ventures'],
      flagshipProduct: 'NEO Beta Soft Humanoid',
      description: 'Designing safe, soft-actuated biomimetic humanoid androids engineered for direct human collaboration in domestic and care settings.',
      logo: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&auto=format&fit=crop&q=80'
    },
    {
      name: 'Agility Robotics',
      hq: 'Tangv, Oregon, United States',
      founded: 2015,
      valuation: '$1.0 Billion',
      status: 'Commercial Warehouse Fleets',
      investors: ['Amazon Industrial Innovation Fund', 'DCVC', 'Playground Global'],
      flagshipProduct: 'Digit v4 Logistics Robot',
      description: 'Creator of the first commercial humanoid operating in brownfield logistics warehouses alongside people and automated systems.',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80'
    }
  ];

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.flagshipProduct.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-16">
      <div className="border-b border-[#1C1C1F] bg-[#09090b] py-10 sm:py-14 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA] bg-[#6E56CF]/15 px-3 py-1 rounded-full border border-[#6E56CF]/30 inline-block mb-3">
            AI Companies &amp; Robotics Labs
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Leading Robotics Labs &amp; Hardware Vendors
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-2xl leading-relaxed">
            Profiles, funding rounds, valuations, and flagship hardware portfolios of companies building the frontier of embodied artificial intelligence.
          </p>
          <div className="mt-6 max-w-md relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search companies, labs, or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#131316] border border-[#232326] text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:border-[#6E56CF]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((comp, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{comp.name}</h3>
                    <span className="text-xs text-[#71717A] flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {comp.hq}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                    {comp.status}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-[#A1A1AA] leading-relaxed mb-4">
                  {comp.description}
                </p>

                <div className="p-3 rounded-xl bg-[#16161c] border border-[#272730] space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Flagship Platform</span>
                    <span className="font-semibold text-white">{comp.flagshipProduct}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Valuation / Backing</span>
                    <span className="font-mono text-[#A78BFA] font-bold">{comp.valuation}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-[#71717A] block mb-1.5">Key Investors &amp; Partners</span>
                  <div className="flex flex-wrap gap-1.5">
                    {comp.investors.map((inv, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-[#1a1a20] border border-[#27272e] text-[#A1A1AA]">
                        {inv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1F1F24] flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Est. {comp.founded}</span>
                <button className="flex items-center gap-1 text-[#A78BFA] hover:text-white transition-colors font-medium">
                  <span>View Lab Portfolio</span>
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
