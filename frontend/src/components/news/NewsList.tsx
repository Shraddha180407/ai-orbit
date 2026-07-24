"use client";

import { NewsTable, NewsTableEmpty } from "./NewsTable";
import type { NewsArticle, NewsSource } from "@/types/news";

interface NewsListProps {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  emptyKind: "search" | "empty";
  isAdmin?: boolean;
  onEdit?: (news: NewsArticle) => void;
  onDelete?: (id: string) => void;
}

/** Renders the listing table, or the same empty state ToolListView uses when the feed has nothing to show. */
export function NewsList({ articles, sources, emptyKind, isAdmin, onEdit, onDelete }: NewsListProps) {
  if (!articles.length) {
    return <NewsTableEmpty searchActive={emptyKind === "search"} />;
  }
  return <NewsTable articles={articles} sources={sources} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />;
}
