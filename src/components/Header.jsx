import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { 
  Bot, 
  Search, 
  Plus, 
  Menu, 
  X, 
  Bookmark, 
  ExternalLink, 
  Layers, 
  Trophy, 
  Briefcase, 
  BookOpen, 
  Cpu, 
  Sparkles,
  Command
} from 'lucide-react';

export default function Header({ onOpenSearch, bookmarksCount = 0, onOpenBookmarks, onOpenSubmit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const location = useLocation();

  // Core primary navigation items (focused discovery & product modules)
  const primaryNavLinks = [
    { name: 'Leaderboard', path: '/', badge: 'Live', icon: Trophy },
    { name: 'AI Robots', path: '/robots', icon: Bot },
    { name: 'Business AI', path: '/business', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: Layers },
  ];

  // Secondary modules & links tucked under "More"
  const moreNavLinks = [
    { name: 'Companies', path: '/companies', icon: Cpu, desc: 'Ecosystem orgs & labs' },
    { name: 'Learn', path: '/learn', icon: BookOpen, desc: 'Articles & tutorials' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/leaderboard');
    return location.pathname.startsWith(path);
  };

  const isMoreActive = moreNavLinks.some((item) => isActive(item.path));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1C1C1F] bg-black/80 backdrop-blur-md py-2 sm:py-3 transition-colors">
      <div className="mx-auto max-w-[1440px] px-3.5 sm:px-8 flex items-center justify-between relative gap-2">
        {/* Left: Mobile menu toggle + Logo */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <Link to="/" className="flex items-center group shrink-0 min-w-0">
            <BrandLogo />
          </Link>
        </div>

        {/* Center: Desktop Navigation (4 Core + More dropdown) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {primaryNavLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                  active
                    ? 'text-white bg-[#1a1a20] border border-[#2e2e38] shadow-sm shadow-[#6E56CF]/10'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} className={active ? 'text-[#A78BFA]' : 'text-[#71717A]'} />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#6E56CF] text-white">
                    {link.badge}
                  </span>
                )}
                {active && (
                  <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#6E56CF] rounded-full"></span>
                )}
              </Link>
            );
          })}

          {/* More ▾ Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className={`relative px-3 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                isMoreActive || moreMenuOpen
                  ? 'text-white bg-[#1a1a20] border border-[#2e2e38]'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>More</span>
              <span className={`text-[10px] text-[#71717A] transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-white' : ''}`}>▾</span>
              {isMoreActive && (
                <span className="absolute -bottom-[13px] left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#6E56CF] rounded-full"></span>
              )}
            </button>

            {/* Dropdown Menu Panel */}
            {moreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreMenuOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2.5 z-50 w-56 rounded-2xl border border-[#27272A] bg-[#121215]/95 backdrop-blur-xl shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                  {moreNavLinks.map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                          active
                            ? 'bg-[#1e1e26] text-white font-semibold'
                            : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181C]'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#18181f] border border-[#27272e] flex items-center justify-center shrink-0">
                          <Icon size={13} className={active ? 'text-[#6E56CF]' : 'text-[#71717A]'} />
                        </div>
                        <div>
                          <span className="block text-white font-medium">{item.name}</span>
                          <span className="block text-[10.5px] text-[#71717A]">{item.desc}</span>
                        </div>
                      </Link>
                    );
                  })}

                  <div className="h-[1px] bg-[#1F1F24] my-1" />

                  <button
                    onClick={() => {
                      setMoreMenuOpen(false);
                      if (onOpenBookmarks) onOpenBookmarks();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#A1A1AA] hover:text-white hover:bg-[#18181C] transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#18181f] border border-[#27272e] flex items-center justify-center shrink-0">
                        <Bookmark size={13} className="text-[#71717A]" />
                      </div>
                      <span className="text-white font-medium">Saved Items</span>
                    </div>
                    {bookmarksCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#6E56CF] text-white">
                        {bookmarksCount}
                      </span>
                    )}
                  </button>

                  <Link
                    to="/"
                    onClick={() => setMoreMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#A1A1AA] hover:text-white hover:bg-[#18181C] transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#18181f] border border-[#27272e] flex items-center justify-center shrink-0">
                      <Sparkles size={13} className="text-[#71717A]" />
                    </div>
                    <div>
                      <span className="block text-white font-medium">About AI Orbit</span>
                      <span className="block text-[10.5px] text-[#71717A]">Architecture & benchmarks</span>
                    </div>
                  </Link>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right: Search, Bookmarks, Submit CTA */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search Button with Cmd+K hint */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 h-[32px] px-3 rounded-xl border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white hover:border-[#3a3a40] transition-all text-xs cursor-pointer group"
            title="Quick search (Cmd + K)"
          >
            <Search size={13} className="text-[#71717A] group-hover:text-white transition-colors" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-[#2e2e33] rounded text-[#71717A]">
              <Command size={10} /> K
            </kbd>
          </button>

          {/* Bookmarks Toggle */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center justify-center h-[32px] w-[32px] rounded-xl border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]/50 transition-all cursor-pointer"
            title="Saved Items"
          >
            <Bookmark size={14} className={bookmarksCount > 0 ? "text-[#A78BFA] fill-[#A78BFA]/20" : ""} />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6E56CF] text-[10px] font-bold text-white">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Calm, streamlined Submit CTA */}
          <button
            onClick={onOpenSubmit}
            className="inline-flex h-[32px] items-center gap-1.5 rounded-xl px-3 text-[12px] font-medium transition-all duration-200 border border-[#27272e] bg-[#16161a] hover:bg-[#202026] hover:border-white/20 text-[#E4E4E7] hover:text-white cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Plus size={13} className="text-[#A78BFA]" />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-5 border-t border-[#1C1C1F] bg-black/95 mt-2 space-y-3">
          <div className="mb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#131316] border border-[#232326] text-xs text-[#A1A1AA]"
            >
              <span className="flex items-center gap-2">
                <Search size={14} /> Search models, robots & tools...
              </span>
              <kbd className="px-1.5 py-0.5 bg-black/40 text-[10px] rounded border border-[#232326]">⌘K</kbd>
            </button>
          </div>

          {/* Primary Mobile Links */}
          <div className="space-y-1">
            <span className="text-[10.5px] uppercase font-semibold text-[#71717A] tracking-wider px-2 block">
              Core Modules
            </span>
            {primaryNavLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    active
                      ? 'bg-[#18181c] text-white border border-[#2e2e38]'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={active ? 'text-[#6E56CF]' : 'text-[#71717A]'} />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-[#6E56CF] text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Secondary / Ecosystem Links */}
          <div className="pt-2 border-t border-[#1C1C1F] space-y-1">
            <span className="text-[10.5px] uppercase font-semibold text-[#71717A] tracking-wider px-2 block">
              Ecosystem & Resources
            </span>
            {moreNavLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${
                    active
                      ? 'bg-[#18181c] text-white border border-[#2e2e38]'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={active ? 'text-[#6E56CF]' : 'text-[#71717A]'} />
                    <span>{link.name}</span>
                  </div>
                  <span className="text-[10.5px] text-[#71717A]">{link.desc}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
