'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/shadcn-button';
import { cn } from '@/lib/utils';
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard';
import Compass from 'lucide-react/dist/esm/icons/compass';
import Bookmark from 'lucide-react/dist/esm/icons/bookmark';
import Clock from 'lucide-react/dist/esm/icons/clock';
import Settings from 'lucide-react/dist/esm/icons/settings';
import Search from 'lucide-react/dist/esm/icons/search';
import Menu from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import LogOut from 'lucide-react/dist/esm/icons/log-out';
import UserIcon from 'lucide-react/dist/esm/icons/user';
import PenTool from 'lucide-react/dist/esm/icons/pen-tool';
import Hash from 'lucide-react/dist/esm/icons/hash';
import Plus from 'lucide-react/dist/esm/icons/plus';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Circle from 'lucide-react/dist/esm/icons/circle';
import Clock4 from 'lucide-react/dist/esm/icons/clock-4';
import { useUser } from '@/hooks/use-user';

interface ShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  actions?: ReactNode;
}

const navWorkspace = [
  { href: '/', label: 'Main Website', icon: Compass },
  { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const navYourTeams = [
  { href: '/dashboard/saved-tools', label: 'Saved Tools', icon: PenTool },
  { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/dashboard/history', label: 'History', icon: Clock },
];

export function Shell({ children, title, description, actions }: ShellProps) {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#0d0d0d] selection:bg-[#5e6ad2]/30">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Fixed Left Sidebar - Linear Style */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/[0.06] bg-[#111111] transition-transform duration-200 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-12 shrink-0 items-center justify-between px-4 mt-2">
          <Link href="/" className="flex items-center group cursor-pointer rounded-md hover:bg-white/[0.04] px-1.5 py-1 -ml-1.5 transition-colors">
            <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-[#5e6ad2] font-bold text-white text-[10px]">
              S
            </div>
            <span className="ml-2.5 text-[13px] font-semibold tracking-tight text-[#e8e8e8]">The AI Signal</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 lg:hidden text-[#8A8F98] hover:text-white" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto pt-2">
          {/* Workspace Section */}
          <div className="mb-2">
            <div className="space-y-[1px] px-2">
              {navWorkspace.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-[5px] text-[13px] transition-colors duration-150 ease-out',
                      isActive
                        ? 'bg-white/[0.06] text-white font-medium'
                        : 'text-[#a1a1aa] hover:bg-white/[0.04] hover:text-[#e8e8e8] font-medium'
                    )}
                  >
                    <item.icon className={cn("h-[14px] w-[14px]", isActive ? "text-white" : "text-[#8A8F98] group-hover:text-[#a1a1aa]")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Your Teams Section */}
          <div className="mb-6">
            <div className="space-y-[1px] px-2">
              {navYourTeams.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-[5px] text-[13px] transition-colors duration-150 ease-out',
                      isActive
                        ? 'bg-white/[0.06] text-white font-medium'
                        : 'text-[#a1a1aa] hover:bg-white/[0.04] hover:text-[#e8e8e8] font-medium'
                    )}
                  >
                    <item.icon className={cn("h-[14px] w-[14px]", isActive ? "text-white" : "text-[#8A8F98] group-hover:text-[#a1a1aa]")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {user ? (
          <div className="p-3 shrink-0">
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer mb-1 group">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-white overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(user.email || user.name || 'user')}`} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-[13px] font-medium text-[#e8e8e8] group-hover:text-white">{user.name || 'User'}</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start h-7 px-2 text-[12px] text-[#8A8F98] hover:text-white hover:bg-white/[0.04] rounded-md transition-colors"
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
            >
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Log out
            </Button>
          </div>
        ) : (
          <div className="p-3 shrink-0 lg:hidden space-y-2">
             <Link href="/auth/signin" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start h-8 rounded-md px-2 text-[13px] font-medium text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button variant="ghost" size="sm" className="w-full justify-start h-8 rounded-md px-2 text-[13px] font-medium text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Button>
              </Link>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col lg:pl-60">
        {/* Top Header - Blended */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between bg-[#0d0d0d] px-6">
          <div className="flex items-center gap-4 lg:hidden">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-md text-[#8A8F98]" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
          
          <div className="flex flex-1 items-center justify-start lg:justify-end gap-4">
            {!user && (
              <div className="flex items-center gap-2">
                <Link href="/auth/signin" className="text-[13px] font-medium text-[#A1A1AA] transition-colors hover:text-white px-2 py-1 rounded-md hover:bg-white/[0.04]">
                  Login
                </Link>
                <Link href="/auth/signup" className="text-[13px] font-medium text-[#A1A1AA] transition-colors hover:text-white px-2 py-1 rounded-md hover:bg-white/[0.04]">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 p-6 sm:p-8 max-w-[1100px] mx-auto w-full animate-fade-in-up">
          {(title || description || actions) && (
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                {title && <h1 className="text-[20px] font-semibold text-white tracking-tight leading-none">{title}</h1>}
                {description && <p className="mt-2 text-[13px] text-[#a1a1aa]">{description}</p>}
              </div>
              {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

