"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { ICONS } from "@/lib/icons";
import type { NewsArticle } from "@/types/news";

/**
 * Bookmark + share row actions. Extracted from NewsTable.tsx so both the
 * desktop table row and the mobile/tablet card (see NewsCard.tsx) can share
 * the exact same behavior instead of two divergent copies.
 */
export function NewsRowActions({ article }: { article: NewsArticle }) {
  const key = "tas_bm_" + article.id;
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      setSaved(window.localStorage.getItem(key) === "1");
    } catch {
      // localStorage unavailable — ignore
    }
  }, [key]);

  const toggle = (e: MouseEvent) => {
    e.stopPropagation();
    const next = !saved;
    setSaved(next);
    try {
      if (next) window.localStorage.setItem(key, "1");
      else window.localStorage.removeItem(key);
    } catch {
      // localStorage unavailable — ignore
    }
  };

  const share = async (e: MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/news/${article.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.headline, text: article.headline, url });
        return;
      }
    } catch {
      // user cancelled or Web Share unsupported — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — ignore
    }
    setShared(true);
    setTimeout(() => setShared(false), 1400);
  };

  const box = (on: boolean, onClick: (e: MouseEvent) => void, path: string, label: string) => (
    <button
      onClick={onClick}
      className="tas-act-box w-9 h-9"
      data-on={on ? "" : undefined}
      aria-label={label}
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        borderRadius: "var(--news-radius-sm)",
        cursor: "pointer",
      }}
    >
      <Icon path={path} size={15} fill={on} />
    </button>
  );

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }} onClick={(e) => e.stopPropagation()}>
      {box(saved, toggle, ICONS.bookmark, saved ? "Saved" : "Save")}
      {box(shared, share, shared ? ICONS.check : ICONS.share, shared ? "Link copied" : "Share")}
    </div>
  );
}
