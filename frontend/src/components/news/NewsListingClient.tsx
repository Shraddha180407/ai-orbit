"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { NewsList } from "./NewsList";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { ErrorState } from "./ErrorState";
import { API_URL } from "@/lib/api";
import { getClientId } from "@/lib/clientId";
import { sortArticles } from "@/lib/news/news";
import type { NewsArticle, NewsSource, SortState } from "@/types/news";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/shadcn-button";

const PAGE_SIZE = 25;

interface NewsListingResponse {
  articles: NewsArticle[];
  sources: Record<string, NewsSource>;
  pagination?: { page: number; perPage: number; total: number; hasMore: boolean };
}

interface NewsListingClientProps {
  category?: string;
  initialTopic?: string;
}

export function NewsListingClient({ category, initialTopic }: NewsListingClientProps) {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const [sort] = useState<SortState>({ key: "date", dir: "desc" });

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<Record<string, NewsSource>>({});

  const [mode, setMode] = useState<"paginated" | "full">("paginated");
  const [nextPage, setNextPage] = useState(1);
  const [serverTotal, setServerTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialError, setInitialError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);

  const loadFull = useCallback(async () => {
    setInitialError(false);
    setLoadMoreError(false);
    try {
      const clientId = getClientId();
      const res = await fetch(`${API_URL}/api/news${clientId ? `?clientId=${encodeURIComponent(clientId)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const json: NewsListingResponse = await res.json();
      setArticles(json.articles);
      setSources(json.sources);
      setMode("full");
      setHasMore(false);
    } catch {
      setInitialError(true);
    } finally {
      setIsLoadingInitial(false);
    }
  }, []);

  const loadPage = useCallback(async (page: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
      setLoadMoreError(false);
    } else {
      setInitialError(false);
    }
    try {
      const clientId = getClientId();
      const res = await fetch(`${API_URL}/api/news?page=${page}&perPage=${PAGE_SIZE}${clientId ? `&clientId=${encodeURIComponent(clientId)}` : ""}`);
      if (!res.ok) throw new Error(String(res.status));
      const json: NewsListingResponse = await res.json();
      setArticles((prev) => (append ? [...prev, ...json.articles] : json.articles));
      setSources(json.sources);
      setServerTotal(json.pagination?.total ?? json.articles.length);
      setHasMore(json.pagination?.hasMore ?? false);
      setNextPage(page + 1);
    } catch {
      if (append) setLoadMoreError(true);
      else setInitialError(true);
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (category || initialTopic) loadFull();
    else loadPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (mode !== "paginated" || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) loadPage(nextPage, true);
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, hasMore, isLoadingMore, nextPage, loadPage]);

  // Admin handlers
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/news/${editingId}` : `${API_URL}/api/admin/news`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
      if (!res.ok) throw new Error('Failed to save news');
      toast.success(editingId ? 'News updated successfully' : 'News added successfully');
      setIsModalOpen(false);
      if (mode === "paginated") loadPage(1, false);
      else loadFull();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/news/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete news');
      toast.success('News deleted successfully');
      if (mode === "paginated") loadPage(1, false);
      else loadFull();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ title: '', slug: '', articleUrl: '', category: 'general', summary: '' });
    setIsModalOpen(true);
  };

  const openEdit = (news: any) => {
    setEditingId(news.id);
    setFormData({ title: news.headline || '', slug: news.id || '', articleUrl: news.articleUrl || '', category: news.category || 'general', summary: news.dek || news.aiSummary || '' });
    setIsModalOpen(true);
  };

  let list = articles.slice();
  if (category) list = list.filter((a) => a.category === category || a.filters.includes(category));
  list = sortArticles(list, sort, sources);

  if (isLoadingInitial) {
    return (
      <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
        <LoadingSkeleton />
      </main>
    );
  }

  if (initialError) {
    return (
      <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
        <ErrorState onRetry={() => (category || initialTopic ? loadFull() : loadPage(1, false))} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col">
      {isAdmin && (
        <div className="flex justify-end mb-4">
          <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add News
          </Button>
        </div>
      )}

      {/* News Table List matching Video Table UI */}
      <div className="space-y-4">
        <NewsList articles={list} sources={sources} emptyKind="empty" isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />

        {mode === "paginated" && list.length > 0 && (
          <div ref={sentinelRef} className="flex items-center justify-center py-6">
            {isLoadingMore && <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />}
            {!isLoadingMore && loadMoreError && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#71717A]">Couldn&apos;t load more stories.</span>
                <button onClick={() => loadPage(nextPage, true)} className="text-sm font-semibold text-white hover:underline">
                  Retry
                </button>
              </div>
            )}
            {!isLoadingMore && !loadMoreError && !hasMore && <span className="text-sm text-[#71717A]">You&apos;re all caught up</span>}
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit News' : 'Add News'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Title *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="Article headline" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="article-url-slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Article URL</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="https://..." value={formData.articleUrl} onChange={e => setFormData({...formData, articleUrl: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Category</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. general, llm, robotics" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Summary / Dek</label><textarea className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20" placeholder="Brief description..." value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} /></div>
        </div>
      </Modal>
    </main>
  );
}
