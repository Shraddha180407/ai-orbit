'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Company, CompanyType } from "@/lib/types";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { fetchAllCompanies, API_URL } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, ChevronDown, ArrowUpDown, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import Image from "next/image";
import { cn } from "@/lib/utils";

const COMPANY_TYPES: { label: string; value: string; slug: string }[] = [
  { label: "All", value: "ALL", slug: "all" },
  { label: "AI Model Providers", value: "AI_MODEL_PROVIDERS", slug: "ai-model-providers" },
  { label: "Infrastructure", value: "INFRASTRUCTURE", slug: "infrastructure" },
  { label: "Enterprise", value: "ENTERPRISE", slug: "enterprise" },
  { label: "Healthcare", value: "HEALTHCARE", slug: "healthcare" },
  { label: "Generative AI", value: "GENERATIVE_AI", slug: "generative-ai" },
  { label: "Marketing", value: "MARKETING", slug: "marketing" },
  { label: "Developer Tools", value: "DEVELOPER_TOOLS", slug: "developer-tools" },
  { label: "Robotics", value: "ROBOTICS", slug: "robotics" },
  { label: "Education", value: "EDUCATION", slug: "education" },
  { label: "Open Source", value: "OPEN_SOURCE", slug: "open-source" },
  { label: "Finance", value: "FINANCE", slug: "finance" },
  { label: "AI Native", value: "AI_NATIVE", slug: "ai-native" },
  { label: "Model Companies", value: "MODEL_COMPANIES", slug: "model-companies" },
  { label: "Unicorns", value: "UNICORNS", slug: "unicorns" }
];

type SortField = 'name' | 'country' | 'valuation' | 'valEmp' | 'aiNative' | 'profitable' | 'sector' | 'modelsCount' | 'toolsCount';
type SortDir = 'asc' | 'desc';

