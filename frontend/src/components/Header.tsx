"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import Plus from "lucide-react/dist/esm/icons/plus";
import { AiOrbitLogo } from "./AiOrbitLogo";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import Trophy from "lucide-react/dist/esm/icons/trophy";
import Wrench from "lucide-react/dist/esm/icons/wrench";
import Sparkles from "lucide-react/dist/esm/icons/sparkles";
import Bot from "lucide-react/dist/esm/icons/bot";
import Building2 from "lucide-react/dist/esm/icons/building-2";
import Cpu from "lucide-react/dist/esm/icons/cpu";
import Smartphone from "lucide-react/dist/esm/icons/smartphone";
import ListChecks from "lucide-react/dist/esm/icons/list-checks";
import Newspaper from "lucide-react/dist/esm/icons/newspaper";
import PlayCircle from "lucide-react/dist/esm/icons/play-circle";
import GitBranch from "lucide-react/dist/esm/icons/git-branch";
import Plug from "lucide-react/dist/esm/icons/plug";
import Mail from "lucide-react/dist/esm/icons/mail";
import BriefcaseBusiness from "lucide-react/dist/esm/icons/briefcase-business";

const MOBILE_NAV_LINKS = [
  { label: "Business AI", href: "/business" },
  { label: "Leaderboard", href: "/leaderboard", highlight: true },
  { label: "Resources", href: "/tools" },
  { label: "Advertise", href: "/advertise" },
  { label: "Newsletter", href: "https://brief.graphone.co" },
];

const DIRECTORY_LINKS = [
  { name: "AI Tools", href: "/tools", icon: Wrench, color: "#FFC53D" },
  {
    name: "Business AI",
    href: "/business",
    icon: BriefcaseBusiness,
    color: "#A78BFA",
  },
  { name: "AI Agents", href: "/agents", icon: Bot, color: "#A855F7" },
  { name: "AI Models", href: "/models", icon: Cpu, color: "#A78BFA" },
  {
    name: "AI Companies",
    href: "/companies",
    icon: Building2,
    color: "#38BDF8",
  },
  { name: "AI Devices", href: "/devices", icon: Smartphone, color: "#F472B6" },
  { name: "AI Robots", href: "/robots", icon: Bot, color: "#2DD4BF" },
  { name: "Tasks", href: "/tasks", icon: ListChecks, color: "#FB923C" },
  {
    name: "Repositories",
    href: "/repositories",
    icon: GitBranch,
    color: "#22D3EE",
  },
  { name: "MCP Servers", href: "/mcp", icon: Plug, color: "#818CF8" },
  { name: "AI News", href: "/news", icon: Newspaper, color: "#FF6B4A" },
  { name: "AI Videos", href: "/videos", icon: PlayCircle, color: "#F87171" },
];

