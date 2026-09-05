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
  const location = useLocation();

  const navLinks = [
    { name: 'Leaderboard', path: '/', badge: 'Live', icon: Trophy },
    { name: 'AI Robots', path: '/robots', icon: Bot },
    { name: 'Business AI', path: '/business', icon: Briefcase },
    { name: 'Tasks', path: '/tasks', icon: Layers },
    { name: 'Companies', path: '/companies', icon: Cpu },
    { name: 'Learn', path: '/learn', icon: BookOpen },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname.startsWith('/leaderboard');
    return location.pathname.startsWith(path);
  };

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

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
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
        </nav>

        {/* Right: Search, Bookmarks, Submit CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Button with Cmd+K hint */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 h-[32px] px-3 rounded-lg border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white hover:border-[#3a3a40] transition-all text-xs cursor-pointer group"
            title="Quick search (Cmd + K)"
          >
            <Search size={13} className="text-[#71717A] group-hover:text-white transition-colors" />
            <span className="hidden md:inline">Search directory...</span>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-[#2e2e33] rounded text-[#71717A]">
              <Command size={10} /> K
            </kbd>
          </button>

          {/* Bookmarks Toggle */}
          <button
            onClick={onOpenBookmarks}
            className="relative flex items-center justify-center h-[32px] w-[32px] rounded-lg border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white hover:border-[#6E56CF]/50 transition-all cursor-pointer"
            title="Saved Robots"
          >
            <Bookmark size={14} className={bookmarksCount > 0 ? "text-[#A78BFA] fill-[#A78BFA]/20" : ""} />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6E56CF] text-[10px] font-bold text-white">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Submit Robot CTA */}
          <button
            onClick={onOpenSubmit}
            className="inline-flex h-[32px] sm:h-[34px] items-center gap-1.5 rounded-full px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold transition-all duration-200 hover:brightness-110 active:scale-95 bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-md shadow-[#6E56CF]/20 cursor-pointer whitespace-nowrap"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">Submit Robot</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-4 border-t border-[#1C1C1F] bg-black/95 mt-2 space-y-2">
          <div className="mb-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSearch) onOpenSearch();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#131316] border border-[#232326] text-xs text-[#A1A1AA]"
            >
              <span className="flex items-center gap-2">
                <Search size={14} /> Search robots, models & companies...
              </span>
              <kbd className="px-1.5 py-0.5 bg-black/40 text-[10px] rounded border border-[#232326]">⌘K</kbd>
            </button>
          </div>
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-[#18181c] text-white border border-[#2e2e38]'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={active ? 'text-[#6E56CF]' : 'text-[#71717A]'} />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#6E56CF] text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