function formatValuation(val: string | number | null | undefined): string {
  if (!val) return "—";
  const num = Number(val);
  if (isNaN(num) || num <= 0) return typeof val === "string" ? val : "—";
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num}`;
}

function getNumericValuation(val: string | number | null | undefined): number {
  if (!val) return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

function formatValEmp(valuation: string | number | null | undefined, employeeCount: number | null | undefined): string {
  if (!valuation || !employeeCount || employeeCount <= 0) return "—";
  const val = getNumericValuation(valuation);
  if (val <= 0) return "—";
  const ratio = val / employeeCount;
  if (ratio >= 1_000_000_000) return `$${(ratio / 1_000_000_000).toFixed(2)}B`;
  if (ratio >= 1_000_000) return `$${(ratio / 1_000_000).toFixed(2)}M`;
  if (ratio >= 1_000) return `$${(ratio / 1_000).toFixed(2)}K`;
  return `$${Math.round(ratio)}`;
}

function getValEmpNumeric(valuation: string | number | null | undefined, employeeCount: number | null | undefined): number {
  if (!valuation || !employeeCount || employeeCount <= 0) return 0;
  const val = getNumericValuation(valuation);
  return val / employeeCount;
}

function TypeBadge({ status }: { status: boolean | null }) {
  if (status === null) return <span className="text-xs text-[#52525B]">—</span>;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${status ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
      {status ? "Yes" : "No"}
    </span>
  );
}

function matchesSubcategory(c: Company, slug: string): boolean {
  if (!slug || slug === "all") return true;
  const slugNorm = slug.toLowerCase().replace(/-/g, "_");
  const types = Array.isArray(c.type) ? c.type : [];
  const typeStrings = types.map((t) => String(t).toLowerCase());
  const typeLower = (c.companyType || "").toLowerCase();
  const sectorLower = (c.sector || "").toLowerCase();
  const descLower = (c.description || "").toLowerCase();
  const nameLower = (c.name || "").toLowerCase();
  const fullText = `${typeStrings.join(" ")} ${typeLower} ${sectorLower} ${descLower} ${nameLower}`;

  const matchItem = COMPANY_TYPES.find(
    (ct) =>
      ct.slug === slug ||
      ct.value.toLowerCase() === slug.toLowerCase() ||
      ct.value.toLowerCase() === slugNorm ||
      ct.slug === slug.toLowerCase().replace(/_/g, "-")
  );
  if (matchItem && matchItem.value !== "ALL") {
    const enumValLower = matchItem.value.toLowerCase();
    if (typeStrings.includes(enumValLower)) return true;
  }

  switch (slug.toLowerCase()) {
    case "ai-model-providers":
    case "model-companies":
      return (
        typeStrings.includes("ai_model_providers") ||
        typeStrings.includes("model_companies") ||
        typeLower.includes("model") ||
        Boolean(c.modelsCount && c.modelsCount > 0) ||
        (Array.isArray(c.aiModels) && c.aiModels.length > 0) ||
        false
      );
    case "infrastructure":
      return typeStrings.includes("infrastructure") || sectorLower.includes("infra") || fullText.includes("hardware") || fullText.includes("compute") || fullText.includes("cloud");
    case "enterprise":
      return typeStrings.includes("enterprise") || typeStrings.includes("enterprise_ai") || sectorLower.includes("enterprise") || fullText.includes("b2b") || fullText.includes("corporate");
    case "healthcare":
      return typeStrings.includes("healthcare") || sectorLower.includes("health") || fullText.includes("medical") || fullText.includes("biotech") || fullText.includes("clinical");
    case "generative-ai":
      return typeStrings.includes("generative_ai") || sectorLower.includes("generative") || fullText.includes("genai") || fullText.includes("llm") || fullText.includes("creative");
    case "marketing":
      return typeStrings.includes("marketing") || sectorLower.includes("marketing") || fullText.includes("advertising") || fullText.includes("seo") || fullText.includes("sales");
    case "developer-tools":
      return typeStrings.includes("developer_tools") || sectorLower.includes("developer") || sectorLower.includes("dev") || fullText.includes("api") || fullText.includes("sdk") || fullText.includes("coding");
    case "robotics":
      return typeStrings.includes("robotics") || sectorLower.includes("robot") || fullText.includes("autonomous") || fullText.includes("automation");
    case "education":
      return typeStrings.includes("education") || sectorLower.includes("edu") || fullText.includes("learning") || fullText.includes("training") || fullText.includes("tutor");
    case "open-source":
      return typeStrings.includes("open_source") || sectorLower.includes("open") || fullText.includes("oss") || fullText.includes("github") || fullText.includes("weights");
    case "finance":
      return typeStrings.includes("finance") || sectorLower.includes("fin") || fullText.includes("fin") || fullText.includes("bank") || fullText.includes("trad");
    case "ai-native":
      return typeStrings.includes("ai_native") || sectorLower.includes("native") || fullText.includes("native") || fullText.includes("ai native");
    case "unicorns":
      return typeStrings.includes("unicorns") || fullText.includes("unicorn") || Boolean(c.valuation && Number(c.valuation) >= 1_000_000_000);
    default:
      return fullText.includes(slugNorm) || fullText.includes(slug.toLowerCase());
  }
}

export function CompaniesClient({ defaultCategory }: { defaultCategory?: string }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';

  const { data: companiesData, isLoading, isPlaceholderData } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => fetchAllCompanies(),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const allCompanies = companiesData || [];
  const [visibleCount, setVisibleCount] = useState(30);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState((searchParams.get("q") || "").trim());

  const urlSortParam = searchParams.get("sort");
  const urlFilterParam = searchParams.get("filter") || searchParams.get("category");

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(() => {
    return defaultCategory || urlFilterParam || "all";
  });

  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>("");
  const countryPopoverRef = useRef<HTMLDivElement>(null);

  const [sortField, setSortField] = useState<SortField>('valuation');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // React to top-right header SortDropdown URL parameter changes
  useEffect(() => {
    if (urlSortParam) {
      if (urlSortParam === "name-asc") { setSortField("name"); setSortDir("asc"); }
      else if (urlSortParam === "name-desc") { setSortField("name"); setSortDir("desc"); }
      else if (urlSortParam === "oldest") { setSortField("valuation"); setSortDir("asc"); }
      else if (urlSortParam === "rating" || urlSortParam === "top-rated") { setSortField("modelsCount"); setSortDir("desc"); }
      else { setSortField("valuation"); setSortDir("desc"); }
    }
  }, [urlSortParam]);

  useEffect(() => {
    if (urlFilterParam) {
      setActiveCategorySlug(urlFilterParam);
    }
  }, [urlFilterParam]);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getAllCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["companies"] });
  }, [queryClient]);

  // Click outside to close country popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPopoverRef.current && !countryPopoverRef.current.contains(e.target as Node)) {
        setIsCountryPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute unique countries from DB for Country popover filter
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    allCompanies.forEach((c) => {
      if (c.country && c.country.trim()) set.add(c.country.trim());
    });
    return Array.from(set).sort();
  }, [allCompanies]);

  const filteredCountriesList = useMemo(() => {
    if (!countrySearch.trim()) return availableCountries;
    const q = countrySearch.toLowerCase();
    return availableCountries.filter((c) => c.toLowerCase().includes(q));
  }, [availableCountries, countrySearch]);

  // Instant Client-Side Subcategory, Country, Search, and Sort
  const filteredAndSorted = useMemo(() => {
    let list = allCompanies;

    // 1. Subcategory filter
    if (activeCategorySlug && activeCategorySlug !== "all") {
      list = list.filter((c) => matchesSubcategory(c, activeCategorySlug));
    }

    // 2. Country filter
    if (selectedCountry && selectedCountry !== "all") {
      list = list.filter((c) => (c.country || "").toLowerCase() === selectedCountry.toLowerCase());
    }

    // 3. Search query
    if (query) {
      const needle = query.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(needle) ||
        (c.country || "").toLowerCase().includes(needle) ||
        (c.sector || "").toLowerCase().includes(needle)
      );
    }

    // 4. Sort
    list = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'country':
          cmp = (a.country || "").localeCompare(b.country || "");
          break;
        case 'valuation':
          cmp = getNumericValuation(a.valuation) - getNumericValuation(b.valuation);
          break;
        case 'valEmp':
          cmp = getValEmpNumeric(a.valuation, a.employeeCount) - getValEmpNumeric(b.valuation, b.employeeCount);
          break;
        case 'aiNative':
          const aNative = (a.type || []).includes('AI_NATIVE') ? 1 : 0;
          const bNative = (b.type || []).includes('AI_NATIVE') ? 1 : 0;
          cmp = aNative - bNative;
          break;
        case 'profitable':
          const aProf = (a.type || []).includes('PROFITABLE') ? 1 : 0;
          const bProf = (b.type || []).includes('PROFITABLE') ? 1 : 0;
          cmp = aProf - bProf;
          break;
        case 'sector':
          cmp = (a.sector || "").localeCompare(b.sector || "");
          break;
        case 'modelsCount':
          cmp = (a._count?.aiModels || a.aiModels?.length || 0) - (b._count?.aiModels || b.aiModels?.length || 0);
          break;
        case 'toolsCount':
          cmp = (a._count?.tools || a.tools?.length || 0) - (b._count?.tools || b.tools?.length || 0);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [allCompanies, activeCategorySlug, selectedCountry, query, sortField, sortDir]);

  useEffect(() => {
    setVisibleCount(30);
  }, [query, activeCategorySlug, selectedCountry]);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= filteredAndSorted.length) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => prev + 30);
      }
    }, { threshold: 0.1 });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);
    return () => { if (currentSentinel) observer.unobserve(currentSentinel); };
  }, [isLoading, visibleCount, filteredAndSorted.length]);

  const visibleCompanies = filteredAndSorted.slice(0, visibleCount);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const handleSubcategoryClick = (slug: string) => {
    setActiveCategorySlug(slug);
    if (typeof window !== "undefined") {
      const url = slug === "all" ? "/companies" : `/companies/${slug}`;
      window.history.pushState(null, "", url);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const url = editingId ? `${API_URL}/api/admin/companies/${editingId}` : `${API_URL}/api/admin/companies`;
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), credentials: 'include' });
      if (!res.ok) throw new Error('Failed to save company');
      toast.success(editingId ? 'Company updated successfully' : 'Company added successfully');
      setIsModalOpen(false);
      getAllCompanies();
    } catch (error: any) { toast.error(error.message); }
    finally { setIsSaving(false); }
  };

  const openAdd = () => { setEditingId(null); setFormData({ name: '', slug: '', logoUrl: '' }); setIsModalOpen(true); };

  const SortableHeader = ({ label, field, className = '' }: { label: string; field: SortField; className?: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold hover:text-white transition-colors cursor-pointer select-none ${sortField === field ? 'text-[#F5A623]' : 'text-[#71717A]'} ${className}`}
    >
      {label}
      {sortField === field && (
        <ChevronDown className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} />
      )}
      {sortField !== field && <ArrowUpDown className="w-3 h-3 opacity-40" />}
    </button>
  );

  return (
    <>
      <main className="w-full px-2 sm:px-4 py-3 flex-1 flex flex-col selection:bg-neutral-800 selection:text-white">
        <div className="w-full space-y-4">
          {/* Subcategories Horizontal Scrollbar & Search Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0 flex-1 w-full">
              {COMPANY_TYPES.map((ct) => {
                const isSelected = activeCategorySlug === ct.slug;
                return (
                  <button
                    key={ct.slug}
                    type="button"
                    onClick={() => handleSubcategoryClick(ct.slug)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[12px] font-semibold border transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-white text-black border-transparent font-bold shadow-sm"
                        : "bg-[#131316] border-[#232326] text-[#A1A1AA] hover:border-[#F5A623]/50 hover:text-white"
                    )}
                  >
                    <span>{ct.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-full max-w-[280px]">
                <div className="relative w-full rounded-lg border border-[#232326]/80 bg-[#111113] h-[34px] flex items-center px-3 focus-within:border-[#F5A623] focus-within:ring-2 focus-within:ring-[#F5A623]/20 transition-all duration-150">
                  <Search size={13} className="mr-2 text-[#71717A] shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full bg-transparent text-xs text-white placeholder:text-[#71717A] focus:outline-none font-sans"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="text-[#71717A] hover:text-white text-xs font-bold px-1 py-0.5 rounded transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {isAdmin && (
                <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Company
                </Button>
              )}
            </div>
          </div>

          {/* Active Filter Pills Bar */}
          {selectedCountry !== "all" && (
            <div className="flex items-center gap-2 pb-2">
              <span className="text-xs text-[#71717A]">Country:</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#232326] bg-[#131316] px-2.5 py-1 text-xs font-medium text-white">
                {selectedCountry}
                <button onClick={() => setSelectedCountry("all")} className="text-[#71717A] hover:text-white">
                  <X size={12} />
                </button>
              </span>
            </div>
          )}

          {/* Companies Table */}
          {isLoading ? (
            <div className="w-full space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-[#131316]/50 rounded-xl border border-[#1C1C1F]" />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-20 bg-[#111113] rounded-xl border border-[#232326]">
              <p className="text-[#71717A] text-sm">
                {query ? `No companies match "${query}".` : "No companies found."}
              </p>
            </div>
          ) : (
            <div className={`w-full rounded-xl border border-[#232326] bg-[#0A0A0C] overflow-hidden transition-opacity duration-150 ${isPlaceholderData ? "opacity-60" : "opacity-100"}`}>
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-[minmax(260px,2.2fr)_140px_120px_120px_90px_90px_150px_70px_70px] gap-3 items-center px-4 py-3 bg-[#131316] border-b border-[#232326] min-w-[1150px]">
                  <SortableHeader label="Company" field="name" />

                  {/* Country Header with Searchable Popover Dropdown matching theresanaiforthat */}
                  <div className="relative" ref={countryPopoverRef}>
                    <button
                      type="button"
                      onClick={() => setIsCountryPopoverOpen(!isCountryPopoverOpen)}
                      className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold hover:text-white transition-colors cursor-pointer select-none ${
                        selectedCountry !== 'all' || sortField === 'country' ? 'text-[#F5A623]' : 'text-[#71717A]'
                      }`}
                    >
                      <span>Country</span>
                      <Filter size={11} className="ml-0.5" />
                      <ChevronDown size={12} className={`transition-transform ${isCountryPopoverOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Country Search & Filter Popover */}
                    {isCountryPopoverOpen && (
                      <div className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-[#232326] bg-[#131316] p-3 shadow-2xl z-50">
                        <div className="relative mb-2.5">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search countries..."
                            className="w-full rounded-lg border border-[#232326] bg-[#0A0A0C] px-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:border-[#F5A623] focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center justify-between border-b border-[#232326] pb-2 mb-2">
                          <button
                            onClick={() => { toggleSort('country'); }}
                            className="text-[11px] text-[#A1A1AA] hover:text-white flex items-center gap-1"
                          >
                            <span>Sort {sortDir === 'asc' ? 'A-Z' : 'Z-A'}</span>
                            <ArrowUpDown size={11} />
                          </button>

                          {selectedCountry !== 'all' && (
                            <button
                              onClick={() => { setSelectedCountry('all'); setIsCountryPopoverOpen(false); }}
                              className="text-[11px] text-[#F5A623] hover:underline"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                          <button
                            type="button"
                            onClick={() => { setSelectedCountry('all'); setIsCountryPopoverOpen(false); }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              selectedCountry === 'all' ? 'bg-white text-black font-bold' : 'text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white'
                            }`}
                          >
                            All countries
                          </button>

                          {filteredCountriesList.map((countryName) => (
                            <button
                              key={countryName}
                              type="button"
                              onClick={() => { setSelectedCountry(countryName); setIsCountryPopoverOpen(false); }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors truncate ${
                                selectedCountry.toLowerCase() === countryName.toLowerCase()
                                  ? 'bg-white text-black font-bold'
                                  : 'text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white'
                              }`}
                            >
                              {countryName}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <SortableHeader label="Valuation" field="valuation" />
                  <SortableHeader label="Val/Emp" field="valEmp" />
                  <SortableHeader label="AI Native" field="aiNative" />
                  <SortableHeader label="Profitable" field="profitable" />
                  <SortableHeader label="Sector" field="sector" />
                  <SortableHeader label="Models" field="modelsCount" className="justify-end" />
                  <SortableHeader label="Tools" field="toolsCount" className="justify-end" />
                </div>

                {/* Table Body */}
                {visibleCompanies.map((company) => {
                  const authenticModels = company.aiModels || [];
                  const typesList = company.type || [];
                  const hasAiNative = typesList.length > 0 ? typesList.includes('AI_NATIVE') : null;
                  const hasProfitable = typesList.length > 0 ? typesList.includes('PROFITABLE') : null;

                  return (
                    <Link
                      key={company.id}
                      href={`/companies/${company.slug}`}
                      className="group grid grid-cols-[minmax(260px,2.2fr)_140px_120px_120px_90px_90px_150px_70px_70px] gap-3 items-center px-4 py-3 border-b border-[#1C1C1F] last:border-b-0 hover:bg-[#131316]/70 transition-colors min-w-[1150px]"
                    >
                      {/* Company Name + Separate Small Logo Box + Authentic Models/Tags */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Separate small square logo box matching Tools */}
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-[#141418] border border-[#26262B] p-1.5 flex items-center justify-center shadow-sm overflow-hidden">
                          {company.logoUrl ? (
                            <img src={company.logoUrl} alt={company.name} className="object-contain w-full h-full rounded" />
                          ) : (
                            <span className="text-sm font-black text-white">{company.name.charAt(0)}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-white truncate group-hover:text-[#F5A623] transition-colors">{company.name}</h3>
                          {/* Authentic Models / Tags strictly from DB */}
                          {authenticModels.length > 0 ? (
                            <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                              {authenticModels.slice(0, 3).map((m) => (
                                <span
                                  key={m.id}
                                  className="text-[10px] text-[#A1A1AA] bg-[#1A1A1E] border border-[#2A2A2E] rounded px-1.5 py-0.5 truncate max-w-[110px]"
                                >
                                  {m.name}
                                </span>
                              ))}
                              {authenticModels.length > 3 && (
                                <span className="text-[10px] text-[#71717A]">+{authenticModels.length - 3}</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-[10px] text-[#52525B]">—</div>
                          )}
                        </div>
                      </div>

                      {/* Country */}
                      <div className="text-xs text-[#A1A1AA] truncate">
                        {company.country || "—"}
                      </div>

                      {/* Valuation */}
                      <div className="text-xs text-white font-medium">
                        {formatValuation(company.valuation)}
                      </div>

                      {/* Val/Emp */}
                      <div className="text-xs text-white font-medium">
                        {formatValEmp(company.valuation, company.employeeCount)}
                      </div>

                      {/* AI Native */}
                      <div>
                        <TypeBadge status={hasAiNative} />
                      </div>

                      {/* Profitable */}
                      <div>
                        <TypeBadge status={hasProfitable} />
                      </div>

                      {/* Sector */}
                      <div className="text-xs text-[#A1A1AA] truncate">
                        {company.sector || "—"}
                      </div>

                      {/* Models count */}
                      <div className="text-xs text-white font-medium text-right">
                        {company._count?.aiModels || company.aiModels?.length || 0}
                      </div>

                      {/* Tools count */}
                      <div className="text-xs text-white font-medium text-right">
                        {company._count?.tools || company.tools?.length || 0}
                      </div>
                    </Link>
                  );
                })}

                {/* Sentinel for infinite scroll */}
                {filteredAndSorted.length > 0 && visibleCount < filteredAndSorted.length && (
                  <div ref={sentinelRef} className="h-16 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

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
    </>
  );
}
