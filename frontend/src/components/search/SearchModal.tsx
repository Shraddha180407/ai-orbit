"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { useAutocomplete } from "@/hooks/useAutocomplete";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { ALL_ENTITY_TYPES, ENTITY_META } from "@/lib/entityMeta";
import { EntityType } from "@/types/entities";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [activeType, setActiveType] = useState<EntityType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Reset the field each time the modal transitions from closed to open.
  // This is the "adjusting state when a prop changes" pattern React docs
  // recommend in place of a setState-in-effect, so it's safe to do during
  // render rather than in a useEffect.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValue("");
      setActiveType(null);
    }
  }

  const { suggestions, popular, isLoading } = useAutocomplete(value);
  const { recent, addRecent, clearRecent } = useRecentSearches();

  useEffect(() => {
    if (open) {
      if (!wasOpenRef.current) {
        previousActiveElementRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        wasOpenRef.current = true;
      }

      // Focus after the panel opens (a real external-system side effect).
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }

    if (!open && wasOpenRef.current) {
      wasOpenRef.current = false;
      previousActiveElementRef.current?.focus();
      previousActiveElementRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleDialogKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab") return;

    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (!focusable?.length) {
      e.preventDefault();
      panelRef.current?.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  function submit(term: string, type?: EntityType | null) {
    const trimmed = term.trim();
    if (!trimmed && !type) return;
    if (trimmed) addRecent(trimmed);
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    if (type) params.set("types", type);
    onClose();
    router.push(`/search/results${params.toString() ? `?${params.toString()}` : ""}`);
  }

  const filteredSuggestions = activeType
    ? suggestions.filter((s) => s.type === activeType)
    : suggestions;

  const showSuggestions = value.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-center px-3 sm:px-4 pt-4 sm:pt-[14vh]">
      {/* Backdrop */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close search"
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
        onKeyDown={handleDialogKeyDown}
        className="relative z-10 flex h-fit max-h-[88vh] sm:max-h-[76vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-search-border bg-search-bg shadow-2xl shadow-black/20"
      >
        <h2 id="search-dialog-title" className="sr-only">Search AI Orbit</h2>
        {/* Search field row */}
        <div className="flex items-center gap-2.5 border-b border-search-border px-4 py-3.5">
          <Search size={18} className="shrink-0 text-search-text-tertiary" />
          <input
            ref={inputRef}
            aria-label="Search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit(value, activeType);
            }}
            placeholder="Search tools, companies, models, news..."
            className="w-full bg-transparent text-base text-search-text-primary placeholder:text-search-text-tertiary outline-none"
          />
          {value && (
            <button
              onClick={() => {
                setValue("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-0.5 text-search-text-tertiary hover:text-search-text-primary"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="shrink-0 rounded-md border border-search-border px-2 py-1 text-xs text-search-text-secondary hover:border-search-border-hover hover:text-search-text-primary"
          >
            Cancel
          </button>
        </div>

        {/* Quick entity-type filter chips — mirrors TAAFT's category pill row */}
        <div className="flex flex-wrap gap-1.5 border-b border-search-border px-4 py-2.5">
          <Chip active={activeType === null} onClick={() => setActiveType(null)}>
            All
          </Chip>
          {ALL_ENTITY_TYPES.map((type) => (
            <Chip
              key={type}
              active={activeType === type}
              onClick={() => setActiveType(activeType === type ? null : type)}
            >
              {ENTITY_META[type].plural}
            </Chip>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          {showSuggestions ? (
            <SuggestionResults
              isLoading={isLoading}
              suggestions={filteredSuggestions}
              query={value}
              onSelectTerm={(term) => submit(term, activeType)}
              onSelectType={setActiveType}
            />
          ) : (
            <>
              {recent.length > 0 && (
                <Section
                  title="Recently viewed"
                  icon={<Clock size={13} />}
                  action={
                    <button
                      onClick={clearRecent}
                      className="text-xs text-search-text-tertiary hover:text-search-text-primary"
                    >
                      Clear
                    </button>
                  }
                >
                  {recent.map((term) => (
                    <TermRow key={term} term={term} onSelectTerm={(t) => submit(t, activeType)} />
                  ))}
                </Section>
              )}

              <Section title="Popular searches" icon={<TrendingUp size={13} />}>
                {popular.map((term) => (
                  <TermRow key={term} term={term} onSelectTerm={(t) => submit(t, activeType)} />
                ))}
              </Section>
            </>
          )}
        </div>

        {/* Footer hint row, like TAAFT's "⌘K to search" affordance */}
        <div className="flex items-center justify-between border-t border-search-border bg-search-surface-hover/40 px-4 py-2 text-xs text-search-text-tertiary">
          <span>
            <kbd className="rounded border border-search-border bg-search-surface px-1.5 py-0.5">↵</kbd>{" "}
            to search
          </span>
          <span>
            <kbd className="rounded border border-search-border bg-search-surface px-1.5 py-0.5">esc</kbd>{" "}
            to close
          </span>
        </div>
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active
          ? "border-search-accent bg-search-accent-soft text-search-text-primary"
          : "border-search-border text-search-text-secondary hover:border-search-border-hover hover:text-search-text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function Section({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-search-border p-2 last:border-b-0">
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-search-text-tertiary">
          {icon}
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function TermRow({
  term,
  onSelectTerm,
}: {
  term: string;
  onSelectTerm: (term: string) => void;
}) {
  return (
    <Link
      href={`/search/results?q=${encodeURIComponent(term)}`}
      onClick={() => onSelectTerm(term)}
      className="flex items-center rounded-md px-2.5 py-2 text-sm text-search-text-primary hover:bg-search-surface-hover"
    >
      {term}
    </Link>
  );
}

/** Max rows shown per entity-type group before collapsing behind "View N more". */
const MAX_ROWS_PER_GROUP = 4;

function SuggestionResults({
  isLoading,
  suggestions,
  query,
  onSelectTerm,
  onSelectType,
}: {
  isLoading: boolean;
  suggestions: { id: string; type: EntityType; title: string; category: string }[];
  query: string;
  onSelectTerm: (term: string) => void;
  onSelectType: (type: EntityType) => void;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-9 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-search-text-secondary">
        No matches for &ldquo;{query}&rdquo;.{" "}
        <button
          onClick={() => onSelectTerm(query)}
          className="text-search-accent hover:text-search-accent-hover"
        >
          Search anyway
        </button>
      </div>
    );
  }

  // Group suggestions by entity type, preserving the order types first
  // appear in the (already relevance-sorted) suggestions list — this keeps
  // the most relevant category on top instead of a fixed alphabetical order.
  const groups = new Map<EntityType, typeof suggestions>();
  for (const s of suggestions) {
    const bucket = groups.get(s.type);
    if (bucket) {
      bucket.push(s);
    } else {
      groups.set(s.type, [s]);
    }
  }

  return (
    <div className="p-2">
      {Array.from(groups.entries()).map(([type, items]) => (
        <SuggestionGroup
          key={type}
          type={type}
          items={items}
          onSelectTerm={onSelectTerm}
          onSelectType={onSelectType}
        />
      ))}
      <button
        onClick={() => onSelectTerm(query)}
        className="mt-1 flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm text-search-accent hover:bg-search-surface-hover"
      >
        See all results for &ldquo;{query}&rdquo;
      </button>
    </div>
  );
}

function SuggestionGroup({
  type,
  items,
  onSelectTerm,
  onSelectType,
}: {
  type: EntityType;
  items: { id: string; type: EntityType; title: string; category: string }[];
  onSelectTerm: (term: string) => void;
  onSelectType: (type: EntityType) => void;
}) {
  const meta = ENTITY_META[type];
  const GroupIcon = meta.icon;
  const visible = items.slice(0, MAX_ROWS_PER_GROUP);
  const remaining = items.length - visible.length;

  return (
    <div className="mb-1 last:mb-0">
      {/* Section header — mirrors the "Tasks (10)" grouped-category header */}
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-search-text-tertiary">
        <GroupIcon size={13} />
        {meta.plural}
        <span className="text-search-text-tertiary/70">({items.length})</span>
      </div>

      {visible.map((s) => {
        const Icon = ENTITY_META[s.type].icon;
        return (
          <Link
            key={s.id}
            href={`/search/results?q=${encodeURIComponent(s.title)}`}
            onClick={() => onSelectTerm(s.title)}
            className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm hover:bg-search-surface-hover"
          >
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${ENTITY_META[s.type].tint}`}>
              <Icon size={14} />
            </span>
            <span className="flex-1 truncate text-search-text-primary">{s.title}</span>
            <span className="shrink-0 text-xs text-search-text-tertiary">{s.category}</span>
          </Link>
        );
      })}

      {remaining > 0 && (
        <button
          onClick={() => onSelectType(type)}
          className="flex w-full items-center justify-center rounded-md px-2.5 py-1.5 text-xs text-search-text-tertiary hover:bg-search-surface-hover hover:text-search-text-primary"
        >
          View {remaining} more
        </button>
      )}
    </div>
  );
}
