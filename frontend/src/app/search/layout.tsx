import { SearchModalProvider } from "@/context/SearchModalContext";
import { SearchModalMount } from "@/components/search/SearchModalMount";
import { SearchTopBar } from "@/components/search/SearchTopBar";

/**
 * Layout for the Global Search module (/search, /search/[section],
 * /search/results). Self-contained addition: keeps the module's own
 * TAAFT-style dark theme scoped to `.search-scope` (see globals.css)
 * instead of touching the site's shared design tokens, and mounts the
 * module's own announcement banner + navbar (SearchTopBar) and its
 * Ctrl+K search modal — same "scoped module" pattern the news module
 * uses via .news-scope. Uses a system-font stack (no next/font/google
 * fetch) so the build never depends on reaching Google Fonts at build
 * time.
 */
export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="search-scope"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <SearchModalProvider>
        <SearchTopBar />
        {children}
        <SearchModalMount />
      </SearchModalProvider>
    </div>
  );
}
