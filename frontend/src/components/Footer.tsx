"use client";

import React, { useState } from "react";
import Link from "next/link";
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';

import { AiOrbitLogo } from "./AiOrbitLogo";

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
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
      { label: "Update AI", href: "/update" },
      { label: "Advertise", href: "/advertise" },
    ]
  },
  {
    heading: "AI ORBIT",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ]
  }
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black text-white pt-12 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 font-sans selection:bg-white/30 border-t border-[#1C1C1F]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10 sm:gap-16 lg:gap-32">

          {/* Left Column */}
          <div className="w-full lg:w-[380px] shrink-0">
            <Link href="/" className="flex items-center mb-4 sm:mb-6 -ml-5 sm:-ml-6 relative z-30">
              <AiOrbitLogo size={160} className="text-white" />
            </Link>

            <p className="text-[14px] sm:text-[16px] text-[#e4e4e7] mb-3 sm:mb-5">
              The Home of Everything AI.
            </p>

            <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#a1a1aa] mb-6 sm:mb-10 max-w-[320px]">
              Discover the tools, companies, and technologies shaping the global AI ecosystem.
            </p>

            <div className="flex items-center gap-5 sm:gap-6 mb-6 sm:mb-10">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="X (Twitter)"><XIcon /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="LinkedIn"><LinkedInIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="YouTube"><YouTubeIcon /></a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors" aria-label="Discord"><DiscordIcon /></a>
            </div>

            <div className="h-px w-full max-w-[340px] bg-[#27272a] mb-6 sm:mb-10"></div>

            <h3 id="newsletter" className="text-[15px] sm:text-[17px] font-bold text-white mb-2 sm:mb-4">Stay in the Orbit</h3>
            <p className="text-[13px] sm:text-[15px] text-[#a1a1aa] leading-relaxed mb-4 sm:mb-6 max-w-[300px]">
              Get the most important AI updates, trends, and launches.
            </p>

            <form onSubmit={handleSubscribe} className="flex h-[42px] sm:h-[46px] w-full max-w-[340px]">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border border-[#3f3f46] rounded-l-lg px-3.5 text-[14px] sm:text-[15px] text-white placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#71717a] transition-colors"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-12 sm:w-14 shrink-0 border border-l-0 border-[#3f3f46] rounded-r-lg hover:bg-white/5 transition-colors group cursor-pointer"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} className="text-[#a1a1aa] group-hover:text-white transition-colors" />
              </button>
            </form>
          </div>

          {/* Links Grid */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-14 pt-2">
            {LINK_GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col">
                <div className="mb-4 sm:mb-8">
                  <h4 className="text-[12px] sm:text-[14px] font-bold text-white tracking-[0.1em] uppercase mb-2 sm:mb-4 inline-block w-fit">
                    {group.heading}
                  </h4>
                  <div className="h-px w-full max-w-[80px] sm:max-w-[100px] bg-[#3f3f46]"></div>
                </div>
                <ul className="space-y-3 sm:space-y-[18px]">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] sm:text-[16px] text-[#e4e4e7] hover:text-white transition-colors font-medium"
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
        <div className="mt-12 sm:mt-24 pt-6 sm:pt-8 border-t border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] sm:text-[15px] text-[#a1a1aa] text-center sm:text-left">
            &copy; 2026 AI Orbit. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#3f3f46] hover:bg-white/5 transition-colors text-white cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
