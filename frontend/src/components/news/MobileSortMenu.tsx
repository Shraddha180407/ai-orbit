"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import type { SortKey, SortState } from "@/types/news";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Published" },
  { key: "title", label: "Title" },
  { key: "source", label: "Source" },
  { key: "topics", label: "Topics" },
];

interface MobileSortMenuProps {
  sort: SortState;
  onSort: (key: SortKey) => void;
}

/**
 * Mobile/tablet stand-in for the desktop table's per-column SortHeader
 * buttons (Title/Source/Topics/Published), which live in a header row that
 * doesn't render below `lg:` (see NewsTable.tsx). Calls the exact same
 * onSort(key) — NewsListingClient's nextSortState toggling direction on a
 * repeat tap is unchanged either way.
 */
export function MobileSortMenu({ sort, onSort }: MobileSortMenuProps) {
  const [open, setOpen] = useState(false);
  const active = OPTIONS.find((o) => o.key === sort.key);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="tas-hbtn"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          height: 36,
          padding: "0 12px",
          borderRadius: "var(--news-radius-sm)",
          font: "var(--fw-medium) var(--fs-sm)/1 var(--font-sans)",
        }}
      >
        <Icon path={sort.dir === "asc" ? ICONS.arrowUp : ICONS.arrowDown} size={13} />
        {active?.label ?? "Sort"}
      </button>
      {open &&
        createPortal(
          <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "var(--scrim)" }} />
            <div
              role="dialog"
              aria-label="Sort news"
              style={{
                position: "relative",
                zIndex: 1,
                background: "var(--bg-overlay)",
                borderTop: "1px solid var(--border-strong)",
                borderTopLeftRadius: "var(--radius-xl)",
                borderTopRightRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-modal)",
                padding: "10px 14px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ font: "var(--fw-semibold) var(--fs-h4)/1 var(--font-sans)", color: "var(--text-primary)" }}>Sort by</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close sort menu"
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "var(--news-radius-sm)", color: "var(--text-secondary)" }}
                >
                  <Icon path={ICONS.x} size={17} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {OPTIONS.map((o) => {
                  const isActive = sort.key === o.key;
                  return (
                    <button
                      key={o.key}
                      onClick={() => {
                        onSort(o.key);
                        setOpen(false);
                      }}
                      className="tas-opt"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 10px",
                        borderRadius: "var(--news-radius-sm)",
                        textAlign: "left",
                        color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                        font: `var(--fw-medium) var(--fs-body)/1 var(--font-sans)`,
                      }}
                    >
                      {o.label}
                      {isActive && <Icon path={sort.dir === "asc" ? ICONS.arrowUp : ICONS.arrowDown} size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
