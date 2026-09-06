'use client';

import Link from 'next/link';

/* ── 1. TOOLS ICON (Crossed Screwdriver & Wrench with Neon Cyan/Purple Glow) ── */
function ToolsIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(168,85,247,0.5)]" fill="none">
        <defs>
          <radialGradient id="toolsBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#25163d" />
            <stop offset="70%" stopColor="#140c24" />
            <stop offset="100%" stopColor="#0a0712" />
          </radialGradient>
          <linearGradient id="wrenchGrad" x1="15%" y1="85%" x2="85%" y2="15%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="screwGrad" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#toolsBg)" stroke="#3e2566" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="24" fill="#a855f7" opacity="0.12" />

        {/* Screwdriver */}
        <g filter="url(#purpleGlow)">
          <rect x="23" y="23" width="5.5" height="14" rx="1" transform="rotate(45 23 23)" fill="#e2e8f0" />
          <path d="M 19 19 L 23 15 L 25 17 L 21 21 Z" fill="#94a3b8" />
          <rect x="33" y="33" width="9.5" height="19" rx="4" transform="rotate(45 33 33)" fill="url(#screwGrad)" stroke="#c084fc" strokeWidth="1" />
          <line x1="39" y1="37" x2="35" y2="41" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
          <line x1="43" y1="41" x2="39" y2="45" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
        </g>

        {/* Wrench */}
        <g filter="url(#purpleGlow)">
          <path
            d="M 46 26 L 23 49 C 21 51 18 51 16 49 C 14 47 14 44 16 42 L 39 19 Z"
            fill="url(#wrenchGrad)"
            stroke="#e879f9"
            strokeWidth="1.2"
          />
          <circle cx="19.5" cy="45.5" r="3.5" fill="#140c24" stroke="#e879f9" strokeWidth="1.5" />
          <path
            d="M 43 16 C 41 14 43 10 47 9 C 51 8 56 10 58 14 C 60 18 58 23 54 25 C 50 27 46 25 44 23 L 48 19 C 49 18 50 16 48 15 C 46 14 44 15 43 16 Z"
            fill="url(#wrenchGrad)"
            stroke="#f472b6"
            strokeWidth="1.2"
          />
        </g>
      </svg>
    </div>
  );
}

/* ── 2. AGENTS ICON (3D Glowing Green Robot Head) ── */
function AgentsIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(34,197,94,0.5)]" fill="none">
        <defs>
          <radialGradient id="agentsBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10301c" />
            <stop offset="70%" stopColor="#08180e" />
            <stop offset="100%" stopColor="#040c07" />
          </radialGradient>
          <linearGradient id="robotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="40%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="robotScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#052e16" />
            <stop offset="100%" stopColor="#021a0d" />
          </linearGradient>
          <filter id="greenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#agentsBg)" stroke="#1e522c" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="22" fill="#22c55e" opacity="0.12" />

        {/* Antenna */}
        <line x1="36" y1="21" x2="36" y2="13" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="36" cy="11.5" r="3.5" fill="#86efac" filter="url(#greenGlow)" />

        {/* Ear Capsules */}
        <rect x="14" y="26" width="4.5" height="13" rx="2" fill="#22c55e" stroke="#86efac" strokeWidth="0.8" />
        <rect x="53.5" y="26" width="4.5" height="13" rx="2" fill="#22c55e" stroke="#86efac" strokeWidth="0.8" />

        {/* Robot Head */}
        <rect
          x="17.5"
          y="19"
          width="37"
          height="29"
          rx="8.5"
          fill="url(#robotGrad)"
          stroke="#86efac"
          strokeWidth="1.2"
          filter="url(#greenGlow)"
        />

        <rect x="21.5" y="23" width="29" height="21" rx="5.5" fill="url(#robotScreen)" stroke="#16a34a" strokeWidth="0.8" />

        {/* Eyes */}
        <circle cx="28" cy="31" r="3.4" fill="#4ade80" filter="url(#greenGlow)" />
        <circle cx="28" cy="31" r="1.4" fill="#ffffff" />

        <circle cx="44" cy="31" r="3.4" fill="#4ade80" filter="url(#greenGlow)" />
        <circle cx="44" cy="31" r="1.4" fill="#ffffff" />

        {/* Mouth */}
        <path d="M 28 38 Q 36 43.5 44 38" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M 28 48 L 44 48 L 48 55 L 24 55 Z" fill="#15803d" opacity="0.85" />
      </svg>
    </div>
  );
}