export function Header() {
  const { user, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-md py-0.5 sm:py-1 relative">
      {/* Center: Nav links, centered against the full page width on lg+ */}
      <nav className="hidden lg:flex items-center gap-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-auto">
        <Link
          href="/business"
          className="text-[12px] font-bold text-foreground-muted hover:text-white transition-colors text-center cursor-pointer relative z-50"
        >
          Business AI
        </Link>

        <Link
          href="/leaderboard"
          className="text-[12px] font-bold text-[#6E56CF] hover:text-white transition-colors text-center cursor-pointer relative z-50"
        >
          Leaderboard
        </Link>

        <Link
          href="/tools"
          className="text-[12px] font-bold text-foreground-muted hover:text-white transition-colors text-center cursor-pointer relative z-50"
        >
          Resources
        </Link>

        <Link
          href="https://brief.graphone.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-bold text-foreground-muted hover:text-white transition-colors text-center cursor-pointer relative z-50"
        >
          Newsletter
        </Link>
      </nav>

      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-8 flex items-center justify-between relative gap-2 z-20">
        {/* Left: The AI Orbit Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer relative z-20"
            aria-label="Open navigation menu"
          >
            <Menu size={16} aria-hidden="true" />
          </button>

          <Link
            href="/"
            className="flex items-center group shrink-0 min-w-0 -ml-2 relative z-30"
          >
            <div className="transform scale-[1.2] sm:scale-[1.25] origin-left transition-transform duration-200 group-hover:scale-[1.25] sm:group-hover:scale-[1.3] active:scale-[1.15] sm:active:scale-[1.2]">
              <AiOrbitLogo
                size="auto"
                className="h-9 sm:h-11 lg:h-[3.25rem] text-white"
              />
            </div>
          </Link>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <Link
            href="/advertise"
            className="hidden sm:inline-flex h-[26px] sm:h-[28px] items-center justify-center rounded-full border border-[#6E56CF]/60 bg-[#6E56CF]/10 px-2 sm:px-3 text-[10px] sm:text-[11px] font-semibold text-[#C4B5FD] hover:bg-[#6E56CF]/20 hover:text-white transition-colors shrink-0 whitespace-nowrap"
          >
            Advertise
          </Link>

          <Link
            href="/submit"
            className="group inline-flex h-[26px] sm:h-[28px] items-center gap-1 sm:gap-1.5 rounded-full px-2 sm:px-3 text-[10px] sm:text-[11px] font-semibold transition-all duration-200 hover:brightness-110 active:scale-95 shrink-0 whitespace-nowrap bg-[#6E56CF] text-white"
          >
            <Plus size={11} strokeWidth={2.5} className="shrink-0" />
            Submit Tool
          </Link>

          {isLoading ? (
            <div className="h-[26px] w-[50px] sm:h-[28px] sm:w-[80px] animate-pulse rounded-lg bg-white/10 shrink-0" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="inline-flex h-[26px] sm:h-[28px] items-center justify-center rounded-lg bg-white px-2 sm:px-3 text-[10px] sm:text-[11px] font-bold text-black hover:bg-neutral-200 transition-colors shrink-0 whitespace-nowrap"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="inline-flex h-[26px] sm:h-[28px] items-center justify-center rounded-lg border border-white/20 bg-transparent px-2 sm:px-3 text-[10px] sm:text-[11px] font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors shrink-0 whitespace-nowrap"
            >
              Log In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer rendered via portal to break out of containing blocks */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] md:hidden bg-[#0A0A0C] flex flex-col animate-fadeIn">
            {/* Top Bar of Drawer */}
            <div className="flex items-center justify-between p-3.5 border-b border-[#232326]/80 bg-[#0D0D10]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center relative z-30"
              >
                <AiOrbitLogo size="auto" className="h-14 text-white" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Main navigation section */}
              <div className="p-3.5 border-b border-[#232326]/60">
                <div className="grid grid-cols-2 gap-2">
                  {MOBILE_NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      target={
                        link.label === "Newsletter" ? "_blank" : undefined
                      }
                      rel={
                        link.label === "Newsletter"
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center rounded-xl p-3 text-xs font-bold transition-all ${
                        link.highlight
                          ? "bg-[#6E56CF]/15 border border-[#6E56CF]/40 text-[#A78BFA]"
                          : "bg-[#111114] border border-[#232326] text-white hover:border-white/20"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Directory quick links */}
              <div className="p-3.5">
                <p className="text-[10px] font-mono font-bold tracking-widest text-[#A1A1AA] uppercase mb-3 px-1">
                  Explore Ecosystem
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {DIRECTORY_LINKS.map((dir) => {
                    const Icon = dir.icon;

                    return (
                      <Link
                        key={dir.name}
                        href={dir.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl border border-[#232326]/70 bg-[#0d0d10] p-2.5 hover:border-white/20 transition-all group"
                      >
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
                          style={{
                            backgroundColor: `${dir.color}15`,
                            borderColor: `${dir.color}35`,
                          }}
                        >
                          <Icon
                            size={12}
                            aria-hidden="true"
                            style={{ color: dir.color }}
                          />
                        </span>

                        <span className="text-xs font-semibold text-white group-hover:text-white truncate">
                          {dir.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom account/action bar */}
            <div className="p-3.5 border-t border-[#232326]/80 bg-[#0D0D10] space-y-2 mt-auto">
              <div className="flex gap-2">
                <Link
                  href="/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl bg-[#6E56CF] text-white text-xs font-bold transition-colors shadow-md shadow-[#6E56CF]/20"
                >
                  <Plus size={14} strokeWidth={2.5} /> Submit AI Tool
                </Link>

                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center h-10 rounded-xl bg-white text-black text-xs font-bold transition-colors"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center h-10 rounded-xl border border-white/20 text-white text-xs font-bold transition-colors hover:bg-white/10"
                  >
                    Log In
                  </Link>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
