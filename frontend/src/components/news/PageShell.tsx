import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

/**
 * Wraps every /news page in the site's actual shared shell — same
 * <Header/>/<Footer/> and the same `bg-[#000000] text-white` base as the
 * homepage (home-client.tsx) and /tools (tools-client.tsx) — instead of the
 * old `.news-scope` wrapper, which pulled in a completely separate
 * self-hosted-Geist/purple-accent theme (see globals.css's `.news-scope`
 * block) that never matched the rest of the site. News now renders with
 * the exact same font (site default `font-sans` -> system-ui, since no
 * next/font Geist is actually wired up anywhere in this app despite the
 * `--font-geist-sans` token name) and the exact same color tokens
 * (`text-foreground`, `text-foreground-muted`, `border-border`, etc. from
 * the top-level `@theme` block) as every other listing page.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white">

      {/* flex-1 wrapper, not <main> — the actual <main> element is rendered by
          the page content itself (see NewsListingClient.tsx, ArticleDetail's
          page wrapper), matching ToolsClient.tsx's own single <main>. */}
      <div className="flex-1 w-full">{children}</div>

    </div>
  );
}