/* ── 3. MCP ICON (3D Glowing Cyan-Blue Connected Network Nodes) ── */
function MCPIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(6,182,212,0.5)]" fill="none">
        <defs>
          <radialGradient id="mcpBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0c2940" />
            <stop offset="70%" stopColor="#061624" />
            <stop offset="100%" stopColor="#020b12" />
          </radialGradient>
          <radialGradient id="nodeCyan" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#67e8f9" />
            <stop offset="75%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
          <radialGradient id="nodeBlue" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#93c5fd" />
            <stop offset="75%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
          <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#mcpBg)" stroke="#135278" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="22" fill="#06b6d4" opacity="0.12" />

        {/* Connecting Lines */}
        <g stroke="#38bdf8" strokeWidth="2.2" opacity="0.9" filter="url(#cyanGlow)">
          <line x1="36" y1="36" x2="50" y2="18" />
          <line x1="36" y1="36" x2="20" y2="24" />
          <line x1="36" y1="36" x2="18" y2="48" />
          <line x1="36" y1="36" x2="53" y2="48" />
          <line x1="20" y1="24" x2="50" y2="18" stroke="#0ea5e9" strokeWidth="1.4" opacity="0.4" />
          <line x1="20" y1="24" x2="18" y2="48" stroke="#0ea5e9" strokeWidth="1.4" opacity="0.4" />
          <line x1="18" y1="48" x2="53" y2="48" stroke="#0ea5e9" strokeWidth="1.4" opacity="0.4" />
        </g>

        {/* Nodes */}
        <circle cx="50" cy="18" r="6" fill="url(#nodeCyan)" filter="url(#cyanGlow)" />
        <circle cx="20" cy="24" r="5" fill="url(#nodeBlue)" filter="url(#cyanGlow)" />
        <circle cx="18" cy="48" r="5.2" fill="url(#nodeCyan)" filter="url(#cyanGlow)" />
        <circle cx="53" cy="48" r="6" fill="url(#nodeBlue)" filter="url(#cyanGlow)" />
        <circle cx="36" cy="36" r="8.5" fill="url(#nodeCyan)" filter="url(#cyanGlow)" />
        <circle cx="34" cy="34" r="2.2" fill="#ffffff" opacity="0.95" />
      </svg>
    </div>
  );
}

/* ── 4. MODELS ICON (Glowing Violet/Magenta AI Neural Brain) ── */
function ModelsIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(217,70,239,0.5)]" fill="none">
        <defs>
          <radialGradient id="modelsBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2e0e38" />
            <stop offset="70%" stopColor="#17061d" />
            <stop offset="100%" stopColor="#0c020f" />
          </radialGradient>
          <linearGradient id="brainNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="magentaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#modelsBg)" stroke="#531c6b" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="22" fill="#d946ef" opacity="0.12" />

        {/* Neural Circuit Brain */}
        <g filter="url(#magentaGlow)" stroke="url(#brainNeon)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1="36" y1="17" x2="36" y2="55" strokeWidth="2.6" />
          <circle cx="36" cy="23" r="2" fill="#fdf4ff" stroke="none" />
          <circle cx="36" cy="36" r="2.2" fill="#fdf4ff" stroke="none" />
          <circle cx="36" cy="49" r="2" fill="#fdf4ff" stroke="none" />

          {/* Left Circuits */}
          <path d="M 36 21 C 27 20 21 24 21 30 C 21 34 24 36 28 36 L 36 36" />
          <path d="M 21 30 C 16 33 15 41 20 46 C 24 50 30 52 36 51" />
          <path d="M 28 36 C 25 40 27 44 32 45" />
          <path d="M 30 25 C 25 27 25 31 29 32" />

          {/* Right Circuits */}
          <path d="M 36 21 C 45 20 51 24 51 30 C 51 34 48 36 44 36 L 36 36" />
          <path d="M 51 30 C 56 33 57 41 52 46 C 48 50 42 52 36 51" />
          <path d="M 44 36 C 47 40 45 44 40 45" />
          <path d="M 42 25 C 47 27 47 31 43 32" />
        </g>
      </svg>
    </div>
  );
}

