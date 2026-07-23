const GRID = "minmax(320px,2.2fr) minmax(120px,0.7fr) minmax(120px,0.6fr) 90px 84px";

/**
 * Skeleton for the hero/featured card (see FeaturedStory.tsx) — mirrors its
 * responsive layout switch too: single column below `lg:`, a visual-rail +
 * content two-column grid at `lg:` and up.
 */
function FeaturedSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[220px_1fr] xl:grid-cols-[260px_1fr]"
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-default)",
        background: "var(--bg-surface)",
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div className="hidden lg:flex" style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, background: "var(--bg-surface-2)" }}>
        <div className="tas-shimmer" style={{ width: 56, height: 56, borderRadius: "var(--news-radius-lg)" }} />
        <div className="tas-shimmer" style={{ height: 12, width: 90, borderRadius: 4 }} />
      </div>
      <div className="p-4 gap-3 sm:p-5 md:p-7 md:gap-4" style={{ display: "flex", flexDirection: "column" }}>
        <div className="tas-shimmer" style={{ height: 24, width: 96, borderRadius: 999 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="tas-shimmer" style={{ width: 22, height: 22, borderRadius: "var(--news-radius-sm)", flex: "none" }} />
          <div className="tas-shimmer" style={{ height: 12, width: 100, borderRadius: 4 }} />
        </div>
        <div className="tas-shimmer" style={{ height: 20, width: "90%", borderRadius: 6 }} />
        <div className="tas-shimmer" style={{ height: 20, width: "70%", borderRadius: 6 }} />
        <div className="tas-shimmer hidden sm:block" style={{ height: 12, width: "85%", borderRadius: 4 }} />
        <div className="tas-shimmer hidden sm:block" style={{ height: 12, width: "55%", borderRadius: 4 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <div className="tas-shimmer" style={{ height: 26, width: 80, borderRadius: 999 }} />
          <div className="tas-shimmer" style={{ height: 26, width: 90, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

/** Card-shaped skeleton — mirrors NewsCard.tsx's image/icon block + title lines + meta line, for the mobile/tablet card feed. */
function CardSkeleton({ index }: { index: number }) {
  return (
    <div
      className="p-3.5 gap-2.5 md:p-4 md:gap-3"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "var(--news-radius-lg)",
        border: "1px solid var(--border-subtle)",
        background: "var(--bg-surface-2)",
        animationDelay: Math.min(index, 12) * 24 + "ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="tas-shimmer" style={{ width: 24, height: 24, borderRadius: "var(--news-radius-sm)", flex: "none" }} />
        <div className="tas-shimmer" style={{ height: 10, width: 70, borderRadius: 4 }} />
      </div>
      <div className="tas-shimmer" style={{ height: 14, width: "95%", borderRadius: 4 }} />
      <div className="tas-shimmer" style={{ height: 14, width: "60%", borderRadius: 4 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <div className="tas-shimmer" style={{ height: 22, width: 70, borderRadius: 999 }} />
        <div style={{ display: "flex", gap: 4 }}>
          <div className="tas-shimmer" style={{ height: 28, width: 28, borderRadius: "var(--news-radius-sm)" }} />
          <div className="tas-shimmer" style={{ height: 28, width: 28, borderRadius: "var(--news-radius-sm)" }} />
        </div>
      </div>
    </div>
  );
}

/** Row-shaped skeleton for the desktop table (lg: and up) — same grid as NewsRow, publisher-icon block + title + meta cells. */
function RowSkeleton({ index }: { index: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: GRID,
        gap: 12,
        alignItems: "center",
        padding: "18px 14px",
        borderBottom: "1px solid var(--border-subtle)",
        animationDelay: Math.min(index, 12) * 24 + "ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div className="tas-shimmer" style={{ width: 36, height: 36, borderRadius: "var(--news-radius-sm)", flex: "none" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="tas-shimmer" style={{ height: 12, width: "85%", borderRadius: 4 }} />
          <div className="tas-shimmer" style={{ height: 10, width: "40%", borderRadius: 4 }} />
        </div>
      </div>
      <div className="tas-shimmer" style={{ height: 12, width: 80, borderRadius: 4 }} />
      <div className="tas-shimmer" style={{ height: 22, width: 100, borderRadius: 999 }} />
      <div className="tas-shimmer" style={{ height: 12, width: 50, borderRadius: 4 }} />
      <div className="tas-shimmer" style={{ height: 24, width: 76, borderRadius: "var(--news-radius-sm)", justifySelf: "end" }} />
    </div>
  );
}

/**
 * Content-shaped loading state — mirrors the real feed's own layout switch
 * (hero + card feed below `lg:`, hero + table at `lg:` and up) instead of
 * generic gray bars, and fades into place with the same tas-enter animation
 * the real rows/cards use once they load (see NewsCard.tsx/NewsTable.tsx).
 */
export function LoadingSkeleton() {
  const cards = Array.from({ length: 6 });
  const rows = Array.from({ length: 8 });

  return (
    <div className="tas-enter">
      <FeaturedSkeleton />

      {/* Card feed skeleton — matches NewsTable.tsx's sm:/md: card grid steps */}
      <div className="grid lg:hidden gap-2.5 sm:grid-cols-2 sm:gap-3 md:gap-4" style={{ gridTemplateColumns: "1fr" }}>
        {cards.map((_, i) => (
          <CardSkeleton key={i} index={i} />
        ))}
      </div>

      {/* Desktop table skeleton */}
      <div
        className="hidden lg:block px-3 lg:px-5"
        style={{
          borderRadius: "var(--radius-xl)",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--highlight-top)",
          paddingTop: 8,
          paddingBottom: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 12, alignItems: "center", height: 40, padding: "0 14px", borderBottom: "1px solid var(--border-default)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="tas-shimmer" style={{ height: 10, width: i === 0 ? 60 : 44, borderRadius: 4 }} />
          ))}
        </div>
        {rows.map((_, i) => (
          <RowSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
