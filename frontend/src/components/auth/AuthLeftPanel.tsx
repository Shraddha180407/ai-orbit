'use client';

import Link from 'next/link';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import BrainCircuit from 'lucide-react/dist/esm/icons/brain-circuit';
import Rocket from 'lucide-react/dist/esm/icons/rocket';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
import GitFork from 'lucide-react/dist/esm/icons/git-fork';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import MonitorSmartphone from 'lucide-react/dist/esm/icons/monitor-smartphone';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

/* Three hero feature cards — large, spacious, high-signal */
const HIGHLIGHTS = [
  {
    icon: Wrench,
    accent: '#6E56CF',
    title: 'Discover AI Tools',
    body: 'Search, filter and compare thousands of AI tools by use case, pricing and platform. From writing assistants to coding agents.',
  },
  {
    icon: BrainCircuit,
    accent: '#3b82f6',
    title: 'Track Models & Research',
    body: 'Stay on top of the latest LLMs, image generators, speech models and benchmarks — all in one place.',
  },
  {
    icon: Newspaper,
    accent: '#f59e0b',
    title: 'Daily AI Intelligence',
    body: 'Curated news, company updates, funding rounds and breakthroughs from across the AI landscape — every day.',
  },
];

/* Smaller pill tags hinting at everything else */
const EXTRAS = [
  { icon: Rocket, label: 'Robots' },
  { icon: Cpu, label: 'MCP Servers' },
  { icon: GitFork, label: 'Repositories' },
  { icon: Building2, label: 'Companies' },
  { icon: MonitorSmartphone, label: 'AI Devices' },
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden bg-[#020204] border-r border-[#0c0c10]">

      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-[#6E56CF]/[0.07] blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-16 w-[380px] h-[380px] rounded-full bg-[#3b82f6]/[0.05] blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#8b5cf6]/[0.04] blur-[90px] pointer-events-none" />

      {/* Dot-matrix background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col h-full px-10 xl:px-12 py-10 overflow-y-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 mb-12">
          <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-black/40">
            <Bot size={15} className="text-black" />
          </div>
          <span className="text-[15px] font-black tracking-tight text-white">AIORBIT</span>
        </Link>

        {/* Headline */}
        <div className="shrink-0 mb-10">
          <p className="text-[11px] font-semibold tracking-[0.15em] text-[#6E56CF] uppercase mb-3">
            Your AI Intelligence Hub
          </p>
          <h2 className="text-[34px] xl:text-[38px] font-black leading-[1.15] tracking-[-0.02em] text-white">
            Everything AI,<br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #a78bfa 0%, #6E56CF 40%, #3b82f6 100%)',
              }}
            >
              in one orbit.
            </span>
          </h2>
          <p className="mt-4 text-[13px] text-[#52525B] leading-relaxed max-w-[300px]">
            The signal through the noise. Discover, compare and stay ahead of the AI landscape.
          </p>
        </div>

        {/* Three feature cards */}
        <div className="flex flex-col gap-3 flex-1">
          {HIGHLIGHTS.map(({ icon: Icon, accent, title, body }) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-[#111116] bg-[#07070b]/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-[#1a1a22] hover:bg-[#0a0a0f]/80"
              style={{ boxShadow: `0 0 0 0 ${accent}00` }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full opacity-60"
                style={{ background: accent }}
              />

              <div className="pl-4 flex items-start gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-0.5"
                  style={{
                    background: `${accent}14`,
                    border: `1px solid ${accent}28`,
                  }}
                >
                  <Icon size={14} style={{ color: accent }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-white leading-tight mb-1">{title}</p>
                  <p className="text-[11.5px] text-[#555560] leading-relaxed">{body}</p>
                </div>
              </div>
            </div>
          ))}

          {/* "And much more" pill row */}
          <div className="pt-2 pb-1">
            <p className="text-[10px] font-semibold text-[#333338] uppercase tracking-widest mb-3">
              And much more
            </p>
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#141418] bg-[#0a0a0e] px-3 py-1 text-[11px] font-medium text-[#52525B]"
                >
                  <Icon size={10} className="text-[#3a3a42]" />
                  {label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 rounded-full border border-[#141418] bg-[#0a0a0e] px-3 py-1 text-[11px] font-medium text-[#3a3a42]">
                +more <ArrowRight size={9} />
              </span>
            </div>
          </div>
        </div>

        {/* Bottom anchor */}
        <div className="shrink-0 mt-8 pt-6 border-t border-[#0c0c10]">
          <p className="text-[11px] text-[#222228]">
            © 2026 AI Orbit · Free to use · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}
