'use client';

import { Sparkles } from 'lucide-react';

function BusinessWorkflowInfographic() {
  return (
    <div
      aria-hidden="true"
      data-testid="business-hero-infographic"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-90"
    >
      <svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="business-flow-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#A78BFA" stopOpacity="0.12" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.22" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        <g fill="none" stroke="url(#business-flow-line)" strokeWidth="1.5">
          <path d="M152 50H286C314 50 320 35 350 35H405" />
          <path d="M160 188H286C316 188 322 205 350 205H405" />
          <path d="M795 35H850C880 35 886 50 914 50H1048" />
          <path d="M795 205H850C880 205 886 188 914 188H1048" />
          <path d="M118 72V168" strokeDasharray="3 7" opacity="0.55" />
          <path d="M1080 72V168" strokeDasharray="3 7" opacity="0.55" />
        </g>

        <g className="fill-white/[0.035] stroke-violet-200/25" strokeWidth="1">
          <rect x="38" y="28" width="114" height="44" rx="12" />
          <rect x="38" y="168" width="122" height="44" rx="12" />
          <rect x="1048" y="28" width="114" height="44" rx="12" />
          <rect x="1038" y="168" width="124" height="44" rx="12" />
        </g>

        <g className="fill-cyan-200/45">
          <circle cx="152" cy="50" r="3" />
          <circle cx="160" cy="188" r="3" />
          <circle cx="1048" cy="50" r="3" />
          <circle cx="1038" cy="188" r="3" />
        </g>

        <g className="fill-white/45 text-[10px] font-semibold tracking-[0.18em]">
          <text x="60" y="54">DISCOVER</text>
          <text x="63" y="194">SUPPORT</text>
          <text x="1070" y="54">AUTOMATE</text>
          <text x="1065" y="194">OPERATIONS</text>
        </g>

        <g className="fill-violet-200/20">
          <circle cx="350" cy="35" r="2" />
          <circle cx="350" cy="205" r="2" />
          <circle cx="850" cy="35" r="2" />
          <circle cx="850" cy="205" r="2" />
        </g>
      </svg>
    </div>
  );
}

export default function HeroGeometric({
  badge = 'Business AI directory',
  title1 = 'Find the right AI',
  title2 = '',
  description = 'Discover practical tools for growth, sales, support, and more.',
}: {
  badge?: string;
  title1?: string;
  title2?: string;
  description?: string;
}) {
  return (
    <div className="relative isolate flex min-h-[190px] w-full items-center justify-center overflow-hidden border-b border-white/[0.06] bg-black sm:min-h-[220px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(124,92,252,0.2),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.08),transparent_32%)]"
      />

      <BusinessWorkflowInfographic />

      <div
        data-testid="business-hero-content"
        className="relative z-10 container mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-6"
      >
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-[#0d0d12]/90 px-3 py-1 text-violet-100 shadow-[0_8px_24px_rgba(124,92,252,0.12)]">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-violet-300" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              {badge}
            </span>
          </div>

          <div>
            <h1 className="mx-auto mb-3 max-w-3xl whitespace-nowrap text-[clamp(0.875rem,4.7vw,1.125rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white sm:whitespace-normal sm:text-5xl md:mb-4 md:text-6xl">
              <span className="inline sm:block">
                {title1}
              </span>
              {title2 ? (
                <>
                  {" "}
                  <span className="inline text-white/45 sm:mt-1 sm:block">
                    {title2}
                  </span>
                </>
              ) : null}
            </h1>
          </div>

          <div>
            <p className="mx-auto mb-4 w-full whitespace-nowrap px-0 text-[clamp(0.375rem,1.7vw,0.875rem)] leading-4 tracking-[-0.05em] text-neutral-300 sm:whitespace-normal sm:text-sm sm:leading-6 sm:tracking-normal">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
