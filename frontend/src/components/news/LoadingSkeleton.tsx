import { NewsTableSkeleton } from "./NewsTable";

/** Kept as a thin re-export so existing imports (news/loading.tsx, NewsListingClient.tsx) don't need to change — the real skeleton now lives in NewsTable.tsx next to the table it mirrors. */
export function LoadingSkeleton() {
  return <NewsTableSkeleton />;
}
