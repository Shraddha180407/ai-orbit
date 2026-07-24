"use client";

import Search from "lucide-react/dist/esm/icons/search";

interface NewsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Same markup/classes as SearchBar.tsx (the homepage/tools search input) —
 * `rounded-md border border-border bg-surface py-2.5 pl-10 pr-4 text-sm`,
 * same icon, same placeholder color. The only difference is functional:
 * SearchBar.tsx submits a GET form to /tools, while news filtering is all
 * client-side in NewsListingClient, so this is a controlled input instead
 * of an uncontrolled `defaultValue` + form submit.
 */
export function NewsSearchBar({ value, onChange, placeholder = "Search AI news..." }: NewsSearchBarProps) {
  return (
    <div className="relative w-full">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" aria-hidden="true" />
      <label htmlFor="news-search" className="sr-only">
        Search AI news
      </label>
      <input
        id="news-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-foreground-faint focus:border-accent focus:outline-none"
      />
    </div>
  );
}
