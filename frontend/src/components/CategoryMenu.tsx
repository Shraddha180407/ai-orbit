"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown, ArrowRight,
  Bot, Code2, Terminal, Workflow, Database, Zap, Blocks,
  Megaphone, TrendingUp, Users, Wallet, Scale, Headset, UserPlus, Mail, CalendarClock, ShoppingCart,
  PenLine, Palette, Image as ImageIcon, Video, Music2, Share2, Languages, FileText,
  Microscope, Stethoscope, HeartPulse, ShieldCheck, Building2, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = { label: string; category: string; icon: typeof Bot };
type Menu = { key: string; emoji: string; label: string; accent: string; items: MenuItem[] };

const MENUS: Menu[] = [
  {
    key: "build", emoji: "🚀", label: "Build",
    accent: "linear-gradient(90deg, var(--color-accent), #60A5FA)",
    items: [
      { label: "AI Agents", category: "Agents", icon: Bot },
      { label: "Coding", category: "Coding", icon: Code2 },
      { label: "Developers", category: "Developers", icon: Terminal },
      { label: "Automation", category: "Automation", icon: Workflow },
      { label: "Data", category: "Data", icon: Database },
      { label: "Productivity", category: "Productivity", icon: Zap },
      { label: "No-Code", category: "No-Code", icon: Blocks },
    ],
  },
  {
    key: "business", emoji: "💼", label: "Business",
    accent: "linear-gradient(90deg, var(--collections-gold), #FB923C)",
    items: [
      { label: "Marketing", category: "Marketing", icon: Megaphone },
      { label: "Sales", category: "Sales", icon: TrendingUp },
      { label: "HR", category: "HR", icon: Users },
      { label: "Finance", category: "Finance", icon: Wallet },
      { label: "Legal", category: "Legal", icon: Scale },
      { label: "Customer Service", category: "Customer Service", icon: Headset },
      { label: "Recruiting", category: "Recruiting", icon: UserPlus },
      { label: "Email", category: "Email", icon: Mail },
      { label: "Scheduling", category: "Scheduling", icon: CalendarClock },
      { label: "E-commerce", category: "E-commerce", icon: ShoppingCart },
    ],
  },
  {
    key: "create", emoji: "🎨", label: "Create",
    accent: "linear-gradient(90deg, #F472B6, var(--color-accent))",
    items: [
      { label: "Writing", category: "Writing", icon: PenLine },
      { label: "Design", category: "Design", icon: Palette },
      { label: "Image", category: "Image", icon: ImageIcon },
      { label: "Video", category: "Video", icon: Video },
      { label: "Audio", category: "Audio", icon: Music2 },
      { label: "Social Media", category: "Social Media", icon: Share2 },
      { label: "Translation", category: "Translation", icon: Languages },
      { label: "Content", category: "Content", icon: FileText },
    ],
  },
  {
    key: "research", emoji: "🔬", label: "Research",
    accent: "linear-gradient(90deg, #34D399, var(--color-accent))",
    items: [
      { label: "Research", category: "Research", icon: Microscope },
      { label: "Healthcare", category: "Healthcare", icon: Stethoscope },
      { label: "Health", category: "Health", icon: HeartPulse },
      { label: "Insurance", category: "Insurance", icon: ShieldCheck },
      { label: "Real Estate", category: "Real Estate", icon: Building2 },
      { label: "Career", category: "Career", icon: Briefcase },
    ],
  },
];

export function CategoryMenu({ categoryCounts }: { categoryCounts: Record<string, number> }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleEnter(key: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenKey(key);
  }
  function handleLeave() {
    closeTimeout.current = setTimeout(() => setOpenKey(null), 150);
  }

  return (
    <nav className="flex flex-wrap items-center gap-1">
      {MENUS.map((menu) => {
        const isOpen = openKey === menu.key;
        return (
          <div
            key={menu.key}
            className="relative"
            onMouseEnter={() => handleEnter(menu.key)}
            onMouseLeave={handleLeave}
          >
            <button
              onClick={() => setOpenKey(isOpen ? null : menu.key)}
              aria-expanded={isOpen}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isOpen ? "text-accent" : "text-foreground-muted hover:text-foreground"
              )}
            >
              <span aria-hidden="true">{menu.emoji}</span>
              {menu.label}
              <ChevronDown size={13} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
            </button>

            {/* right-0 alignment (not left-0) so every dropdown stays
                anchored to its trigger's right edge — since this whole
                nav sits at the far right of the header, right-aligning
                keeps every panel inside the viewport instead of
                overflowing off the corner. */}
            <div
              className={cn(
                "absolute right-0 top-full z-50 w-72 pt-3 transition-all duration-200 ease-out",
                isOpen
                  ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                  : "pointer-events-none -translate-y-1 scale-95 opacity-0"
              )}
              style={{ transformOrigin: "top right" }}
            >
              <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                <div className="h-[3px] w-full" style={{ background: menu.accent }} />

                <div className="p-2">
                  {menu.items.map((item) => {
                    const Icon = item.icon;
                    const count = categoryCounts[item.category] ?? 0;
                    return (
                      <Link
                        key={item.label}
                        href={`/collections?category=${encodeURIComponent(item.category)}`}
                        onClick={() => setOpenKey(null)}
                        className="group/item flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-raised"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-foreground-muted transition-colors group-hover/item:bg-accent/15 group-hover/item:text-accent">
                          <Icon size={15} />
                        </span>
                        <span className="flex-1 text-sm text-foreground-muted transition-colors group-hover/item:text-foreground">
                          {item.label}
                        </span>
                        <span className="font-mono text-xs text-foreground-muted/60">{count}</span>
                        <ArrowRight
                          size={13}
                          className="-ml-1 w-0 shrink-0 text-accent opacity-0 transition-all duration-150 group-hover/item:ml-0 group-hover/item:w-3.5 group-hover/item:opacity-100"
                        />
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href="/collections"
                  onClick={() => setOpenKey(null)}
                  className="flex items-center justify-between border-t border-border px-4 py-3 text-xs font-medium text-foreground-muted transition-colors hover:text-accent"
                >
                  Browse all collections
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
