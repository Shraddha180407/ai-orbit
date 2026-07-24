"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import type { NewsComment } from "@/types/news";

interface CommentBoxProps {
  id: string;
  initialComments: NewsComment[];
}

/**
 * Real, persisted comments via POST /api/news/:slug/comments. Restyled to
 * the homepage's plain-Tailwind system: bg-surface/border-border card,
 * var(--color-signal) as the post-button accent instead of the old purple
 * theme.
 */
export function CommentBox({ id, initialComments }: CommentBoxProps) {
  const [value, setValue] = useState("");
  const [comments, setComments] = useState<NewsComment[]>(initialComments);
  const [posting, setPosting] = useState(false);
  const canPost = value.trim().length > 0 && !posting;

  const post = async () => {
    if (!canPost) return;
    setPosting(true);
    const body = value.trim();
    try {
      const res = await fetch(`${API_URL}/api/news/${encodeURIComponent(id)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: getClientId(), body }),
      });
      if (!res.ok) throw new Error(`comment post failed: ${res.status}`);
      const { comment }: { comment: NewsComment } = await res.json();
      setComments((cur) => [comment, ...cur]);
      setValue("");
    } catch (err) {
      console.error("Comment post failed:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <section className="mt-11 rounded-lg border border-border bg-surface p-5">
      <h3 className="text-lg font-semibold text-foreground mb-3">{comments.length ? `Comments (${comments.length})` : "Add a comment"}</h3>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={4}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") post();
        }}
        placeholder="Share your thoughts about this story…"
        className="w-full resize-y min-h-[120px] rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-foreground-faint focus:border-accent focus:outline-none"
      />
      <div className="flex items-center gap-3.5 mt-3">
        <button
          type="button"
          onClick={post}
          disabled={!canPost}
          className={`inline-flex h-9 items-center rounded-md px-4 text-sm font-semibold transition-colors ${
            canPost ? "text-black" : "cursor-not-allowed bg-[#18181C] text-[#4a4a4d]"
          }`}
          style={canPost ? { backgroundColor: "var(--color-signal)" } : undefined}
        >
          {posting ? "Posting…" : "Post Comment"}
        </button>
        <span className="text-xs text-foreground-faint">⌘↵ to post</span>
      </div>

      {comments.length > 0 && (
        <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-border">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised text-xs font-semibold text-foreground-muted">
                {c.authorName.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{c.authorName}</span>
                  <span className="text-[11px] font-mono text-foreground-faint">{new Date(c.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground-muted mt-1.5">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
