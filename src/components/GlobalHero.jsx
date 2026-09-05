import React from 'react';
import { Bot, Sparkles, ShieldCheck, Zap, Layers, ArrowRight } from 'lucide-react';

export default function GlobalHero({ totalRobots, onQuickCategory, onOpenInquiry }) {
  return (
    <div className="relative w-full border-b border-[#1C1C1F] bg-[#000000] overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-[#6E56CF]/15 via-[#6E56CF]/5 to-transparent blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-[#00E5FF]/5 blur-3xl pointer-events-none -z-0"></div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 relative z-10">
        {/* Breadcrumb / Category Tag */}
        <div className="flex items-center gap-2 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161a] border border-[#27272a] text-[12px] text-[#A1A1AA] shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-[#E4E4E7] font-medium">Physical AI Ecosystem</span>
            <span className="text-[#71717A]">/</span>
            <span className="text-[#A78BFA] font-medium">Hardware & Humanoids</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-[#71717A]">
            <Sparkles size={11} className="text-[#F5A623]" /> Verified Specs Matrix
          </span>
        </div>

        {/* Title and Tagline */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.12]">
            Humanoid &amp; Autonomous <br />
            <span className="bg-gradient-to-r from-white via-[#E4E4E7] to-[#A78BFA] bg-clip-text text-transparent">
              Robotics Directory
            </span>
          </h1>
          <p className="text-[14px] sm:text-[16px] text-[#A1A1AA] leading-relaxed mb-8 max-w-2xl font-normal">
            Explore and compare enterprise bipedal agents, industrial quadrupeds, and next-generation embodied AI hardware deployed across global factories, logistics hubs, and research labs.
          </p>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl pt-2">
          <div className="p-3.5 sm:p-4 rounded-xl border border-[#232326] bg-[#131316]/70 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">Tracked Platforms</span>
              <Bot size={14} className="text-[#6E56CF]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{totalRobots} Agents</div>
            <span className="text-[11px] text-[#10B981] font-medium flex items-center gap-1 mt-0.5">
              ● 100% Verified Specs
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-[#232326] bg-[#131316]/70 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">Max Payload</span>
              <Zap size={14} className="text-[#F5A623]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">120 kg</div>
            <span className="text-[11px] text-[#A1A1AA]">Unitree B2 / Heavy Duty</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-[#232326] bg-[#131316]/70 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">Max Degrees of Freedom</span>
              <Layers size={14} className="text-[#00E5FF]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">44 DoF</div>
            <span className="text-[11px] text-[#A1A1AA]">Figure 02 Dexterous Hands</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl border border-[#232326] bg-[#131316]/70 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">Enterprise Pilots</span>
              <ShieldCheck size={14} className="text-[#10B981]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">BMW, Tesla, GXO</div>
            <span className="text-[11px] text-[#A78BFA] cursor-pointer hover:underline" onClick={onOpenInquiry}>
              Request Fleet Quote →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