/* ── 5. NEWS ICON (Glowing Golden/Amber Editorial Newspaper) ── */
function NewsIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(245,158,11,0.5)]" fill="none">
        <defs>
          <radialGradient id="newsBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#301c08" />
            <stop offset="70%" stopColor="#180e03" />
            <stop offset="100%" stopColor="#0d0701" />
          </radialGradient>
          <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#newsBg)" stroke="#57340b" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="22" fill="#f59e0b" opacity="0.12" />

        <g filter="url(#amberGlow)">
          <rect x="23" y="15" width="31" height="39" rx="4" fill="#78350f" opacity="0.6" />
          <rect
            x="18"
            y="19"
            width="34"
            height="38"
            rx="4.5"
            fill="#1c1105"
            stroke="url(#amberGrad)"
            strokeWidth="2"
          />
          <rect x="22" y="23.5" width="26" height="4.5" rx="1.5" fill="url(#amberGrad)" />
          <rect x="22" y="31" width="10" height="10" rx="1.5" fill="#f59e0b" opacity="0.9" />
          <rect x="35" y="31" width="13" height="2.2" rx="1" fill="#fde68a" />
          <rect x="35" y="35" width="13" height="2.2" rx="1" fill="#f59e0b" opacity="0.75" />
          <rect x="35" y="39" width="10" height="2.2" rx="1" fill="#f59e0b" opacity="0.75" />
          <rect x="22" y="44.5" width="26" height="2.2" rx="1" fill="#fde68a" />
          <rect x="22" y="49" width="19" height="2.2" rx="1" fill="#f59e0b" opacity="0.65" />
        </g>
      </svg>
    </div>
  );
}

/* ── 6. VIDEOS ICON (Glowing Crimson Red Video Player) ── */
function VideosIcon() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[76px] xl:max-w-[84px] mx-auto">
      <svg viewBox="0 0 72 72" className="w-full h-full drop-shadow-[0_0_14px_rgba(239,68,68,0.5)]" fill="none">
        <defs>
          <radialGradient id="videosBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#320e0e" />
            <stop offset="70%" stopColor="#180505" />
            <stop offset="100%" stopColor="#0d0202" />
          </radialGradient>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle cx="36" cy="36" r="32" fill="url(#videosBg)" stroke="#5e1818" strokeWidth="1.2" />
        <circle cx="36" cy="36" r="22" fill="#ef4444" opacity="0.12" />

        <g filter="url(#redGlow)">
          <rect
            x="16.5"
            y="20"
            width="39"
            height="32"
            rx="7.5"
            fill="#1f0707"
            stroke="url(#redGrad)"
            strokeWidth="2.4"
          />
          <path
            d="M 32 28.5 L 45 36 L 32 43.5 Z"
            fill="#ef4444"
            stroke="#fca5a5"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}

/* ── REAL OFFICIAL COMPANY LOGOS ── */

/* 1. Official Google 'G' 4-color */
function GoogleLogo() {
  return (
    <div className="flex items-center justify-center py-1">
      <svg className="h-8 w-8 shrink-0 hover:scale-110 transition-transform" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    </div>
  );
}

/* 2. Official OpenAI Spiral */
function OpenAILogo() {
  return (
    <div className="flex items-center justify-center py-1">
      <svg className="h-8 w-8 shrink-0 fill-white hover:scale-110 transition-transform" viewBox="0 0 24 24">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.032.067L9.856 19.946a4.498 4.498 0 0 1-6.256-1.642zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.387 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.663zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5Z" />
      </svg>
    </div>
  );
}

