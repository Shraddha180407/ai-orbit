"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { buildPageUrl } from "@/lib/utils";
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Top Rated" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
] as const;

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = Object.fromEntries(searchParams.entries());

  return (
    <div className="flex items-center gap-2 select-none">
      <span className="text-xs text-[#71717A]">
        Sort by
      </span>
      <div className="relative inline-flex items-center">
        <select
          id="sort-select"
          value={current.sort ?? "newest"}
          onChange={(e) => {
            const params = new URLSearchParams({ ...current, sort: e.target.value });
            params.delete("page");
            router.push(`${pathname}?${params.toString()}`);
          }}
          className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
      </div>
    </div>
  );
}