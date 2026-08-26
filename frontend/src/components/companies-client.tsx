'use client';

import React, { useEffect, useMemo, useState, useRef, useCallback, useTransition } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Company } from "@/lib/types";
import { API_URL, fetchAllCompanies, prefetchUrl } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, X, Filter,
  Bookmark, Share2, ExternalLink, BadgeCheck, Check
} from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import { cn } from "@/lib/utils";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 100;

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

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

const COL_TEMPLATE =
  "grid-cols-[44px_minmax(200px,2.2fr)_minmax(110px,1fr)_minmax(100px,1fr)_minmax(90px,0.9fr)_minmax(80px,0.8fr)_minmax(80px,0.8fr)_minmax(120px,1.1fr)_minmax(70px,0.7fr)_minmax(70px,0.7fr)_44px_44px]";
const COL_MIN_WIDTH = "min-w-[1150px]";

function formatCompanyName(name: string): string {
  if (!name) return "";
  const cleaned = name.replace(/^!\[+/, '').replace(/\]\(.*?\)/g, '').replace(/[\!\[\]]/g, '').trim();
  return cleaned || name;
}

function cleanCompanySlug(slug: string): string {
  if (!slug) return "";
  return slug.replace(/^!\[+/, '').replace(/[\]\(\)]/g, '').trim();
}

function getCompanyLogo(company: Company): string | null {
  if (company.logoUrl && company.logoUrl.trim() && !company.logoUrl.startsWith('![')) return company.logoUrl.trim();
  if (company.tools && company.tools.length > 0) {
    const firstWithLogo = company.tools.find(t => t.logoUrl && t.logoUrl.trim() && !t.logoUrl.startsWith('!['));
    if (firstWithLogo?.logoUrl) return firstWithLogo.logoUrl.trim();
  }
  if (company.website) {
    try {
      const hostname = new URL(company.website.startsWith('http') ? company.website : `https://${company.website}`).hostname;
      if (hostname) return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {}
  }
  return null;
}

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
  return `$${ratio.toFixed(0)}`;
}

function getValEmpNumeric(valuation: string | number | null | undefined, employeeCount: number | null | undefined): number {
  if (!valuation || !employeeCount || employeeCount <= 0) return 0;
  const val = getNumericValuation(valuation);
  return val / employeeCount;
}

function BoolPill({ value, trueLabel = "YES", falseLabel = "NO" }: { value: boolean | null; trueLabel?: string; falseLabel?: string }) {
  if (value === null) return <span className="text-[11px] text-[#71717A] font-mono">—</span>;
  return (
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function LogoCell({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) {
    return <span className="text-xs font-bold text-neutral-900">{name.charAt(0)}</span>;
  }
  return (
    <img
      src={logoUrl}
      alt={name}
      className="h-8 w-8 object-contain"
      onError={() => setFailed(true)}
    />
  );
}

function BookmarkBtn({ companyId, companyName }: { companyId: string; companyName: string }) {
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Sign in required to bookmark companies", {
        description: "Please sign in or create an account to save companies to your bookmarks.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin"),
        },
        duration: 5000,
      });
      return;
    }

    const nextState = !bookmarked;
    setBookmarked(nextState);
    toast.success(nextState ? `Saved ${companyName} to bookmarks` : `Removed ${companyName} from bookmarks`);
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      className={`inline-flex items-center justify-center rounded-md border p-1.5 transition-colors cursor-pointer ${
        bookmarked
          ? "border-[#6E56CF] text-[#6E56CF]"
          : "border-[#232326]/60 bg-[#18181C] text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white"
      }`}
      title={bookmarked ? "Remove bookmark" : "Bookmark company"}
    >
      {bookmarked ? <Check size={14} /> : <Bookmark size={14} />}
    </button>
  );
}

