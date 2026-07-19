"use client";

import { useState, useEffect, useRef } from "react";
import { Search, History, X, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce"; // Ensure a basic debounce hook is present

interface CollectionSearchProps {
  onSearchChange: (value: string) => void;
  suggestions: string[];
}

export function CollectionSearch({ onSearchChange, suggestions }: CollectionSearchProps) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load history safely on client mount
  useEffect(() => {
    const saved = localStorage.getItem("search_history_collections");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Sync debounced term back up to parent client engine
  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  // Handle outside click closures
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const commitSearch = (term: string) => {
    setQuery(term);
    setIsOpen(false);
    if (!term.trim()) return;

    const updated = [term, ...history.filter((h) => h !== term)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem("search_history_collections", JSON.stringify(updated));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = history.length + suggestions.length;
    if (!isOpen || totalItems === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const selected = activeIndex < history.length 
          ? history[activeIndex] 
          : suggestions[activeIndex - history.length];
        commitSearch(selected);
      } else {
        commitSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mb-6 z-40">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search collections by title, curator, or tools..."
          className="w-full h-12 pl-12 pr-10 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); onSearchChange(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggestion Dropdown Panel */}
      {isOpen && (history.length > 0 || suggestions.length > 0) && (
        <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-border bg-background shadow-2xl overflow-hidden p-1.5">
          {/* History Terms */}
          {history.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider flex items-center gap-1">
                <History size={11} /> Recent Searches
              </div>
              {history.map((term, idx) => (
                <button
                  key={`h-${idx}`}
                  onClick={() => commitSearch(term)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-colors ${
                    idx === activeIndex ? "bg-surface text-accent" : "text-foreground hover:bg-surface-raised/40"
                  }`}
                >
                  <span>{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Dynamic Typings Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-foreground-muted uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Suggested Bundles
              </div>
              {suggestions.map((item, idx) => {
                const flatIndex = idx + history.length;
                return (
                  <button
                    key={`s-${idx}`}
                    onClick={() => commitSearch(item)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg text-foreground truncate transition-colors ${
                      flatIndex === activeIndex ? "bg-surface text-accent font-medium" : "hover:bg-surface-raised/40"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}