/* 3. Official NVIDIA Logo (Exact Split-Color Eye + Wordmark) */
function NvidiaLogo() {
  return (
    <div className="flex items-center gap-2.5 shrink-0 py-1 hover:scale-105 transition-transform">
      {/* Exact Split-Color NVIDIA Eye Emblem */}
      <svg className="h-8 w-11 shrink-0" viewBox="0 0 90 64" fill="none">
        {/* Right side green box */}
        <rect x="42" y="6" width="46" height="52" rx="2" fill="#76B900" />

        {/* Outer Eye Outline - Left (Green) */}
        <path
          d="M 42 12 C 24 12 11 23 2 32 C 11 41 24 52 42 52 L 42 43.5 C 28 43.5 18 35.5 12 32 C 18 28.5 28 20.5 42 20.5 Z"
          fill="#76B900"
        />

        {/* Outer Eye Outline - Right (White inside Green Box) */}
        <path
          d="M 42 12 C 60 12 73 23 82 32 C 73 41 60 52 42 52 L 42 43.5 C 56 43.5 66 35.5 72 32 C 66 28.5 56 20.5 42 20.5 Z"
          fill="#FFFFFF"
        />

        {/* Inner Swirl Band - Left (Green) */}
        <path
          d="M 42 24.5 C 34 24.5 27 28.5 23 32 C 27 35.5 34 39.5 42 39.5 L 42 34 C 38 34 33.5 32.8 31 32 C 33.5 31.2 38 30 42 30 Z"
          fill="#76B900"
        />

        {/* Inner Swirl Band - Right (White inside Green Box) */}
        <path
          d="M 42 24.5 C 50 24.5 57 28.5 61 32 C 57 35.5 50 39.5 42 39.5 L 42 34 C 46 34 50.5 32.8 53 32 C 50.5 31.2 46 30 42 30 Z"
          fill="#FFFFFF"
        />

        {/* Center Iris Pupil - Split White */}
        <circle cx="42" cy="32" r="5" fill="#FFFFFF" />
      </svg>

      {/* NVIDIA Wordmark */}
      <span className="text-[19px] font-black tracking-wider text-white">NVIDIA</span>
    </div>
  );
}

/* 4. Official Anthropic Logo (A\ Monogram directly from user image) */
function AnthropicLogo() {
  return (
    <div className="flex items-center justify-center shrink-0 py-1 hover:scale-110 transition-transform">
      {/* Exact A\ glyph vector as shown in the reference image */}
      <svg className="h-8 w-11 fill-white" viewBox="0 0 125 100">
        {/* Letter 'A' */}
        <path d="M 2 95 L 34 10 L 52 10 L 84 95 L 67 95 L 60 74 L 26 74 L 19 95 Z M 31 59 L 55 59 L 43 23 Z" />
        {/* Backslash '\' */}
        <path d="M 70 10 L 87 10 L 118 95 L 101 95 Z" />
      </svg>
    </div>
  );
}

/* 5. 3D Isometric Neon Cube Badge */
function IsometricCubeLogo() {
  return (
    <div className="flex items-center justify-center shrink-0 py-1 hover:scale-110 transition-transform">
      <svg className="h-8 w-8 drop-shadow-[0_0_12px_rgba(217,70,239,0.7)]" viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        <polygon points="16,3.5 28,10.5 16,17.5 4,10.5" fill="none" stroke="url(#cubeTop)" strokeWidth="2" />
        <polygon points="4,10.5 16,17.5 16,28.5 4,21.5" fill="none" stroke="url(#cubeLeft)" strokeWidth="2" />
        <polygon points="28,10.5 16,17.5 16,28.5 28,21.5" fill="none" stroke="url(#cubeRight)" strokeWidth="2" />
        <circle cx="16" cy="16" r="2.5" fill="#38bdf8" />
      </svg>
    </div>
  );
}

/* ── EXPLORATION MODULES LIST ── */
const MODULES = [
  {
    label: 'Tools',
    href: '/tools',
    arrowColor: 'text-[#a855f7]',
    barGradient: 'from-[#8b5cf6] to-[#d946ef]',
    Icon: ToolsIcon,
  },
  {
    label: 'Agents',
    href: '/agents',
    arrowColor: 'text-[#22c55e]',
    barGradient: 'from-[#22c55e] to-[#4ade80]',
    Icon: AgentsIcon,
  },
  {
    label: 'MCP',
    href: '/mcp',
    arrowColor: 'text-[#06b6d4]',
    barGradient: 'from-[#06b6d4] to-[#3b82f6]',
    Icon: MCPIcon,
  },
  {
    label: 'Models',
    href: '/models',
    arrowColor: 'text-[#c084fc]',
    barGradient: 'from-[#c084fc] to-[#f472b6]',
    Icon: ModelsIcon,
  },
  {
    label: 'News',
    href: '/news',
    arrowColor: 'text-[#f59e0b]',
    barGradient: 'from-[#f59e0b] to-[#ea580c]',
    Icon: NewsIcon,
  },
  {
    label: 'Videos',
    href: '/videos',
    arrowColor: 'text-[#ef4444]',
    barGradient: 'from-[#ef4444] to-[#e11d48]',
    Icon: VideosIcon,
  },
];

