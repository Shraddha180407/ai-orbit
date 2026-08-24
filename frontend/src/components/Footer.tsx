"use client";

import React, { useState } from "react";
import Link from "next/link";
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Github from 'lucide-react/dist/esm/icons/github';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const LINK_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "AI Tools", href: "/tools" },
      { label: "AI Models", href: "/models" },
      { label: "AI Companies", href: "/companies" },
      { label: "Devices", href: "/devices" },
    ],
  },
  {
    heading: "Discover",
    links: [
      { label: "Leaderboard", href: "/leaderboard" },
      { label: "Collections", href: "/collections" },
      { label: "Tasks", href: "/tasks" },
      { label: "Repositories", href: "/repositories" },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "News", href: "/news" },
      { label: "Submit Tool", href: "/tools" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="relative w-full border-t border-[#232326]/60 bg-[#000000] mt-16 overflow-hidden">
      {/* Subtle Orbital Glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] pointer-events-none opacity-40 blur-[100px]"
        style={{
          background: "radial-gradient(ellipse at bottom, rgba(110, 86, 207, 0.15), transparent 70%)"
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-8 py-14 z-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-5 xl:grid-cols-6 lg:gap-x-10">
          {/* Brand + Newsletter */}
          <div className="col-span-2 lg:col-span-2 xl:col-span-3 space-y-5 pr-4 sm:pr-8">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black font-black text-base border border-[#232326] transition-transform group-hover:scale-105 active:scale-95">
                S
              </div>
              <span className="text-base font-bold tracking-tight text-white transition-colors">
                AI Orbit
              </span>
            </Link>

            <p className="text-[13px] leading-relaxed text-[#A1A1AA] max-w-[280px]">
              The AI Signal — Discover the tools, companies, and signals shaping the global AI ecosystem.
            </p>

            <form id="newsletter" onSubmit={handleSubscribe} className="max-w-[280px] scroll-mt-24 pt-2">
              <label
                htmlFor="footer-email"
                className="block mb-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Stay in the Orbit
              </label>
              <div className="relative group">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#232326]/70 bg-[#111113] h-10 pl-3 pr-11 text-[12.5px] text-white placeholder:text-[#71717A] focus:outline-none transition-colors group-hover:border-[#3a3a3d]"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#6E56CF")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-8 rounded-md text-white flex items-center justify-center transition-all hover:brightness-110 active:scale-95"
                  style={{ backgroundColor: "#6E56CF" }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              <div className="h-4 mt-2">
                {subscribed && (
                  <span className="block text-[11px] font-medium text-emerald-400 animate-fade-in">
                    Thanks — you&apos;re in the orbit.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-4">
              <h4 className="text-[11px] font-semibold text-white/90 tracking-wider uppercase">
                {group.heading}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#A1A1AA] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-16 pt-6 border-t border-[#232326]/60 flex flex-col-reverse sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-[11.5px] text-[#71717A]">
            <p>&copy; {new Date().getFullYear()} AI Orbit. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/p/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/p/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            {[
              { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { Icon: Github, href: "https://github.com", label: "GitHub" },
              { Icon: MessageSquare, href: "https://discord.com", label: "Discord" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#232326]/60 text-[#A1A1AA] transition-all hover:text-white hover:border-[#3a3a3d] hover:bg-[#18181C]"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}