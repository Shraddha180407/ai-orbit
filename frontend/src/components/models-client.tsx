'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { AIModel, ModelSubCategory } from "@/lib/types";
import { API_URL, fetchModels, fetchModelSubCategories } from "@/lib/api";
import { ModelListView } from "@/components/ModelListView";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { toast } from "sonner";

export function ModelsClient() {
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";
  const searchParams = useSearchParams();
  const router = useRouter();

  const [models, setModels] = useState<AIModel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [subCategories, setSubCategories] = useState<ModelSubCategory[]>([]);
  const selectedSubCategorySlug = searchParams.get("subCategory") || null;
const rawSort = searchParams.get("sort") || "newest";
const selectedSort = rawSort === "name-asc" || rawSort === "name-desc"
  ? "alphabetical"
  : rawSort === "oldest"
  ? "oldest"
  : rawSort === "rating"
  ? "releaseDate"
  : "newest";

  const sentinelRef = useRef<HTMLDivElement>(null);

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

  // Fetch subcategories once on mount
  useEffect(() => {
    async function loadSubCategories() {
      try {
        const data = await fetchModelSubCategories();
        setSubCategories(data || []);
      } catch (e) {
        console.error("Failed to fetch model subcategories:", e);
      }
    }
    loadSubCategories();
  }, []);

  useEffect(() => {
  setPage(1);
  setModels([]);
}, [selectedSort, selectedSubCategorySlug]);

  const handleSelectSubCategory = (slug: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set("subCategory", slug);
    } else {
      params.delete("subCategory");
    }
    setPage(1);
    router.push(`/models?${params.toString()}`);
  };

  // Fetch page
  useEffect(() => {
    async function load() {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);
      try {
        const data = await fetchModels({ page, subCategory: selectedSubCategorySlug || undefined, sort: selectedSort as any });
        if (page === 1) setModels(data.items);
        else setModels((prev) => [...prev, ...data.items]);
        setTotalPages(data.pagination.totalPages || 1);
      } catch (e) {
        console.error("Failed to fetch models:", e);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedSubCategorySlug, selectedSort]);

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

  const reloadFirstPage = async () => {
    setIsLoading(true);
    try {
      const data = await fetchModels({ page: 1 });
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
    <div className="flex-1 w-full flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* Table — same container as homepage tools section */}
      <div className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2 flex-1">
        <div className="mx-auto w-full max-w-[1600px] space-y-3">
          {isAdmin && (
            <Button
              className="h-7 bg-white text-black hover:bg-neutral-200 text-xs"
              onClick={openAdd}
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Model
            </Button>
          )}

          {/* Subcategory Filter Chips */}
          {subCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleSelectSubCategory(null)}
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  !selectedSubCategorySlug
                    ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                    : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                All
              </button>
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubCategory(sub.slug)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedSubCategorySlug === sub.slug
                      ? "border-[#6E56CF] bg-[#6E56CF] text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-white/60 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

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
