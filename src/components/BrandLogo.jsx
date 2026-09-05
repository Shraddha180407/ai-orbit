import React from 'react';

export default function BrandLogo({ size = "default", className = "" }) {
  // size options: "sm" (header mobile), "default" (header desktop), "lg" (footer)
  const isLarge = size === "lg";
  const iconSize = isLarge ? 36 : 30;

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Original Custom Vector Mark: Concentric Neural Orbital System */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
        >
          {/* Subtle Outer Glow */}
          <circle cx="18" cy="18" r="16" fill="url(#orbit-glow)" opacity="0.3" />

          {/* Primary Orbital Ellipse (tilted 30 deg) */}
          <ellipse
            cx="18"
            cy="18"
            rx="14"
            ry="6"
            transform="rotate(-28 18 18)"
            stroke="url(#orbit-purple-gradient)"
            strokeWidth="1.8"
            strokeDasharray="40 8"
          />

          {/* Secondary Counter-Orbital Ellipse */}
          <ellipse
            cx="18"
            cy="18"
            rx="14"
            ry="6"
            transform="rotate(38 18 18)"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.2"
          />

          {/* Central Neural Core Nucleus */}
          <circle cx="18" cy="18" r="4.5" fill="url(#core-gradient)" />
          <circle cx="18" cy="18" r="2.2" fill="#FFFFFF" />

          {/* Orbiting Satellite Particle */}
          <circle cx="28" cy="12" r="1.8" fill="#A78BFA">
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Secondary Satellite Particle */}
          <circle cx="8" cy="24" r="1.4" fill="#00E5FF" />

          {/* Definitions */}
          <defs>
            <radialGradient
              id="orbit-glow"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(18 18) rotate(90) scale(16)"
            >
              <stop stopColor="#6E56CF" stopOpacity="0.8" />
              <stop offset="1" stopColor="#6E56CF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orbit-purple-gradient" x1="4" y1="12" x2="32" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A78BFA" />
              <stop offset="0.5" stopColor="#6E56CF" />
              <stop offset="1" stopColor="#3B2D7D" />
            </linearGradient>
            <linearGradient id="core-gradient" x1="13.5" y1="13.5" x2="22.5" y2="22.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#826DEB" />
              <stop offset="1" stopColor="#573EC2" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-[-0.03em] text-white font-sans ${
            isLarge ? "text-xl sm:text-2xl" : "text-[16px] sm:text-[18px]"
          }`}>
            AI ORBIT
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6E56CF] animate-pulse"></span>
        </div>
        <span className="text-[9px] uppercase tracking-[0.16em] font-semibold text-[#71717A] mt-0.5">
          The AI Signal
        </span>
      </div>
    </div>
  );
}
