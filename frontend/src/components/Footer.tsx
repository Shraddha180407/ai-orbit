"use client";

import React, { useState } from "react";
import Link from "next/link";
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Github from 'lucide-react/dist/esm/icons/github';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const LINK_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Product",
    links: [
      { label: "AI Tools Directory", href: "/tools" },
      { label: "AI Companies", href: "/companies" },
      { label: "AI Models", href: "/models" },
      { label: "AI Tasks List", href: "/tools" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "API Reference", href: "/tools" },
      { label: "Site Documentation", href: "/tools" },
      { label: "Monthly Changelog", href: "/tools" },
      { label: "Integration Guides", href: "/tools" },
    ],
  },
  {
    heading: "Collections",
    links: [
      { label: "Curated Bundles", href: "/tools" },
      { label: "Free AI Tools", href: "/tools?pricing=FREE" },
      { label: "Developer Kits", href: "/tools?category=coding" },
      { label: "Writing Copilots", href: "/tools?category=writing" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About The AI Signal", href: "/tools" },
      { label: "Careers (Hiring)", href: "/tools" },
      { label: "Privacy Policy", href: "/tools" },
      { label: "Terms of Service", href: "/tools" },
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
    <footer className="w-full border-t border-[#232326]/60 bg-[#000000] mt-16">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-6 lg:gap-x-10">
          {/* Brand + Newsletter */}
          <div className="col-span-2 sm:col-span-2 space-y-4 pr-4">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-black font-black text-base border border-[#232326]/60"
                style={{ backgroundColor: "var(--color-signal)" }}
              >
                S
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                The AI Signal
              </span>
            </div>

            <p className="text-[13px] leading-relaxed text-[#A1A1AA] max-w-[280px]">
              The premium discovery engine for tools, models, and the global AI ecosystem.
            </p>

            <form id="newsletter" onSubmit={handleSubscribe} className="max-w-[280px] scroll-mt-24">
              <label
                htmlFor="footer-email"
                className="block mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-[#71717A]"
              >
                Subscribe to newsletter
              </label>
              <div className="relative">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#232326]/70 bg-[#111113] h-10 pl-3 pr-11 text-[12.5px] text-white placeholder:text-[#71717A] focus:outline-none transition-colors"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-signal)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "")}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 w-8 rounded-md text-black flex items-center justify-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--color-signal)" }}
                  aria-label="Subscribe"
                >
                  <ArrowRight size={13} />
                </button>
              </div>
              <div className="h-4 mt-1.5">
                {subscribed && (
                  <span className="block text-[11px] text-emerald-400 animate-fade-in">
                    Thanks — you&apos;re subscribed.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Link groups */}
          {LINK_GROUPS.map((group) => (
            <div key={group.heading} className="space-y-3.5">
              <h4 className="text-[11px] font-semibold text-white/90 tracking-wider uppercase">
                {group.heading}
              </h4>
              <ul className="space-y-2.5">
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
        <div className="mt-12 pt-6 border-t border-[#232326]/60 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#71717A]">
            &copy; {new Date().getFullYear()} The AI Signal Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
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
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#232326]/60 text-[#71717A] transition-colors hover:text-white hover:border-[#3a3a3d]"
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