"use client";

import React, { useState } from "react";
import Link from "next/link";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';

import { AiOrbitLogo } from "./AiOrbitLogo";
import { MatrixLogo } from "./MatrixLogo";

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.169a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LINK_GROUPS = [
  {
    heading: "EXPLORE",
    links: [
      { label: "AI Tools", href: "/tools" },
      { label: "AI Agents", href: "/agents" },
      { label: "AI Models", href: "/models" },
      { label: "AI Companies", href: "/companies" },
      { label: "AI Devices", href: "/devices" },
      { label: "AI Robots", href: "/robots" },
    ]
  },
  {
    heading: "DISCOVER",
    links: [
      { label: "AI News", href: "/news" },
      { label: "AI Videos", href: "/videos" },
      { label: "AI Trends", href: "/trends" },
      { label: "AI Comparisons", href: "/tools/compare" },
      { label: "Leaderboard", href: "/leaderboard" },
    ]
  },
  {
    heading: "ECOSYSTEM",
    links: [
      { label: "Repositories", href: "/repositories" },
      { label: "MCP", href: "/mcp" },
      { label: "Tasks", href: "/tasks" },
      { label: "Submit AI", href: "/submit" },
      { label: "Advertise", href: "/advertise" },
    ]
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Write", href: "/write-for-us" },
      { label: "Press", href: "/press" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ]
  }
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black text-white pt-0 font-sans selection:bg-white/30 border-t border-[#1C1C1F]">
      <MatrixLogo />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-6 sm:pt-10">
        <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-16 lg:gap-32">

          {/* Left Column */}
          <div className="w-full lg:w-[380px] shrink-0">
            <Link href="/" className="flex items-center mb-0 sm:mb-2 -ml-4 sm:-ml-6 relative z-30">
              <AiOrbitLogo size="auto" className="h-[50px] sm:h-[70px] text-white" />
            </Link>

            <p className="text-[13px] sm:text-[14px] text-[#e4e4e7] mb-2 sm:mb-3">
              The Home of Everything AI.
            </p>

            <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#a1a1aa] mb-4 sm:mb-6 max-w-[320px]">
              Discover the tools, companies, and technologies shaping the global AI ecosystem.
            </p>

            <div className="flex items-center gap-4 sm:gap-6">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 active:scale-95 transition-all p-1" aria-label="X (Twitter)"><XIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 active:scale-95 transition-all p-1" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 active:scale-95 transition-all p-1" aria-label="Instagram"><InstagramIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 active:scale-95 transition-all p-1" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 active:scale-95 transition-all p-1" aria-label="Discord"><DiscordIcon /></a>
            </div>

          </div>

          <div className="flex-1 grid grid-cols-4 gap-x-3 sm:gap-x-8 gap-y-6 sm:gap-y-14 pt-0">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col">
                <div className="mb-2 sm:mb-4">
                  <h2 className="text-[9px] sm:text-[12px] font-bold text-white tracking-[0.05em] sm:tracking-[0.1em] uppercase mb-1.5 sm:mb-4 inline-block w-fit">
                    {group.heading}
                  </h2>
                  <div className="h-px w-full max-w-[80px] sm:max-w-[100px] bg-[#3f3f46]"></div>
                </div>
                <ul className="space-y-1 sm:space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[10px] sm:text-[14px] leading-tight sm:leading-normal text-[#e4e4e7] hover:text-white transition-colors font-medium block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Row */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[12px] sm:text-[13px] text-[#a1a1aa] text-center sm:text-left">
            &copy; 2026 AI Orbit. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-[#3f3f46] hover:bg-white/5 active:scale-95 transition-all text-white cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
