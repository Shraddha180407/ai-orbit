"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import { FilterOptionList } from "./FilterOptionList";
import type { NewsTableFilters } from "./NewsTable";

interface MobileFilterSheetProps {
  filters: NewsTableFilters;
  onClose: () => void;
}

/**
 * Mobile/tablet stand-in for the desktop table's two per-column
 * FilterDropdown popovers (Source, Topics) — see NewsTableFilters. Those
 * are anchored to header cells that don't exist below `lg:`, so this
 * collapses both into one bottom-sheet-style panel with a tab switcher,
 * reusing the exact same FilterOptionList content/behavior as the desktop
 * dropdowns so selecting/clearing options here stays perfectly in sync
 * with NewsListingClient's filter state either way.
 */
export function MobileFilterSheet({ filters, onClose }: MobileFilterSheetProps) {
  const [tab, setTab] = useState<"source" | "topics">("source");
  const totalActive = filters.selectedSources.length + filters.selectedTopics.length;

  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--scrim)" }} />
      <div
        role="dialog"
        aria-label="Filter news"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          maxHeight: "78vh",
          background: "var(--bg-overlay)",
          borderTop: "1px solid var(--border-strong)",
          borderTopLeftRadius: "var(--radius-xl)",
          borderTopRightRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-modal)",
          padding: "10px 14px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ font: "var(--fw-semibold) var(--fs-h4)/1 var(--font-sans)", color: "var(--text-primary)" }}>Filter</span>
          <button
            onClick={onClose}
            aria-label="Close filters"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--news-radius-sm)",
              color: "var(--text-secondary)",
            }}
          >
            <Icon path={ICONS.x} size={17} />
          </button>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 12, flex: "none" }}>
          {(["source", "topics"] as const).map((t) => {
            const active = tab === t;
            const count = t === "source" ? filters.selectedSources.length : filters.selectedTopics.length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: "var(--news-radius-sm)",
                  font: "var(--fw-medium) var(--fs-sm)/1 var(--font-sans)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  background: active ? "var(--purple)" : "var(--bg-surface-2)",
                  border: `1px solid ${active ? "transparent" : "var(--border-default)"}`,
                }}
              >
                {t === "source" ? "Source" : "Topics"}
                {count > 0 ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>

        <div style={{ flex: "1 1 auto", minHeight: 0, overflow: "hidden" }}>
          {tab === "source" ? (
            <FilterOptionList
              title="Sources"
              options={filters.sourceOptions}
              selected={filters.selectedSources}
              onToggle={filters.onToggleSource}
              onClear={filters.onClearSources}
              autoFocus={false}
            />
          ) : (
            <FilterOptionList
              title="Topics"
              options={filters.topicOptions}
              selected={filters.selectedTopics}
              onToggle={filters.onToggleTopic}
              onClear={filters.onClearTopics}
              autoFocus={false}
            />
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 12,
            height: 44,
            borderRadius: "var(--news-radius-md)",
            font: "var(--fw-semibold) var(--fs-body)/1 var(--font-sans)",
            color: "#fff",
            background: "var(--purple)",
            flex: "none",
          }}
        >
          Show results{totalActive > 0 ? ` (${totalActive})` : ""}
        </button>
      </div>
    </div>,
    document.body
  );
}
