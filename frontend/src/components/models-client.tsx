'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { AIModel, ModelsSortOption } from "@/lib/types";
import { API_URL, fetchModels } from "@/lib/api";
import { ModelListView } from "@/components/ModelListView";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { toast } from "sonner";

const SORT_OPTIONS: { value: ModelsSortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "alphabetical", label: "Name (A-Z)" },
  { value: "releaseDate", label: "Release Date" },
];

export function ModelsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";

  const [models, setModels] = useState<AIModel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [providers, setProviders] = useState<{ slug: string; name: string; count: number }[]>([]);
  const [modalities, setModalities] = useState<{ modality: string; count: number }[]>([]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // URL-driven filters (same pattern as homepage)
  const search = (searchParams.get("search") || searchParams.get("q") || "").trim();
  const provider = searchParams.get("provider") || undefined;
  const modality = searchParams.get("modality") || undefined;
  const sort = (searchParams.get("sort") as ModelsSortOption | null) || "newest";

  const [searchInput, setSearchInput] = useState(search);

  const filterKey = `${search}-${provider || ""}-${modality || ""}-${sort}`;

  // Admin modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    creator: "",
    contextWindow: "",
    parameterSize: "",
    modality: "",
    releaseDate: "",
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search box → URL
  useEffect(() => {
    const t = setTimeout(() => {
      const next = searchInput.trim();
      const params = new URLSearchParams(searchParams.toString());
      if (next) {
        params.set("search", next);
        params.delete("q");
      } else {
        params.delete("search");
        params.delete("q");
      }
      const qs = params.toString();
      const target = qs ? `/models?${qs}` : "/models";
      const current = searchParams.toString()
        ? `/models?${searchParams.toString()}`
        : "/models";
      if (target !== current) router.push(target);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Sync input when URL changes externally
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Reset list when filters change
  useEffect(() => {
    setModels([]);
    setPage(1);
    setTotalPages(1);
  }, [filterKey]);

  // Fetch page
  useEffect(() => {
    async function load() {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);
      try {
        const data = await fetchModels({
          search: search || undefined,
          provider,
          modality,
          sort,
          page,
        });
        if (page === 1) setModels(data.items);
        else setModels((prev) => [...prev, ...data.items]);
        setTotalPages(data.pagination.totalPages || 1);
        if (data.filters?.providers) setProviders(data.filters.providers);
        if (data.filters?.modalities) setModalities(data.filters.modalities);
      } catch (e) {
        console.error("Failed to fetch models:", e);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, page]);

  // Infinite scroll
  useEffect(() => {
    if (isLoading || isFetchingMore || page >= totalPages) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { threshold: 0.1 }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [isLoading, isFetchingMore, page, totalPages]);

  const patchQuery = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `/models?${qs}` : "/models");
  };

  const setSort = (value: string) => {
    patchQuery({ sort: value && value !== "newest" ? value : null });
  };

  const reloadFirstPage = async () => {
    setIsLoading(true);
    try {
      const data = await fetchModels({
        search: search || undefined,
        provider,
        modality,
        sort,
        page: 1,
      });
      setModels(data.items);
      setPage(1);
      setTotalPages(data.pagination.totalPages || 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId
        ? `${API_URL}/api/admin/models/${editingId}`
        : `${API_URL}/api/admin/models`;
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to save model");
      toast.success(editingId ? "Model updated successfully" : "Model added successfully");
      setIsModalOpen(false);
      await reloadFirstPage();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/models/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete model");
      toast.success("Model deleted successfully");
      await reloadFirstPage();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      creator: "",
      contextWindow: "",
      parameterSize: "",
      modality: "",
      releaseDate: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (model: AIModel) => {
    setEditingId(model.id);
    setFormData({
      name: model.name || "",
      creator: model.creator || "",
      contextWindow: model.contextWindow || "",
      parameterSize: model.parameterSize || "",
      modality: model.modality || "",
      releaseDate: model.releaseDate || "",
      description: model.description || "",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* Toolbar — search + sort, homepage density */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="mx-auto w-full max-w-[1600px] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#71717A]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search models…"
              className="w-full rounded-lg border border-[#232326] bg-[#131316] py-1.5 pl-9 pr-3 text-xs font-semibold text-white placeholder:text-[#52525B] hover:border-neutral-500 focus:border-neutral-500 focus:outline-none transition-all h-8"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="relative inline-flex items-center">
              <select
                value={provider || ""}
                onChange={(e) => patchQuery({ provider: e.target.value || null })}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7 max-w-[140px]"
              >
                <option value="">All companies</option>
                {providers.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} ({p.count})
                  </option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>

            <div className="relative inline-flex items-center">
              <select
                value={modality || ""}
                onChange={(e) => patchQuery({ modality: e.target.value || null })}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7 max-w-[160px]"
              >
                <option value="">All types</option>
                {modalities.map((m) => (
                  <option key={m.modality} value={m.modality}>
                    {m.modality} ({m.count})
                  </option>
                ))}
              </select>
              <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
            </div>

            <div className="flex items-center gap-2 select-none">
              <span className="text-xs text-[#71717A]">Sort by</span>
              <div className="relative inline-flex items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={11} className="absolute right-2 text-[#71717A] pointer-events-none" />
              </div>
            </div>

            {isAdmin && (
              <Button
                className="h-7 bg-white text-black hover:bg-neutral-200 text-xs"
                onClick={openAdd}
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Model
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table — same container as homepage tools section */}
      <div className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2 flex-1">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">
          <ModelListView models={models} loading={isLoading && page === 1} />

          {/* Admin quick-edit strip (kept out of row chrome) */}
          {isAdmin && !isLoading && models.length > 0 && (
            <div className="rounded-lg border border-[#232326]/60 bg-[#131316]/20 px-3 py-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] mb-2">
                Admin — edit / delete
              </p>
              <div className="flex flex-wrap gap-2">
                {models.slice(0, 12).map((m) => (
                  <div
                    key={m.id}
                    className="inline-flex items-center gap-1 rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-1"
                  >
                    <span className="max-w-[120px] truncate text-[11px] text-white">{m.name}</span>
                    <button
                      type="button"
                      className="text-[#A1A1AA] hover:text-white"
                      onClick={() => openEdit(m)}
                      aria-label={`Edit ${m.name}`}
                    >
                      <Pencil size={11} />
                    </button>
                    <button
                      type="button"
                      className="text-red-400/80 hover:text-red-400"
                      onClick={() => {
                        if (window.confirm(`Delete ${m.name}?`)) handleDelete(m.id);
                      }}
                      aria-label={`Delete ${m.name}`}
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {models.length > 0 && page < totalPages && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Model" : "Add Model"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#8A8F98]">Name *</label>
            <Input
              className="bg-[#111113] border-[#1C1C1F] text-white"
              placeholder="e.g. GPT-4o"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-[#8A8F98]">Creator *</label>
            <Input
              className="bg-[#111113] border-[#1C1C1F] text-white"
              placeholder="e.g. OpenAI"
              value={formData.creator}
              onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8A8F98]">Context Window *</label>
              <Input
                className="bg-[#111113] border-[#1C1C1F] text-white"
                placeholder="e.g. 128k"
                value={formData.contextWindow}
                onChange={(e) => setFormData({ ...formData, contextWindow: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-[#8A8F98]">Parameter Size *</label>
              <Input
                className="bg-[#111113] border-[#1C1C1F] text-white"
                placeholder="e.g. 70B"
                value={formData.parameterSize}
                onChange={(e) => setFormData({ ...formData, parameterSize: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8A8F98]">Modality *</label>
              <Input
                className="bg-[#111113] border-[#1C1C1F] text-white"
                placeholder="e.g. Text, Multimodal"
                value={formData.modality}
                onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-[#8A8F98]">Release Date *</label>
              <Input
                className="bg-[#111113] border-[#1C1C1F] text-white"
                placeholder="e.g. 2024-05"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#8A8F98]">Description *</label>
            <textarea
              className="w-full p-2 text-sm bg-[#111113] border border-[#1C1C1F] text-white rounded-md h-20"
              placeholder="Short description of the model..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
