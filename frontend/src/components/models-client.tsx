'use client';

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { AIModel, ModelSubCategory, ModelType, formatModelType } from "@/lib/types";
import { API_URL, fetchModels, fetchModelSubCategories, fetchModelFilters } from "@/lib/api";
import { ModelListView } from "@/components/ModelListView";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { toast } from "sonner";

import { Pagination } from "@/components/Pagination";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { scrollChipIntoView } from "@/lib/utils";

const MODEL_TYPE_OPTIONS: ModelType[] = [
  "TEXT",
  "IMAGE",
  "VIDEO",
  "MULTIMODAL",
  "AUDIO",
  "CODE",
  "THREE_D",
  "STRUCTURED_DATA",
];

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-1.5 text-[12px]">
      <span className="text-[#71717A] whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-[#232326]/60 bg-[#131316]/50 px-2.5 py-1.5 text-[12px] text-white outline-none transition-colors focus:border-white/[0.15] cursor-pointer"
      >
        {children}
      </select>
    </label>
  );
}

export function ModelsClient({ defaultSubCategory }: { defaultSubCategory?: string }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === "ADMIN";
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedSubCategorySlug = defaultSubCategory || searchParams.get("subCategory") || null;

  // Auto-scrolls the active subcategory chip into view (centered) within
  // its horizontally-scrolling row when the selection changes.
  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const container = subCatContainerRef.current;
    if (!container) return;
    const activeKey = selectedSubCategorySlug || "all";
    const target = subCatRefs.current[activeKey];
    if (!target) return;

    scrollChipIntoView(container, target);
  }, [selectedSubCategorySlug]);

  const rawSort = searchParams.get("sort") || "newest";
  const selectedSort = rawSort === "name-asc" || rawSort === "name-desc"
    ? "alphabetical"
    : rawSort === "oldest"
      ? "oldest"
      : rawSort === "rating"
        ? "releaseDate"
        : "newest";

  // Driven by the global search bar, which writes `?q=` to the URL — same
  // convention as ToolsClient. The Models API's own query param is named
  // `search`; we translate at the fetch call only.
  const q = searchParams.get("q") || undefined;

  const selectedProvider = searchParams.get("provider") || "";
  const selectedModelType = (searchParams.get("modelType") || "") as ModelType | "";

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const pageFromUrl = searchParams.get("page");
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });
  const [pageSize, setPageSize] = useState<number>(100);

  // Reset to page 1 whenever search or filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [q, selectedProvider, selectedModelType, selectedSubCategorySlug]);

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

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }

    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  };

  const handleSelectSubCategory = (slug: string | null) => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("subCategory", slug);
    } else {
      params.delete("subCategory");
    }
    params.delete("page");
    const query = params.toString();
    router.push(query ? `/models?${query}` : "/models");
  };

  const { data: subCategories = [] } = useQuery<ModelSubCategory[]>({
    queryKey: ["model-subcategories"],
    queryFn: fetchModelSubCategories,
    staleTime: 30 * 60 * 1000,
  });

  const { data: filterOptions } = useQuery({
    queryKey: ["model-filters"],
    queryFn: fetchModelFilters,
    staleTime: 30 * 60 * 1000,
  });

  const {
    data,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "models",
      {
        subCategory: selectedSubCategorySlug,
        sort: selectedSort,
        page: currentPage,
        limit: pageSize,
        search: q,
        provider: selectedProvider,
        modelType: selectedModelType,
      },
    ],
    queryFn: async () => {
      return fetchModels({
        page: currentPage,
        limit: pageSize,
        subCategory: selectedSubCategorySlug || undefined,
        sort: selectedSort as any,
        search: q,
        provider: selectedProvider || undefined,
        modelType: (selectedModelType || undefined) as ModelType | undefined,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const models = data?.items || [];
  const totalPages = data?.pagination?.totalPages || 1;
  const hasActiveFilters = Boolean(q || selectedProvider || selectedModelType);

  const reloadFirstPage = async () => {
    queryClient.invalidateQueries({ queryKey: ["models"] });
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
      <div className="scroll-mt-28 w-full px-4 sm:px-6 lg:px-8 pt-2 pb-2 flex-1">
        <div className={`mx-auto w-full max-w-[1600px] space-y-3 transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
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
            <div
              ref={subCatContainerRef}
              className="mb-2 -mx-4 sm:mx-0 px-4 sm:px-0 flex flex-nowrap items-center justify-start gap-1.5 touch-scroll-x pb-2.5 scrollbar-none w-auto sm:w-full overflow-x-auto scroll-smooth"
            >
              <button
                ref={(el) => { subCatRefs.current["all"] = el; }}
                onClick={() => handleSelectSubCategory(null)}
                className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${!selectedSubCategorySlug
                    ? "bg-white text-black border-white shadow-lg shadow-white/5"
                    : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                  }`}
              >
                All
              </button>
              {subCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={(e) => {
                    handleSelectSubCategory(sub.slug);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "nearest"
                    });
                  }}
                  className={`rounded-full px-3.5 py-1 text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border active:scale-95 cursor-pointer shrink-0 ${selectedSubCategorySlug === sub.slug
                      ? "bg-white text-black border-white shadow-lg shadow-white/5"
                      : "text-neutral-400 hover:text-white bg-[#131316]/50 border-[#232326]/60 hover:border-white/[0.15]"
                    }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Provider / Type filters — backed by /api/v1/models/filters */}
          {filterOptions && (filterOptions.providers.length > 0 || filterOptions.modelTypes.length > 0) && (
            <div className="flex flex-wrap items-center gap-2.5">
              {filterOptions.providers.length > 0 && (
                <FilterSelect
                  label="Provider"
                  value={selectedProvider}
                  onChange={(v) => updateParams({ provider: v || null })}
                >
                  <option value="">All providers</option>
                  {filterOptions.providers.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </FilterSelect>
              )}

              {filterOptions.modelTypes.length > 0 && (
                <FilterSelect
                  label="Type"
                  value={selectedModelType}
                  onChange={(v) => updateParams({ modelType: v || null })}
                >
                  <option value="">All types</option>
                  {MODEL_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {formatModelType(t)}
                    </option>
                  ))}
                </FilterSelect>
              )}

              {(selectedProvider || selectedModelType) && (
                <button
                  type="button"
                  onClick={() => updateParams({
                    provider: null,
                    modelType: null,
                  })}
                  className="text-[11px] font-semibold text-[#71717A] hover:text-white transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          <ModelListView models={models} loading={isLoading && models.length === 0} />

          {!isLoading && models.length === 0 && hasActiveFilters && (
            <p className="text-center text-[12px] text-[#71717A]">
              {q ? `No models match “${q}”.` : "No models match the selected filters."}
            </p>
          )}

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

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={data?.pagination?.total}
            onPageChange={(p) => {
              setCurrentPage(p);
              const target = document.getElementById("models-grid");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
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