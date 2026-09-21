import Link from "next/link";
import {
  Bot,
  Building2,
  Cpu,
  ListChecks,
  Newspaper,
  PlayCircle,
  Smartphone,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BUSINESS_CATEGORIES } from "@/lib/business-categories";

type DirectoryNavCard = {
  name: string;
  slug: string;
  icon: LucideIcon;
  color: string;
};

const BUSINESS_CATEGORY_ICONS: Record<string, LucideIcon> = {
  "": Sparkles,
  "writing-editing": Wrench,
  "design-creative": Bot,
  "customer-support": ListChecks,
  marketing: Building2,
  "technology-it": Newspaper,
  "workflow-automation": PlayCircle,
  "back-office": Bot,
  operations: Smartphone,
  sales: Cpu,
};

const BUSINESS_CATEGORY_COLORS: Record<string, string> = {
  "": "#6E56CF",
  "writing-editing": "#FFC53D",
  "design-creative": "#A855F7",
  "customer-support": "#FB923C",
  marketing: "#38BDF8",
  "technology-it": "#FF6B4A",
  "workflow-automation": "#F87171",
  "back-office": "#2DD4BF",
  operations: "#F472B6",
  sales: "#A78BFA",
};

const BUSINESS_CATEGORY_LABELS: Record<string, string> = {
  "writing-editing": "writing",
  "design-creative": "design",
  "customer-support": "customer support",
  marketing: "growth",
  "technology-it": "technology",
};

const DIRECTORY_NAV_CARDS: DirectoryNavCard[] = BUSINESS_CATEGORIES.map(
  (category) => ({
    name: BUSINESS_CATEGORY_LABELS[category.slug] ?? category.name,
    slug: category.slug,
    icon: BUSINESS_CATEGORY_ICONS[category.slug],
    color: BUSINESS_CATEGORY_COLORS[category.slug],
  }),
);

export function DirectoryNavStrip({
  defaultCategory,
}: {
  defaultCategory?: string;
}) {
  return (
    <nav
      aria-label="Business categories"
      data-testid="business-directory-nav"
      className="relative z-10 w-full overflow-hidden border-y border-[#232326]/40 px-3 py-2 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1600px] overflow-hidden">
        <div className="flex w-full max-w-full touch-scroll-x items-stretch gap-1.5 overflow-x-auto overscroll-x-contain py-1 scrollbar-none sm:gap-2">
          {DIRECTORY_NAV_CARDS.map((card) => {
            const Icon = card.icon;
            const isActive = card.slug === (defaultCategory ?? "");
            const href = card.slug ? `/business/${card.slug}` : "/business";

            return (
              <Link
                key={card.slug}
                href={href}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : undefined}
                className={`group relative flex min-w-[76px] shrink-0 flex-row items-center justify-center gap-1.5 overflow-hidden rounded-lg border bg-[#0d0d10] px-2.5 py-1.5 text-center transition-all duration-200 sm:min-w-[92px] sm:gap-2 sm:px-3.5 sm:py-2 ${isActive ? "border-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]" : "border-[#232326]/60 hover:border-white/20"}`}
              >
                <span
                  className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors sm:h-6 sm:w-6"
                  style={{
                    background: `linear-gradient(135deg, ${card.color}55 0%, ${card.color}1a 55%, rgba(255,255,255,0.05) 100%)`,
                    borderColor: `${card.color}70`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 14px ${card.color}1f`,
                  }}
                >
                  <Icon
                    size={10}
                    strokeWidth={1.75}
                    aria-hidden="true"
                    style={{ color: card.color }}
                  />
                </span>
                <span className="relative z-10 whitespace-nowrap text-[9px] font-bold tracking-tight text-white sm:text-[10.5px]">
                  {card.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
