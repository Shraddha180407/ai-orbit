"use client";

import type { CSSProperties, ReactNode } from "react";

interface TopicChipProps {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  maxWidth?: number;
  compact?: boolean;
  fluid?: boolean;
  large?: boolean;
  /** Publisher/topic brand-color accent — renders as a small leading dot + tints the hover/active state. Falls back to the neutral tas-topic palette when omitted. */
  accent?: string;
}

/**
 * All color (text/background/border, resting AND hover/active) lives in
 * globals.css's .tas-topic rules now, keyed off the `data-active` attribute
 * and the `--chip-accent` custom property set here — NOT inline style.
 * Inline `style.color`/`background`/`border` always wins over a CSS
 * `:hover` rule regardless of specificity, which is exactly why hovering
 * a tag previously did nothing: every color value was being set inline on
 * every render, permanently masking the :hover rule already defined in
 * globals.css. Only structural (non-color) properties stay inline here.
 */
export function TopicChip({ children, onClick, active, maxWidth, compact, fluid, large, accent }: TopicChipProps) {
  const style: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: accent ? 6 : 0,
    height: compact ? 22 : large ? 32 : 26,
    padding: compact ? "0 8px" : large ? "0 14px" : "0 11px",
    font: `var(--fw-medium) ${compact ? "11px" : large ? "15px" : "var(--fs-xs)"}/1 var(--font-sans)`,
    borderRadius: compact ? "var(--news-radius-sm)" : "var(--radius-pill)",
    whiteSpace: "nowrap",
    flex: fluid ? "0 1 auto" : "none",
    minWidth: fluid ? 44 : undefined,
    maxWidth: maxWidth ?? "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    cursor: onClick ? "pointer" : "default",
    ...(accent ? ({ "--chip-accent": accent } as CSSProperties) : {}),
  };
  return (
    <button
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
      className="tas-topic"
      data-active={active ? "" : undefined}
      data-compact={compact ? "" : undefined}
      style={style}
    >
      {accent && <span className="tas-topic-dot" aria-hidden="true" />}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{children}</span>
    </button>
  );
}
