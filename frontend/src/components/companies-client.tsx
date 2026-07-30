'use client';

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Building from 'lucide-react/dist/esm/icons/building';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Search from 'lucide-react/dist/esm/icons/search';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Wrench from 'lucide-react/dist/esm/icons/wrench';
import ListChecks from 'lucide-react/dist/esm/icons/list-checks';
import Cpu from 'lucide-react/dist/esm/icons/cpu';
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

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroFeatureChips } from "@/components/HeroFeatureChips";
import { Company } from "@/lib/types";
import { fetchAllCompanies } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_URL } from "@/lib/api";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

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

const COMPANIES_SUB = [
  "AI Model Providers",
  "AI Startups",
  "Enterprise AI",
  "Healthcare AI",
  "Finance AI",
  "Marketing AI",
  "Developer Tools",
  "Robotics & Automation",
  "Education AI",
  "Creative AI"
];

function formatSubcategoryPath(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function CompaniesClient() {
  const { user } = useUser();
  const isAdmin = user?.role === 'ADMIN';

  const routeParams = useParams();
  const activeSubcategoryPath = routeParams?.category as string | undefined;
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(activeSubcategoryPath);

  useEffect(() => {
    setActiveSubcategory(activeSubcategoryPath);
  }, [activeSubcategoryPath]);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [sort, setSort] = useState<string>("newest");
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") || "").trim();

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllCompanies();
      setCompanies(data || []);
    } catch (e) {
      console.error("Failed to fetch companies:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    let list = companies;

    // Subcategory Filter
    if (activeSubcategory) {
      const sub = activeSubcategory.toLowerCase();
      if (sub === "aimodelproviders") {
        list = list.filter((c) => (c._count?.aiModels || 0) > 0 || ["openai", "anthropic", "google", "meta", "mistral", "cohere", "stability"].some(p => c.name.toLowerCase().includes(p)));
      } else if (sub === "aistartups") {
        list = list.filter((c) => (c._count?.tools || 0) > 0 && !["openai", "google", "meta", "microsoft", "apple", "amazon"].some(p => c.name.toLowerCase().includes(p)));
      } else {
        const keywordMap: Record<string, string[]> = {
          enterpriseai: ["enterprise", "platform", "business", "solution", "scale"],
          healthcareai: ["health", "medical", "clinical", "bio", "doctor", "patient"],
          financeai: ["finance", "trading", "market", "banking", "wealth", "stock"],
          marketingai: ["marketing", "ad", "sales", "brand", "social"],
          developertools: ["developer", "api", "code", "programming", "git", "sdk"],
          roboticsautomation: ["robot", "hardware", "drone", "automation", "manufacture"],
          educationai: ["education", "learning", "student", "teacher", "school", "course"],
          creativeai: ["creative", "art", "music", "image", "design", "video", "generate"]
        };
        const keywords = keywordMap[sub] || [];
        if (keywords.length > 0) {
          list = list.filter((c) => {
            const content = `${c.name} ${c.description || ""}`.toLowerCase();
            return keywords.some(k => content.includes(k));
          });
        }
      }
    }

    // Search Query Filter
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(needle) || (c.description && c.description.toLowerCase().includes(needle)));
    }

    // Sort Filter
    if (sort === "tools") {
      list = [...list].sort((a, b) => (b._count?.tools || 0) - (a._count?.tools || 0));
    } else if (sort === "models") {
      list = [...list].sort((a, b) => (b._count?.aiModels || 0) - (a._count?.aiModels || 0));
    } else if (sort === "alphabetical") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // newest/default
      list = [...list].sort((a, b) => ((b._count?.tools || 0) + (b._count?.aiModels || 0)) - ((a._count?.tools || 0) + (a._count?.aiModels || 0)));
    }

    return list;
  }, [companies, q, activeSubcategory, sort]);

  // Reset pagination whenever the active query changes.
  useEffect(() => {
    setVisibleCount(15);
  }, [q, activeSubcategory, sort]);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= filteredCompanies.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 15);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, visibleCount, filteredCompanies.length]);

  const visibleCompanies = filteredCompanies.slice(0, visibleCount);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/companies/${editingId}` : `${API_URL}/api/admin/companies`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to save company');
      toast.success(editingId ? 'Company updated successfully' : 'Company added successfully');
      setIsModalOpen(false);
      getCompanies();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/companies/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete company');
      toast.success('Company deleted successfully');
      getCompanies();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', logoUrl: '' });
    setIsModalOpen(true);
  };

  const openEdit = (company: any) => {
    setEditingId(company.id);
    setFormData({ name: company.name || '', slug: company.slug || '', logoUrl: company.logoUrl || '' });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
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
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-lg border border-[#232326] bg-[#131316] pl-3 pr-8 py-1 text-xs font-semibold text-white hover:border-neutral-500 focus:outline-none transition-all cursor-pointer h-7"
              >
                <option value="newest">Newest</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="tools">Most Tools</option>
                <option value="models">Most Models</option>
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
              const isSelected = card.name.toLowerCase() === "companies";

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



      <main className="mx-auto max-w-[1070px] px-8 py-4 flex-1 w-full">
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Company
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">
              {q ? `No companies match "${q}".` : "No companies found."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleCompanies.map((company: Company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_200px_120px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all focus-visible:bg-[#18181C]/40 focus-visible:outline-none"
              >
                {/* Column 1: Initials/Logo */}
                <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-black text-lg text-white border border-[#232326] shrink-0">
                  {company.name.charAt(0)}
                </div>
                {/* Column 2: Name */}
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base truncate group-hover:text-white transition-colors">
                    {company.name}
                  </h3>
                </div>

                {/* Column 3: Tools Count */}
                <div className="text-sm text-[#A1A1AA] flex items-center gap-1 truncate">
                  <span className="text-[#71717A]">Tools:</span>
                  <span className="font-medium text-white">{company._count?.tools || 0}</span>
                </div>

                {/* Column 4: AI Models Count */}
                <div className="text-sm text-[#A1A1AA] truncate">
                  <span className="sm:hidden text-xs text-[#71717A] mr-1">Models:</span>
                  <span className="font-medium text-white">{company._count?.aiModels || 0}</span>
                </div>

                {/* Column 5: Action Link */}
                <div className="text-right sm:block hidden">
                  <span className="text-xs font-semibold text-[#71717A] group-hover:text-white transition-colors">
                    View Details &rarr;
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-white/5 border border-white/10 hover:bg-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        openEdit(company);
                      }}
                    >
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-xs bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Are you sure you want to delete this company?')) {
                          handleDelete(company.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                  </div>
                )}
              </Link>
            ))}

            {/* Sentinel for infinite scroll */}
            {filteredCompanies.length > 0 && visibleCount < filteredCompanies.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
      
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Company' : 'Add Company'} footer={
        <>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </>
      }>
        <div className="space-y-3">
          <div><label className="text-xs text-[#8A8F98]">Name *</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. OpenAI" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Slug * (unique, lowercase, no spaces)</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="e.g. openai" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} /></div>
          <div><label className="text-xs text-[#8A8F98]">Logo URL (optional)</label><Input className="bg-[#111113] border-[#1C1C1F] text-white" placeholder="https://..." value={formData.logoUrl} onChange={e => setFormData({...formData, logoUrl: e.target.value})} /></div>
        </div>
      </Modal>
    </div>
  );
}
