"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import type { FilterOption } from "@/types/news";

interface FilterOptionListProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
}

/**
 * The search input + checkbox option list + "N selected / Clear" footer —
 * extracted from FilterDropdown.tsx so the exact same filter content can be
 * reused by both the desktop popover (FilterDropdown, positioned via a
 * portal) and the mobile/tablet "Filter" bottom sheet (MobileFilterSheet),
 * which needs the identical list but inside a different container with no
 * anchor-based positioning at all.
 */
export function FilterOptionList({ title, options, selected, onToggle, onClear, autoFocus = true }: FilterOptionListProps) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- focus once on mount only
  }, []);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <div style={{ position: "relative", marginBottom: 8, flex: "none" }}>
        <span
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-quaternary)",
            display: "inline-flex",
          }}
        >
          <Icon path={ICONS.search} size={14} />
        </span>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={"Search " + title.toLowerCase() + "…"}
          style={{
            width: "100%",
            height: 34,
            padding: "0 10px 0 32px",
            border: "1px solid var(--border-default)",
            background: "var(--bg-inset)",
            borderRadius: "var(--news-radius-sm)",
            outline: "none",
            font: "var(--fw-regular) var(--fs-sm)/1 var(--font-sans)",
            color: "var(--text-primary)",
          }}
        />
      </div>
      <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, flex: "1 1 auto" }}>
        {filtered.length === 0 && (
          <div
            style={{
              padding: "14px 10px",
              font: "var(--fw-regular) var(--fs-sm)/1 var(--font-sans)",
              color: "var(--text-quaternary)",
              textAlign: "center",
            }}
          >
            No matches
          </div>
        )}
        {filtered.map((o) => {
          const on = selected.includes(o.value);
          return (
            <button
              key={o.value}
              onClick={() => onToggle(o.value)}
              className="tas-opt"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "8px 10px",
                borderRadius: "var(--news-radius-sm)",
                cursor: "pointer",
                textAlign: "left",
                transition: "var(--transition-colors)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  flex: "none",
                  borderRadius: "var(--radius-xs)",
                  border: `1px solid ${on ? "var(--text-primary)" : "var(--border-strong)"}`,
                  background: on ? "var(--text-primary)" : "transparent",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--bg-base)",
                }}
              >
                {on && <Icon path={ICONS.check} size={11} stroke={2.4} />}
              </span>
              <span
                style={{
                  flex: 1,
                  font: "var(--fw-medium) var(--fs-sm)/1.2 var(--font-sans)",
                  color: on ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {o.label}
              </span>
              <span style={{ font: "var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)", color: "var(--text-quaternary)" }}>
                {o.count}
              </span>
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid var(--border-subtle)",
          flex: "none",
        }}
      >
        <span style={{ font: "var(--fw-regular) var(--fs-2xs)/1 var(--font-mono)", color: "var(--text-quaternary)" }}>
          {selected.length} selected
        </span>
        <button
          onClick={onClear}
          disabled={!selected.length}
          style={{
            font: "var(--fw-medium) var(--fs-xs)/1 var(--font-sans)",
            color: selected.length ? "var(--text-secondary)" : "var(--text-quaternary)",
            cursor: selected.length ? "pointer" : "default",
            padding: "4px 6px",
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
