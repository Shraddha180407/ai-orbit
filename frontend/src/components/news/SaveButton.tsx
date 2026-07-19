"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";

interface SaveButtonProps {
  id: string;
  /** Fixed width filling its container (no content-driven growth) — used in the mobile equal-width grid. */
  fluid?: boolean;
  /**
   * Authoritative initial state from the backend (article.bookmarked, from
   * GET /api/news[/:slug]?clientId=... — see news.services.ts's
   * loadBookmarkedIds). When provided, this — not localStorage — determines
   * whether the button opens as "Saved", closing the gap where a
   * cleared-localStorage/different-browser session showed "Save" despite a
   * real NewsBookmark row existing. Falls back to the old localStorage-only
   * read when omitted (e.g. a caller that hasn't been updated to pass it).
   */
  initialBookmarked?: boolean;
}

/**
 * Real, persisted bookmarking via POST/DELETE /api/news/:slug/bookmark —
 * replaces the old app's localStorage-only toggle. `id` is the article's
 * slug (see VoteButtons.tsx's comment on why NewsArticleDTO.id is a slug).
 *
 * Initial "is this saved" state comes from `initialBookmarked` (the
 * backend's real answer) when the caller provides it; localStorage is kept
 * in sync alongside it purely so toggle()'s optimistic click-update (below)
 * still has something to read/write locally between backend round-trips —
 * it is no longer the source of truth for what renders on mount.
 */
export function SaveButton({ id, fluid, initialBookmarked }: SaveButtonProps) {
  const key = "tas_bm_" + id;
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (initialBookmarked !== undefined) {
      setSaved(initialBookmarked);
      try {
        if (initialBookmarked) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // localStorage unavailable — ignore
      }
      return;
    }
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key, initialBookmarked]);

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const next = !saved;
    try {
      const clientId = getClientId();
      const res = next
        ? await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clientId }),
          })
        : await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/bookmark?clientId=${encodeURIComponent(clientId)}`, {
            method: "DELETE",
          });
      if (!res.ok) throw new Error(`bookmark failed: ${res.status}`);
      setSaved(next);
      try {
        if (next) window.localStorage.setItem(key, "1");
        else window.localStorage.removeItem(key);
      } catch {
        // localStorage unavailable — ignore
      }
    } catch (err) {
      console.error("Bookmark failed:", err);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-pressed={saved}
      className="tas-savebtn"
      data-on={saved ? "" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: fluid ? "center" : "flex-start",
        width: fluid ? "100%" : "auto",
        gap: 8,
        height: 40,
        padding: "0 16px",
        borderRadius: "var(--news-radius-md)",
        cursor: pending ? "default" : "pointer",
        opacity: pending ? 0.7 : 1,
        transition: "var(--transition-colors)",
        font: "var(--fw-medium) var(--fs-body)/1 var(--font-sans)",
        color: saved ? "var(--purple-text)" : "var(--text-secondary)",
        background: saved ? "var(--purple-soft)" : "var(--bg-elevated)",
        border: `1px solid ${saved ? "var(--purple-border)" : "var(--border-default)"}`,
        boxShadow: "var(--highlight-top)",
      }}
    >
      <Icon path={ICONS.bookmark} size={17} fill={saved} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}
