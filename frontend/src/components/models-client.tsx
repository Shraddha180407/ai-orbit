'use client';

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Plus from 'lucide-react/dist/esm/icons/plus';
import Pencil from 'lucide-react/dist/esm/icons/pencil';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Building2 from 'lucide-react/dist/esm/icons/building-2';
import FolderHeart from 'lucide-react/dist/esm/icons/folder-heart';
import Newspaper from 'lucide-react/dist/esm/icons/newspaper';
import GitBranch from 'lucide-react/dist/esm/icons/git-branch';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Plug from 'lucide-react/dist/esm/icons/plug';
import PlayCircle from 'lucide-react/dist/esm/icons/play-circle';
import UserCircle from 'lucide-react/dist/esm/icons/user-circle';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Cpu from 'lucide-react/dist/esm/icons/cpu';

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { AIModel, ModelsSortOption } from "@/lib/types";
import { API_URL, fetchModels } from "@/lib/api";
import { ModelListView } from "@/components/ModelListView";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { toast } from "sonner";

const DIRECTORY_CARDS = [
  { name: "Tools", href: "/tools", description: "Browse the full AI tools directory, filter by category and pricing.", icon: Wrench, color: "#FFC53D" },
  { name: "Tasks", href: "/tasks", description: "Find the right AI tool for a specific job to be done.", icon: ListChecks, color: "#FB923C" },
  { name: "Companies", href: "/companies", description: "Explore the labs and startups building the AI ecosystem.", icon: Building2, color: "#38BDF8" },
  { name: "News", href: "/news", description: "The latest announcements and coverage across the AI world.", icon: Newspaper, color: "#FF6B4A" },
  { name: "Videos", href: "/videos", description: "Watch demos, reviews, and deep dives on the latest AI tools.", icon: PlayCircle, color: "#F87171" },
  { name: "Robots", href: "/robots", description: "Robotics platforms and the companies behind them.", icon: Bot, color: "#2DD4BF" },
  { name: "Devices", href: "/devices", description: "Hardware built for and powered by AI.", icon: Smartphone, color: "#F472B6" },
  { name: "Models", href: "/models", description: "Compare context windows, pricing, and benchmarks across AI models.", icon: Cpu, color: "#A78BFA" },
  { name: "Repositories", href: "/repositories", description: "Trending open-source AI repositories on GitHub.", icon: GitBranch, color: "#22D3EE" },
  { name: "MCP", href: "/tools", description: "Model Context Protocol servers and integrations.", icon: Plug, color: "#818CF8" },
  { name: "Collections", href: "/collections", description: "Curated bundles of tools grouped by use case.", icon: FolderHeart, color: "#34D399" },
  { name: "Personal", href: "/personal", description: "AI tools for personal productivity and everyday life.", icon: UserCircle, color: "#FBBF24" },
  { name: "Creativity", href: "/creativity", description: "AI tools for art, design, writing, and creative work.", icon: Palette, color: "#E879F9" },
] as const;

const MODELS_SUB = [
  "Text-to-Text",
  "Multimodal",
  "Vision-only",
  "Audio-only"
];

function formatSubcategoryPath(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

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
    <div className="flex-1 w-full flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      {/* 1. Sticky Header */}
      <Header />

      {/* 2. Hero Section */}
      <section
        className="relative w-full flex flex-col items-center pt-4 pb-6 px-6"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(35, 35, 38, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(35, 35, 38, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.12] blur-[100px]"
            style={{ backgroundColor: 'var(--color-signal)' }}
          />
        </div>

        <div className="mx-auto max-w-[1440px] w-full flex flex-col items-center text-center relative z-10">
          <h1 className="max-w-[820px] text-2xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[1.1] mb-4 sm:mb-6 select-none text-white text-balance">
            The Home of Everything AI
          </h1>

          <form action="/tools" method="GET" className="relative w-full max-w-[520px] mx-auto mb-4 sm:mb-5 group">
            <div
              className="relative w-full rounded-xl border border-[#232326]/70 bg-[#111113] h-[38px] sm:h-[42px] flex items-center px-3.5 sm:px-4 pr-[4.5rem] transition-colors duration-150"
            >
              <Search size={13} className="mr-2 sm:mr-2.5 text-[#71717A] shrink-0" />
              <input
                type="text"
                name="q"
                placeholder="Search AI tools, models, companies…"
                className="w-full bg-transparent text-[12px] sm:text-[13px] text-white placeholder:text-[#71717A] focus:outline-none"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-0.5 rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 font-mono text-[10px] text-[#71717A] pointer-events-none">
                  <span>⌘</span>K
                </kbd>
              </div>
            </div>
            <style jsx>{`
              form:focus-within > div {
                border-color: var(--color-signal) !important;
                box-shadow: 0 0 0 3px var(--color-signal-dim);
              }
            `}</style>
          </form>

          <div className="mb-3">
            <HeroFeatureChips />
          </div>
        </div>
      </section>

      <div className="border-b border-[#232326]/40 w-full z-10 relative" />

      {/* Sort control */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mx-auto w-full max-w-[1600px] flex justify-end">
          <div className="flex items-center gap-2 select-none">
            <span className="text-xs text-[#71717A]">
              Sort by
            </span>
            <div className="relative inline-flex items-center">
              <select
                value={sort}
                onChange={(e) => patchQuery({ sort: e.target.value || null })}
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
        </div>
      </div>

      {/* Directory nav strip */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-2 pb-1">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="flex flex-nowrap items-stretch gap-1.5 sm:gap-2 overflow-x-auto">
            {DIRECTORY_CARDS.map((card) => {
              const Icon = card.icon;
              const isSelected = card.name.toLowerCase() === "models";

              return (
                <Link
                  key={card.name}
                  href={card.href}
                  className="group flex flex-1 min-w-[76px] sm:min-w-[92px] shrink-0 flex-row items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-[#232326]/60 bg-[#0d0d10] px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-center transition-colors duration-200"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55`;
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.boxShadow = "";
                    }
                  }}
                  style={
                    isSelected
                      ? { borderColor: card.color, boxShadow: `0 0 0 1px ${card.color}, 0 8px 20px -6px ${card.color}55` }
                      : undefined
                  }
                >
                  <div
                    className="flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md border"
                    style={{ backgroundColor: `${card.color}1a`, borderColor: `${card.color}40` }}
                  >
                    <Icon size={10} strokeWidth={1.75} style={{ color: card.color }} />
                  </div>
                  <span className="text-[9px] sm:text-[10.5px] font-bold tracking-tight text-white whitespace-nowrap">
                    {card.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>



      {/* 3. Main content area containing toolbar and table */}
      <main className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-8 flex-1">
        <div className="mx-auto w-full max-w-[1600px] space-y-4">
          
          {/* Toolbar — search + sort, homepage density */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          {/* Table — same container as homepage tools section */}
          <div className="scroll-mt-28 w-full pt-2 pb-2">
            <ModelListView models={models} loading={isLoading && page === 1} />

            {/* Admin quick-edit strip (kept out of row chrome) */}
            {isAdmin && !isLoading && models.length > 0 && (
              <div className="rounded-lg border border-[#232326]/60 bg-[#131316]/20 px-3 py-2 mt-4">
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
          </div>

          {models.length > 0 && page < totalPages && (
            <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            </div>
          )}
        </div>
      </main>

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
      <Footer />
    </div>
  );
}