export function AuthRightPanel() {
  return (
    <div className="hidden lg:flex lg:w-[58%] xl:w-[60%] flex-col justify-center relative overflow-hidden bg-black px-8 xl:px-12 py-6 h-full max-h-screen">

      {/* ── ETHEREAL PARTICLE WAVE MESH (Top Right Corner) ── */}
      <div className="absolute top-0 right-0 w-[540px] h-[340px] pointer-events-none overflow-hidden select-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 540 340" fill="none">
          {Array.from({ length: 14 }).flatMap((_, row) =>
            Array.from({ length: 26 }).map((_, col) => {
              const x = 540 - col * 18 - 8;
              const y = row * 18 + 8;
              const wave = Math.sin((col * 0.35) + (row * 0.4)) * 12 + Math.cos(col * 0.2) * 6;
              const distFromOrigin = Math.sqrt(Math.pow(col / 26, 2) + Math.pow(row / 14, 2));
              const opacity = Math.max(0.04, 0.75 - distFromOrigin * 0.7);
              const r = 1.1 + (Math.sin(col + row) * 0.4);
              return (
                <circle
                  key={`dot-${row}-${col}`}
                  cx={x}
                  cy={y + wave}
                  r={r}
                  fill="white"
                  opacity={opacity}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* ── MAIN FULL-WIDTH CONTAINER ── */}
      <div className="relative z-10 w-full max-w-[880px] mx-auto space-y-6 xl:space-y-7">

        {/* 1. TOP HERO SECTION */}
        <div>
          <h2 className="text-[38px] xl:text-[44px] font-black leading-[1.08] tracking-tight text-white">
            Your AI Journey<br />
            Starts <span className="bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#c084fc] bg-clip-text text-transparent">Here</span>
          </h2>
        </div>

        {/* 2. MIDDLE EXPLORATION CARD */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 backdrop-blur-md p-6 xl:p-7 shadow-2xl">
          <h3 className="text-[15.5px] font-bold text-white tracking-tight mb-3.5">
            Explore the AI Universe
          </h3>

          {/* 6 Category Cards Grid */}
          <div className="grid grid-cols-6 gap-2.5 xl:gap-3">
            {MODULES.map(({ label, href, arrowColor, barGradient, Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col justify-between rounded-xl border border-white/[0.07] bg-[#121215] p-3 xl:p-3.5 hover:border-white/[0.22] hover:bg-[#18181e] transition-all duration-200 group active:scale-[0.98]"
              >
                {/* 3D Glowing Icon */}
                <div className="w-full flex items-center justify-center py-1">
                  <Icon />
                </div>

                {/* Text + Arrow */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12.5px] font-semibold text-white/80 group-hover:text-white transition-colors">
                      {label}
                    </span>
                    <span className={`text-[12.5px] font-bold ${arrowColor} group-hover:translate-x-0.5 transition-transform`}>
                      →
                    </span>
                  </div>

                  {/* Accent Progress Line */}
                  <div className="mt-1.5 w-full h-[2.5px] rounded-full bg-white/[0.06] overflow-hidden">
                    <div className={`h-full w-[45%] rounded-full bg-gradient-to-r ${barGradient} group-hover:w-full transition-all duration-300`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. USED BY TEAMS AT CARD */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/95 backdrop-blur-md px-6 xl:px-8 py-5 xl:py-6 shadow-2xl mt-7 xl:mt-8">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 text-center mb-4">
            Used by teams at
          </p>

          <div className="flex items-center justify-between px-2 sm:px-6">
            <GoogleLogo />
            <div className="h-8 w-[1px] bg-white/[0.1]" />
            <OpenAILogo />
            <div className="h-8 w-[1px] bg-white/[0.1]" />
            <NvidiaLogo />
            <div className="h-8 w-[1px] bg-white/[0.1]" />
            <AnthropicLogo />
            <div className="h-8 w-[1px] bg-white/[0.1]" />
            <IsometricCubeLogo />
          </div>
        </div>

        {/* 4. FOOTER INFO */}
        <p className="text-center text-[11px] text-white/25 pt-0.5">
          © 2026 AIORBIT • All rights reserved
        </p>

      </div>

    </div>
  );
}
