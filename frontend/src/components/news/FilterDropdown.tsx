"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { FilterOptionList } from "./FilterOptionList";
import type { FilterOption } from "@/types/news";

interface FilterDropdownProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
  /** The trigger button/cell this dropdown is anchored to — used to compute viewport position. */
  anchorRef: RefObject<HTMLElement | null>;
  align?: "left" | "right";
}

const PANEL_WIDTH = 250;
const VIEWPORT_MARGIN = 8;

/**
 * Renders via a portal directly into document.body, positioned with
 * getBoundingClientRect() + `position: fixed`, rather than `position:
 * absolute` inside the table's DOM tree. The table's own horizontal-scroll
 * wrapper (.tas-scroll-x, see NewsTable.tsx) sets `overflow-x: auto`, which
 * per the CSS overflow spec forces `overflow-y` to `auto` too when it's left
 * at its default — so that wrapper clips ANY descendant's vertical overflow,
 * including this dropdown, no matter how high its z-index is (overflow
 * clipping on an ancestor always wins over z-index). Escaping the DOM tree
 * entirely via a portal is the only way to guarantee the panel isn't clipped
 * by that ancestor (or the sticky header's own stacking context).
 */
export function FilterDropdown({ title, options, selected, onToggle, onClear, onClose, anchorRef, align = "right" }: FilterDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ top: number; left: number; maxHeight: number; visibility: "hidden" | "visible" }>({
    top: 0,
    left: 0,
    maxHeight: 340,
    visibility: "hidden",
  });

  // Two-pass positioning: mount off-screen (hidden) first so the panel's
  // real height (which depends on option count) can be measured, then clamp
  // horizontally so it never renders off-screen. Always opens downward from
  // the anchor — an earlier version flipped the panel above the anchor when
  // there wasn't room below, but on a short viewport (anchor near the
  // bottom of visible content, plenty of page below it once scrolled) that
  // made the panel jump up and cover the hero/search bar instead, which
  // read as broken rather than intentional. A fixed minimum height with its
  // own internal scroll (see the options list below) is used instead so the
  // panel always stays usable even when space below is tight.
  useLayoutEffect(() => {
    function updatePosition() {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      const panelHeight = panel?.getBoundingClientRect().height ?? 340;

      const spaceBelow = window.innerHeight - anchorRect.bottom - VIEWPORT_MARGIN;
      const top = anchorRect.bottom + 8;
      const maxHeight = Math.min(panelHeight, Math.max(200, spaceBelow));

      let left = align === "right" ? anchorRect.right - PANEL_WIDTH : anchorRect.left;
      left = Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - PANEL_WIDTH - VIEWPORT_MARGIN));

      setStyle({ top, left, maxHeight, visibility: "visible" });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    // capture:true — the table's internal scroll containers (.tas-scroll-x,
    // the sticky header) don't bubble scroll events to window, but capture
    // phase still sees them.
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorRef, align]);

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200 }} />
      <div
        ref={panelRef}
        role="dialog"
        style={{
          position: "fixed",
          top: style.top,
          left: style.left,
          zIndex: 201,
          width: PANEL_WIDTH,
          maxHeight: style.maxHeight,
          visibility: style.visibility,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--bg-overlay)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--news-radius-md)",
          boxShadow: "var(--shadow-popover)",
          padding: 8,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <FilterOptionList title={title} options={options} selected={selected} onToggle={onToggle} onClear={onClear} />
      </div>
    </>,
    document.body
  );
}
