'use client';

import { Sparkles } from 'lucide-react';

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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,166,35,0.14),transparent_38%),radial-gradient(circle_at_50%_10%,rgba(124,92,252,0.2),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.08),transparent_32%)]"
      />

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