function matchesSubcategory(c: Company, slug: string): boolean {
  if (!slug || slug === "all") return true;
  const slugLower = slug.toLowerCase().replace(/[-_]/g, " ");
  const typeLower = (c.type || []).join(" ").toLowerCase().replace(/[-_]/g, " ");
  const sectorLower = (c.sector || "").toLowerCase();
  const nameLower = (c.name || "").toLowerCase();
  const descLower = (c.description || "").toLowerCase();
  const modelsLower = (c.aiModels || []).map(m => m.name).join(" ").toLowerCase();

  const fullText = `${typeLower} ${sectorLower} ${nameLower} ${descLower} ${modelsLower}`;

  switch (slug) {
    case "ai-model-providers":
    case "model-companies":
      return fullText.includes("model") || fullText.includes("provider") || (c.aiModels && c.aiModels.length > 0) || typeLower.includes("model");
    case "infrastructure":
      return fullText.includes("infra") || fullText.includes("cloud") || fullText.includes("compute") || fullText.includes("chip") || typeLower.includes("infra");
    case "enterprise":
      return fullText.includes("enterprise") || fullText.includes("b2b") || fullText.includes("business") || typeLower.includes("enterprise");
    case "healthcare":
      return fullText.includes("health") || fullText.includes("med") || fullText.includes("bio") || typeLower.includes("health");
    case "generative-ai":
      return fullText.includes("generative") || fullText.includes("genai") || fullText.includes("llm") || fullText.includes("gpt") || typeLower.includes("generative");
    case "marketing":
      return fullText.includes("market") || fullText.includes("seo") || fullText.includes("ad") || typeLower.includes("market");
    case "developer-tools":
      return fullText.includes("dev") || fullText.includes("code") || fullText.includes("git") || typeLower.includes("developer");
    case "robotics":
      return fullText.includes("robot") || fullText.includes("hardware") || typeLower.includes("robot");
    case "education":
      return fullText.includes("edu") || fullText.includes("learn") || typeLower.includes("education");
    case "open-source":
      return fullText.includes("open") || fullText.includes("source") || typeLower.includes("open");
    case "finance":
      return fullText.includes("fin") || fullText.includes("bank") || fullText.includes("trad") || typeLower.includes("finance");
    case "ai-native":
      return typeLower.includes("native") || fullText.includes("ai native");
    case "unicorns":
      return fullText.includes("unicorn") || Boolean(c.valuation && Number(c.valuation) >= 1_000_000_000);
    default:
      return fullText.includes(slugLower);
  }
}

function CompanyRow({
  company,
  index,
  onShare,
}: {
  company: Company;
  index: number;
  onShare: (c: Company) => void;
}) {
  const accentColor = ROW_ACCENT_COLORS[index % ROW_ACCENT_COLORS.length];
  const authenticModels = company.aiModels || [];
  const typesList = company.type || [];
  const hasAiNative = typesList.length > 0 ? typesList.includes('AI_NATIVE') : null;
  const hasProfitable = typesList.length > 0 ? typesList.includes('PROFITABLE') : null;
  const logoSrc = getCompanyLogo(company);
  const cleanName = formatCompanyName(company.name);
  const safeSlug = cleanCompanySlug(company.slug);

  const hasModels = authenticModels.length > 0 || (company._count?.aiModels || 0) > 0;
  const hasTools = (company.tools && company.tools.length > 0) || (company._count?.tools || 0) > 0;

  const derivedAiNative = hasAiNative !== null ? hasAiNative : (hasModels || hasTools ? true : null);
  const derivedSector = company.sector || (hasModels ? "Foundation Models" : (hasTools ? "Generative AI" : null));

  return (
    <Link
      href={`/companies/${safeSlug}`}
      role="listitem"
      className={`group grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-3 transition-all duration-200 focus-visible:outline-none border-b border-[#232326]/60 relative hover:bg-[#131316]/70`}
      onMouseEnter={(e) => {
        prefetchUrl(`${API_URL}/api/v1/companies/${safeSlug}`);
        const el = e.currentTarget;
        el.style.boxShadow = `inset 3px 0 0 ${accentColor}`;
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = accentColor; logoEl.style.boxShadow = `0 0 8px ${accentColor}55`; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "";
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) { logoEl.style.borderColor = ""; logoEl.style.boxShadow = ""; }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = "";
      }}
    >
      {/* Col 1: Logo */}
      <div
        data-logo="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white transition-all duration-200"
      >
        <LogoCell name={cleanName} logoUrl={logoSrc} />
      </div>

      {/* Col 2: Name + Models */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3
            data-name="true"
            className="truncate text-[13px] font-semibold text-white transition-colors duration-200"
          >
            {cleanName}
          </h3>
          {company.verified && (
            <BadgeCheck size={13} className="shrink-0 text-blue-400" aria-label="Verified" />
          )}
          {company.website && (
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#71717A] hover:text-white transition-colors shrink-0"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>
        {authenticModels.length > 0 ? (
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {authenticModels.slice(0, 2).map((m) => (
              <span key={m.id} className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-1.5 py-0.5 text-[9px] font-mono text-[#A1A1AA] truncate max-w-[90px]">
                {m.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-0.5 text-[11px] text-[#71717A] font-mono">—</p>
        )}
      </div>

      {/* Col 3: Country */}
      <div className="min-w-0 text-[11px] font-mono text-[#A1A1AA] truncate">
        {company.country || "—"}
      </div>

      {/* Col 4: Valuation */}
      <div className="text-[11px] font-mono text-white font-medium">
        {formatValuation(company.valuation)}
      </div>

      {/* Col 5: Val/Emp */}
      <div className="text-[11px] font-mono text-[#A1A1AA]">
        {formatValEmp(company.valuation, company.employeeCount)}
      </div>

      {/* Col 6: AI Native */}
      <div>
        <BoolPill value={derivedAiNative} />
      </div>

      {/* Col 7: Profitable */}
      <div>
        <BoolPill value={hasProfitable} />
      </div>

      {/* Col 8: Sector */}
      <div className="min-w-0 text-[11px] font-mono text-[#A1A1AA] truncate">
        {derivedSector || "—"}
      </div>

      {/* Col 9: Models Count */}
      <div className="text-[11px] font-mono text-white font-semibold">
        {company._count?.aiModels || company.aiModels?.length || 0}
      </div>

      {/* Col 10: Tools Count */}
      <div className="text-[11px] font-mono text-white font-semibold">
        {company._count?.tools || company.tools?.length || 0}
      </div>

      {/* Col 11: Share */}
      <div onClick={(e) => e.preventDefault()}>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(company); }}
          className="inline-flex items-center justify-center rounded-md border border-[#232326]/60 bg-[#18181C] p-1.5 text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors cursor-pointer"
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Col 12: Bookmark */}
      <div>
        <BookmarkBtn companyId={company.id} companyName={cleanName} />
      </div>
    </Link>
  );
}

export function CompaniesClient({ defaultCategory }: { defaultCategory?: string }) {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';

  const { data: companiesData, isLoading } = useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: () => fetchAllCompanies(),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000,
  });

  const allCompanies = companiesData || [];
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
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Admin Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', logoUrl: '' });
  const [isSaving, setIsSaving] = useState(false);

  const getAllCompanies = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["companies"] });
  }, [queryClient]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryPopoverRef.current && !countryPopoverRef.current.contains(e.target as Node)) {
        setIsCountryPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filteredAndSorted = useMemo(() => {
    let list = allCompanies;

    if (activeCategorySlug && activeCategorySlug !== "all") {
      list = list.filter((c) => matchesSubcategory(c, activeCategorySlug));
    }

    if (selectedCountry && selectedCountry !== "all") {
      list = list.filter((c) => (c.country || "").toLowerCase() === selectedCountry.toLowerCase());
    }

    if (query) {
      const needle = query.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(needle) ||
        (c.country || "").toLowerCase().includes(needle) ||
        (c.sector || "").toLowerCase().includes(needle)
      );
    }

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
    setCurrentPage(1);
  }, [query, activeCategorySlug, selectedCountry, sortField, sortDir]);

  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

  const handleShare = (company: Company) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/companies/${cleanCompanySlug(company.slug)}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(`Copied ${formatCompanyName(company.name)} link to clipboard!`);
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

  const SortHeader = ({ label, field }: { label: string; field: SortField }) => (
    <button
      type="button"
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 font-mono hover:text-white transition-colors cursor-pointer select-none ${
        sortField === field ? 'text-[#6E56CF]' : 'text-[#A1A1AA]'
      }`}
    >
      <span>{label}</span>
      {sortField === field ? (
        <span className="text-[10px] text-[#6E56CF]">{sortDir === 'desc' ? '↓' : '↑'}</span>
      ) : (
        <span className="text-[10px] opacity-40">↕</span>
      )}
    </button>
  );

  return (
    <>
      <main className="w-full px-2 sm:px-4 py-3 flex-1 flex flex-col selection:bg-neutral-800 selection:text-white">
        <div className="w-full space-y-4">
          {/* Subcategories Horizontal Scrollbar */}
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
                      "rounded-full px-3 py-1 text-xs font-semibold border transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 cursor-pointer",
                      isSelected
                        ? "bg-white text-black border-transparent font-bold shadow-sm"
                        : "bg-[#131316] border-[#232326] text-[#A1A1AA] hover:border-[#6E56CF]/50 hover:text-white"
                    )}
                  >
                    <span>{ct.label}</span>
                  </button>
                );
              })}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <Button className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0" onClick={openAdd}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Company
                </Button>
              </div>
            )}
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

          {/* Companies List Container */}
          {isLoading ? (
            <div className="w-full space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-[#131316]/50 rounded-xl border border-[#232326]/60" />
              ))}
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="text-center py-20 bg-[#111113] rounded-xl border border-[#232326]">
              <p className="text-[#71717A] text-sm">
                {query ? `No companies match "${query}".` : "No companies found."}
              </p>
            </div>
          ) : (
            <div className="w-full rounded-xl border border-[#232326] bg-[#0A0A0C] overflow-hidden shadow-xl">
              <div className="overflow-x-auto relative touch-pan-x">
                {/* Header Row */}
                <div className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-2.5 bg-[#131316] border-b border-[#232326]/60 text-[10px] font-bold font-mono tracking-wider uppercase text-[#A1A1AA]`}>
                  <div></div>
                  <div><SortHeader label="COMPANY" field="name" /></div>
                  <div>
                    <div className="relative" ref={countryPopoverRef}>
                      <button
                        type="button"
                        onClick={() => setIsCountryPopoverOpen(!isCountryPopoverOpen)}
                        className={`flex items-center gap-1 font-mono hover:text-white transition-colors cursor-pointer select-none ${
                          selectedCountry !== 'all' || sortField === 'country' ? 'text-[#6E56CF]' : 'text-[#A1A1AA]'
                        }`}
                      >
                        <span>COUNTRY</span>
                        <Filter size={10} className="ml-0.5" />
                      </button>

                      {isCountryPopoverOpen && (
                        <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-[#232326] bg-[#131316] p-3 shadow-2xl z-50 text-xs normal-case font-sans">
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            placeholder="Search countries..."
                            className="w-full rounded-lg border border-[#232326] bg-[#0A0A0C] px-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:border-[#6E56CF] focus:outline-none mb-2"
                          />
                          <div className="max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
                            <button
                              type="button"
                              onClick={() => { setSelectedCountry('all'); setIsCountryPopoverOpen(false); }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${selectedCountry === 'all' ? 'bg-white text-black font-bold' : 'text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white'}`}
                            >
                              All countries
                            </button>
                            {filteredCountriesList.map((countryName) => (
                              <button
                                key={countryName}
                                type="button"
                                onClick={() => { setSelectedCountry(countryName); setIsCountryPopoverOpen(false); }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold truncate ${selectedCountry.toLowerCase() === countryName.toLowerCase() ? 'bg-white text-black font-bold' : 'text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white'}`}
                              >
                                {countryName}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div><SortHeader label="VALUATION" field="valuation" /></div>
                  <div><SortHeader label="VAL/EMP" field="valEmp" /></div>
                  <div><SortHeader label="AI NATIVE" field="aiNative" /></div>
                  <div><SortHeader label="PROFITABLE" field="profitable" /></div>
                  <div><SortHeader label="SECTOR" field="sector" /></div>
                  <div><SortHeader label="MODELS" field="modelsCount" /></div>
                  <div><SortHeader label="TOOLS" field="toolsCount" /></div>
                  <div>SHARE</div>
                  <div>BOOKMARK</div>
                </div>

                {/* Data Rows */}
                <div role="list" className="divide-y divide-[#232326]/60">
                  {paginatedCompanies.map((company, idx) => (
                    <CompanyRow
                      key={company.id}
                      company={company}
                      index={idx}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              </div>

              {/* 100 Rows Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#131316] border-t border-[#232326]/60 text-xs text-[#A1A1AA]">
                  <div>
                    Showing <span className="font-bold text-white">{(currentPage - 1) * PAGE_SIZE + 1}</span>–<span className="font-bold text-white">{Math.min(currentPage * PAGE_SIZE, filteredAndSorted.length)}</span> of <span className="font-bold text-white">{filteredAndSorted.length.toLocaleString()}</span> companies
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 px-2.5 text-xs font-semibold border-[#232326] bg-[#0A0A0C] hover:bg-[#1A1A1E] text-[#A1A1AA] hover:text-white disabled:opacity-40"
                    >
                      <ChevronLeft size={14} className="mr-1" /> Prev
                    </Button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum = currentPage;
                        if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        if (pageNum < 1 || pageNum > totalPages) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={cn(
                              "h-8 w-8 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center cursor-pointer",
                              currentPage === pageNum
                                ? "bg-white text-black font-bold shadow-sm"
                                : "bg-[#0A0A0C] text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] border border-[#232326]"
                            )}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 px-2.5 text-xs font-semibold border-[#232326] bg-[#0A0A0C] hover:bg-[#1A1A1E] text-[#A1A1AA] hover:text-[#A1A1AA] disabled:opacity-40"
                    >
                      Next <ChevronRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              )}
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
