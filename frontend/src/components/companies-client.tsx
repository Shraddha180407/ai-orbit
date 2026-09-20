'use client';

import React, { useMemo, useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Company } from "@/lib/types";
import { API_URL, fetchCompanies, prefetchUrl } from "@/lib/api";
import { useUser } from "@/hooks/use-user";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Plus, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, X, Filter,
  Bookmark, Share2, ExternalLink, BadgeCheck, Check
} from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";
import { useQuery, keepPreviousData, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 100;

const ROW_ACCENT_COLORS = [
  "#6E56CF", "#E85D4A", "#0082FB", "#34A853",
  "#FF9900", "#E91E8C", "#00BCD4", "#FF6B35",
];

type CompanyCategory = { label: string; value: string; slug: string };

function formatCategoryLabel(value: string): string {
  return value
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCategorySlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SortField = 'valuation' | 'valEmp' | 'name' | 'country' | 'sector' | 'modelsCount' | 'toolsCount' | 'aiNative' | 'profitable';
type SortDir = 'asc' | 'desc';

const COL_TEMPLATE = "grid-cols-[44px_minmax(180px,2fr)_minmax(90px,1fr)_minmax(90px,1fr)_minmax(90px,1fr)_minmax(75px,0.8fr)_minmax(75px,0.8fr)_minmax(120px,1.2fr)_minmax(65px,0.7fr)_minmax(65px,0.7fr)_44px_44px]";
const COL_MIN_WIDTH = "min-w-[1050px]";

function formatCompanyName(name: string): string {
  if (!name) return "";
  return name.replace(/^!\[+/, '').replace(/\]\(.*?\)/g, '').replace(/[\!\[\]]/g, '').trim();
}

function cleanCompanySlug(slug: string): string {
  if (!slug) return "";
  return slug.replace(/^!\[+/, '').replace(/\]\(.*?\)/g, '').replace(/[\!\[\]]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function getCompanyLogo(company: Company): string | null {
  if (company.logoUrl && company.logoUrl.trim()) return company.logoUrl;
  return null;
}

function isGoogleFaviconUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === "google.com" || parsed.hostname.endsWith(".google.com")) &&
      parsed.pathname.includes("/s2/favicons")
    );
  } catch {
    return false;
  }
}

function getGoogleFaviconDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("domain") || parsed.searchParams.get("domain_url");
  } catch {
    return null;
  }
}

/**
 * Google’s s2 favicon endpoint can return a generic globe with HTTP 200
 * when a site has no discoverable favicon. For those URLs only, validate
 * against Google's underlying faviconV2 endpoint: a real favicon loads,
 * while a missing favicon returns an image error. Other logo URLs are
 * trusted exactly as provided.
 */
function hasUsableCompanyLogo(company: Company): Promise<boolean> {
  const logoUrl = getCompanyLogo(company);

  if (!logoUrl) return Promise.resolve(false);
  if (!isGoogleFaviconUrl(logoUrl)) return Promise.resolve(true);

  const domain = getGoogleFaviconDomain(logoUrl);
  if (!domain) return Promise.resolve(false);

  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;

    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timeout = window.setTimeout(() => finish(false), 5000);

    img.onload = () => {
      window.clearTimeout(timeout);
      finish(true);
    };

    img.onerror = () => {
      window.clearTimeout(timeout);
      finish(false);
    };

    img.src =
      `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON` +
      `&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(
        domain.startsWith("http") ? domain : `https://${domain}`
      )}&size=32`;
  });
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
    <span className="inline-flex items-center rounded-full border border-[#232326]/60 bg-[#18181C] px-2.5 py-0.5 text-[10px] font-mono font-semibold text-[#A1A1AA] hover:border-[#3a3a3d] hover:text-white transition-colors">
      {value ? trueLabel : falseLabel}
    </span>
  );
}

function LogoCell({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) {
    return <span className="text-sm font-bold text-neutral-900">{name.charAt(0)}</span>;
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

  const types = Array.isArray(c.type) ? c.type : [];

  for (const t of types) {
    if (t && t.toLowerCase().replace(/[-_]/g, " ").includes(slugLower)) return true;
  }

  if (c.sector && c.sector.toLowerCase().replace(/[-_]/g, " ").includes(slugLower)) return true;
  if (c.description && c.description.toLowerCase().includes(slugLower)) return true;

  return false;
}

function ClearFilterChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="shrink-0 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/10 px-1 py-0.5 text-[7px] leading-none font-medium normal-case tracking-normal text-[#A1A1AA] hover:text-white hover:border-[#6E56CF] transition-colors"
      title="Clear filter"
    >
      Clear filter
    </button>
  );
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
        if (logoEl) {
          logoEl.style.borderColor = accentColor;
          logoEl.style.boxShadow = `0 0 8px ${accentColor}55`;
        }
        const nameEl = el.querySelector<HTMLElement>('[data-name="true"]');
        if (nameEl) nameEl.style.color = accentColor;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.boxShadow = "";
        const logoEl = el.querySelector<HTMLElement>('[data-logo="true"]');
        if (logoEl) {
          logoEl.style.borderColor = "";
          logoEl.style.boxShadow = "";
        }
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
            <BadgeCheck size={14} className="shrink-0 text-blue-400" aria-label="Verified" />
          )}

          {company.website && (
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#71717A] hover:text-white transition-colors shrink-0"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>

        {authenticModels.length > 0 ? (
          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
            {authenticModels.slice(0, 2).map((m) => (
              <span
                key={m.id}
                className="inline-flex items-center rounded-md border border-[#232326]/60 bg-[#18181C] px-2 py-0.5 text-[9px] font-mono text-[#A1A1AA] truncate max-w-[100px]"
              >
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShare(company);
          }}
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

  const searchParams = useSearchParams();
  const [query, setQuery] = useState((searchParams.get("q") || "").trim());

  const urlSortParam = searchParams.get("sort");
  const urlFilterParam = searchParams.get("filter") || searchParams.get("category");

  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(() => {
    return defaultCategory || urlFilterParam || "all";
  });

  const subCatContainerRef = useRef<HTMLDivElement>(null);
  const subCatRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [allCompanyCountries, setAllCompanyCountries] = useState<string[]>([]);
  const [companySectors, setCompanySectors] = useState<CompanyCategory[]>([]);
  const countryPopoverRef = useRef<HTMLDivElement>(null);

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Company name filter
  const [isCompanyNamePopoverOpen, setIsCompanyNamePopoverOpen] = useState(false);
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [companyNameFilter, setCompanyNameFilter] = useState("");
  const companyNamePopoverRef = useRef<HTMLDivElement>(null);

  const [aiNativeFilter, setAiNativeFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(100);

  const matchedSector = useMemo(() => {
    if (!activeCategorySlug || activeCategorySlug === "all") return undefined;
    const matched = companySectors.find((sector) => sector.slug === activeCategorySlug);
    return matched?.value;
  }, [activeCategorySlug, companySectors]);

  /*
   * Load the complete company directory once and filter/sort it locally.
   *
   * This is deliberate: the directory has several UI-only filters
   * (especially AI Native = No and the COMPANY name popup). Applying them
   * to an already-paginated API response caused filters to appear broken.
   * We now have one source dataset, then:
   *   1. category
   *   2. country
   *   3. company name
   *   4. AI Native
   *   5. general search
   *   6. sorting
   *   7. pagination
   */
  const { data: companiesResponse, isLoading, isFetching } = useQuery<any>({
    queryKey: [
      "companies",
      currentPage,
      pageSize,
      query,
      companyNameFilter,
      activeCategorySlug,
      selectedCountry,
      sortField,
      sortDir,
    ],
    queryFn: async () => {
      const sort =
        sortField === "valuation"
          ? (sortDir === "asc" ? "valuation-asc" : "valuation-desc")
          : sortField === "name"
            ? (sortDir === "asc" ? "name-asc" : "name-desc")
            : undefined;

      const country =
        selectedCountry !== "all" ? selectedCountry : undefined;

      /*
       * Fetch the complete server-side result set first, then apply the
       * logo-only filter and client-side pagination. This keeps pagination
       * accurate: every page contains only companies that have a logo, and
       * total/totalPages also count only those companies.
       */
      const serverQuery = companyNameFilter.trim()
        ? companyNameFilter.trim()
        : query.trim() || undefined;

      const firstResponse = await fetchCompanies({
        page: 1,
        pageSize: 200,
        q: serverQuery,
        country,
        sort,
      });

      const firstCompanies: Company[] = Array.isArray(firstResponse)
        ? (firstResponse as Company[])
        : ((firstResponse?.companies || []) as Company[]);

      let candidates = firstCompanies;

      const totalPagesFromApi =
        typeof firstResponse?.totalPages === "number"
          ? firstResponse.totalPages
          : firstCompanies.length < 200
            ? 1
            : undefined;

      if (totalPagesFromApi !== undefined && totalPagesFromApi > 1) {
        const responses = await Promise.all(
          Array.from({ length: totalPagesFromApi - 1 }, (_, index) =>
            fetchCompanies({
              page: index + 2,
              pageSize: 200,
              q: serverQuery,
              country,
              sort,
            })
          )
        );

        for (const response of responses) {
          const companies: Company[] = Array.isArray(response)
            ? (response as Company[])
            : ((response?.companies || []) as Company[]);

          candidates = candidates.concat(companies);
        }
      }

      // Filter by the actual Sector field from the DB.
      if (matchedSector) {
        candidates = candidates.filter((company) => {
          return (company.sector || "").trim() === matchedSector;
        });
      }

      // Only companies with a genuinely usable logo are eligible.
      // Normal logo URLs are kept untouched. Google favicon URLs get a
      // targeted fallback check so only generic-globe results are removed.
      const logoChecks = await Promise.all(
        candidates.map(async (company) => ({
          company,
          hasLogo: await hasUsableCompanyLogo(company),
        }))
      );

      const logoCompanies = logoChecks
        .filter(({ hasLogo }) => hasLogo)
        .map(({ company }) => company);

      // When the company-name filter is active, keep the existing exact
      // name-focused behavior after the server-side candidate search.
      const matchingCompanies = companyNameFilter.trim()
        ? logoCompanies.filter((company) =>
            formatCompanyName(String(company?.name ?? ""))
              .trim()
              .toLocaleLowerCase()
              .includes(companyNameFilter.trim().toLocaleLowerCase())
          )
        : logoCompanies;

      const startIndex = (currentPage - 1) * pageSize;

      return {
        companies: matchingCompanies.slice(startIndex, startIndex + pageSize),
        total: matchingCompanies.length,
        page: currentPage,
        pageSize,
        totalPages: Math.max(
          1,
          Math.ceil(matchingCompanies.length / pageSize)
        ),
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const allCompanies: Company[] = Array.isArray(companiesResponse)
    ? companiesResponse
    : (companiesResponse?.companies || []);

  const totalCount =
    typeof companiesResponse?.total === "number"
      ? companiesResponse.total
      : allCompanies.length;

  const totalPages =
    typeof companiesResponse?.totalPages === "number"
      ? companiesResponse.totalPages
      : Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedCompanies: Company[] = allCompanies;

  useEffect(() => {
    if (urlSortParam) {
      if (urlSortParam === "name-asc") {
        setSortField("name");
        setSortDir("asc");
      } else if (urlSortParam === "name-desc") {
        setSortField("name");
        setSortDir("desc");
      } else if (urlSortParam === "oldest") {
        setSortField("valuation");
        setSortDir("asc");
      } else if (urlSortParam === "rating" || urlSortParam === "top-rated") {
        setSortField("modelsCount");
        setSortDir("desc");
      } else {
        setSortField("valuation");
        setSortDir("desc");
      }
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

      if (companyNamePopoverRef.current && !companyNamePopoverRef.current.contains(e.target as Node)) {
        setIsCompanyNamePopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCountries = async () => {
      try {
        const firstResponse = await fetchCompanies({
          page: 1,
          pageSize: 200,
        });

        const firstCompanies: Company[] = Array.isArray(firstResponse)
          ? (firstResponse as Company[])
          : ((firstResponse?.companies || []) as Company[]);

        const countries = new Set<string>();
        const sectors = new Set<string>();

        const collectCompanyMetadata = (companies: Company[]) => {
          companies.forEach((company) => {
            const country = company.country?.trim();
            if (country) countries.add(country);

            const sector = company.sector?.trim();
            if (sector) sectors.add(sector);
          });
        };

        collectCompanyMetadata(firstCompanies);

        const totalPagesFromApi =
          typeof firstResponse?.totalPages === "number"
            ? firstResponse.totalPages
            : firstCompanies.length < 200
              ? 1
              : undefined;

        if (totalPagesFromApi !== undefined && totalPagesFromApi > 1) {
          const responses = await Promise.all(
            Array.from({ length: totalPagesFromApi - 1 }, (_, index) =>
              fetchCompanies({
                page: index + 2,
                pageSize: 200,
              })
            )
          );

          responses.forEach((response) => {
            const companies: Company[] = Array.isArray(response)
              ? (response as Company[])
              : ((response?.companies || []) as Company[]);

            collectCompanyMetadata(companies);
          });
        }

        if (!cancelled) {
          setAllCompanyCountries(Array.from(countries).sort());
          setCompanySectors(
            Array.from(sectors)
              .sort((a, b) => a.localeCompare(b))
              .map((value) => ({
                label: formatCategoryLabel(value),
                value,
                slug: getCategorySlug(value),
              }))
          );
        }
      } catch {
        // Current-page countries remain as fallback.
      }
    };

    loadCountries();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableCountries = useMemo(() => {
    if (allCompanyCountries.length > 0) return allCompanyCountries;

    const set = new Set<string>();

    allCompanies.forEach((company) => {
      if (company.country && company.country.trim()) {
        set.add(company.country.trim());
      }
    });

    return Array.from(set).sort();
  }, [allCompanyCountries, allCompanies]);

  const filteredCountriesList = useMemo(() => {
    if (!countrySearch.trim()) return availableCountries;

    const q = countrySearch.toLowerCase();

    return availableCountries.filter((c) =>
      c.toLowerCase().includes(q)
    );
  }, [availableCountries, countrySearch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, companyNameFilter, activeCategorySlug, selectedCountry, pageSize]);

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
    const container = subCatContainerRef.current;
    const clickedButton = subCatRefs.current[slug];

    if (container && clickedButton) {
      const buttons = Array.from(
        container.querySelectorAll("button")
      ) as HTMLButtonElement[];

      const containerRect = container.getBoundingClientRect();

      // Count partially visible chips too. This is important because
      // a cut-off chip can still be clicked and should trigger scrolling.
      const visibleButtons = buttons.filter((button) => {
        const rect = button.getBoundingClientRect();

        return (
          rect.right > containerRect.left &&
          rect.left < containerRect.right
        );
      });

      const clickedVisibleIndex = visibleButtons.indexOf(clickedButton);

      const hasHiddenLeft = container.scrollLeft > 1;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const hasHiddenRight = container.scrollLeft < maxScrollLeft - 1;

      // If a clicked chip is among the last 3 visible chips, move
      // the row left so the next chips become visible.
      if (
        hasHiddenRight &&
        clickedVisibleIndex >= 0 &&
        clickedVisibleIndex >= visibleButtons.length - 3
      ) {
        const scrollAmount = Math.min(
          container.clientWidth * 0.25,
          maxScrollLeft - container.scrollLeft
        );

        container.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
      // If a clicked chip is among the first 3 visible chips, move
      // the row right so the previous chips become visible.
      else if (
        hasHiddenLeft &&
        clickedVisibleIndex >= 0 &&
        clickedVisibleIndex <= 2
      ) {
        const scrollAmount = Math.min(
          container.clientWidth * 0.25,
          container.scrollLeft
        );

        container.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      }
    }

    setActiveCategorySlug(slug);

    if (typeof window !== "undefined") {
      const url = slug === "all" ? "/companies" : `/companies/${slug}`;
      window.history.pushState(null, "", url);
    }
  };

  const handleShare = (company: Company) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/companies/${cleanCompanySlug(company.slug)}`
        : "";

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(
        `Copied ${formatCompanyName(company.name)} link to clipboard!`
      );
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const url = editingId
        ? `${API_URL}/api/admin/companies/${editingId}`
        : `${API_URL}/api/admin/companies`;

      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to save company');

      toast.success(
        editingId
          ? 'Company updated successfully'
          : 'Company added successfully'
      );

      setIsModalOpen(false);
      getAllCompanies();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', logoUrl: '' });
    setIsModalOpen(true);
  };

  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: SortField;
  }) => (
    <button
      type="button"
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 font-mono hover:text-white transition-colors cursor-pointer select-none ${
        sortField === field ? 'text-white' : 'text-[#A1A1AA]'
      }`}
    >
      <span>{label}</span>

      {sortField === field ? (
        <span className="text-[10px] text-white">
          {sortDir === 'desc' ? '↓' : '↑'}
        </span>
      ) : (
        <span className="text-[10px] opacity-40">↕</span>
      )}
    </button>
  );

  return (
    <>
      <main className="w-full px-3 sm:px-6 lg:px-8 py-3 flex-1 flex flex-col selection:bg-neutral-800 selection:text-white">
        <div className="w-full space-y-4">

          {/* Subcategories Horizontal Scrollbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div
              ref={subCatContainerRef}
              className="flex items-center gap-1.5 touch-scroll-x scrollbar-none pb-1 md:pb-0 flex-1 w-auto sm:w-full -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto scroll-smooth"
            >
              {[{ label: "All", value: "ALL", slug: "all" }, ...companySectors].map((ct) => {
                const isSelected = activeCategorySlug === ct.slug;

                return (
                  <div
                    key={ct.slug}
                    className="flex items-center gap-1 shrink-0"
                  >
                    <button
                      ref={(el) => {
                        subCatRefs.current[ct.slug] = el;
                      }}
                      type="button"
                      onClick={() => handleSubcategoryClick(ct.slug)}
                      className={cn(
                        "rounded-full h-6 px-4 text-xs font-semibold border transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0",
                        isSelected
                          ? "bg-white text-black border-white font-bold shadow-sm"
                          : "bg-[#0D0D0F] border-[#232326] text-[#A1A1AA] hover:border-[#3A3A3D] hover:text-white hover:bg-[#141416]"
                      )}
                    >
                      <span>{ct.label}</span>
                    </button>

                  </div>
                );
              })}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  className="bg-white text-black hover:bg-neutral-200 h-8 text-xs font-bold px-3 rounded-lg shrink-0"
                  onClick={openAdd}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Company
                </Button>
              </div>
            )}
          </div>

          {/* Companies List Container */}
          {isLoading || isFetching && allCompanies.length === 0 ? (
            <div className="w-full space-y-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse bg-[#131316]/50 rounded-xl border border-[#232326]/60"
                />
              ))}
            </div>
          ) : allCompanies.length === 0 ? (
            <div className="text-center py-20 bg-[#111113] rounded-xl border border-[#232326]">
              <p className="text-[#71717A] text-sm">
                {companyNameFilter
                  ? `No companies match "${companyNameFilter}".`
                  : query
                    ? `No companies match "${query}".`
                    : "No companies found."}
              </p>
            </div>
          ) : (
            <div className="w-full rounded-xl border border-[#232326] bg-[#0A0A0C] overflow-hidden shadow-xl">
              <div className="overflow-x-auto touch-scroll-x relative">

                {/* Header Row */}
                <div
                  className={`grid ${COL_TEMPLATE} ${COL_MIN_WIDTH} items-center gap-3 px-4 py-2.5 bg-[#131316] border-b border-[#232326]/60 text-[10px] font-bold font-mono tracking-wider uppercase text-[#A1A1AA]`}
                >
                  <div></div>

                  <div>
                    <div
                      className="relative"
                      ref={companyNamePopoverRef}
                    >
                      <div className="flex items-center gap-1">
                        {/* Existing company-name sort */}
                        <SortHeader label="COMPANY" field="name" />

                        {companyNameFilter && (
                          <ClearFilterChip
                            onClick={() => {
                              setCompanyNameFilter("");
                              setCompanyNameInput("");
                              setCurrentPage(1);
                            }}
                          />
                        )}

                        {/* Company-name filter */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompanyNameInput(companyNameFilter);
                            setIsCompanyNamePopoverOpen(
                              (open) => !open
                            );
                          }}
                          className={`flex items-center justify-center transition-colors cursor-pointer ${
                            companyNameFilter
                              ? "text-[#6E56CF]"
                              : "text-[#71717A] hover:text-white"
                          }`}
                          aria-label="Filter by company name"
                          title="Filter by name"
                        >
                          <Filter size={12} />
                        </button>
                      </div>

                      {isCompanyNamePopoverOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 w-[190px] rounded-xl border border-[#232326] bg-[#18181C] p-2 shadow-2xl z-[60] text-xs normal-case font-sans flex flex-col gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            autoFocus
                            type="text"
                            value={companyNameInput}
                            onChange={(e) =>
                              setCompanyNameInput(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                setCompanyNameFilter(
                                  companyNameInput.trim()
                                );
                                setIsCompanyNamePopoverOpen(false);
                              }
                            }}
                            placeholder="Filter by name..."
                            className="w-full h-7 shrink-0 rounded-md border border-[#6E56CF] bg-[#131316] px-2 text-xs text-white placeholder:text-[#71717A] focus:outline-none focus:ring-0"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              setCompanyNameFilter(
                                companyNameInput.trim()
                              );
                              setIsCompanyNamePopoverOpen(false);
                            }}
                            className="w-full h-7 shrink-0 rounded-md bg-[#6E56CF] text-white text-xs font-semibold hover:bg-[#7C66DF] transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div
                      className="relative"
                      ref={countryPopoverRef}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setIsCountryPopoverOpen(
                            !isCountryPopoverOpen
                          )
                        }
                        className={`flex items-center gap-1 font-mono hover:text-white transition-colors cursor-pointer select-none ${
                          selectedCountry !== 'all'
                            ? 'text-[#6E56CF]'
                            : 'text-[#A1A1AA]'
                        }`}
                      >
                        <span>COUNTRY</span>
                        <Filter size={12} className="ml-0.5" />

                        {selectedCountry !== "all" && (
                          <ClearFilterChip
                            onClick={() => {
                              setSelectedCountry("all");
                              setCountrySearch("");
                              setCurrentPage(1);
                            }}
                          />
                        )}
                      </button>

                      {isCountryPopoverOpen && (
                        <div
                          className="absolute left-0 top-full mt-2 w-[220px] rounded-xl border border-[#232326] bg-[#131316] p-2.5 shadow-2xl z-[70] text-xs normal-case font-sans"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={countrySearch}
                            onChange={(e) =>
                              setCountrySearch(e.target.value)
                            }
                            placeholder="Search countries..."
                            className="w-full h-9 rounded-lg border border-[#232326] bg-[#0A0A0C] px-3 text-xs leading-9 text-white placeholder:text-[#71717A] focus:border-[#6E56CF] focus:outline-none mb-2"
                          />

                          <div className="max-h-[150px] overflow-y-auto overflow-x-hidden pr-1">
                            <div className="flex flex-col gap-0.5">
                              {selectedCountry !== "all" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry("all");
                                    setCountrySearch("");
                                    setCurrentPage(1);
                                    setIsCountryPopoverOpen(false);
                                  }}
                                  className="w-full h-7 shrink-0 flex items-center rounded-md px-2 text-left text-[11px] leading-none font-semibold text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white"
                                >
                                  Clear filter
                                </button>
                              )}

                              {filteredCountriesList.map(
                                (countryName) => (
                                  <button
                                    key={countryName}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(countryName);
                                      setCurrentPage(1);
                                      setIsCountryPopoverOpen(false);
                                    }}
                                    className={`w-full h-7 shrink-0 flex items-center rounded-md px-2 text-left text-[11px] leading-none font-semibold truncate ${
                                      selectedCountry.toLowerCase() ===
                                      countryName.toLowerCase()
                                        ? "bg-white text-black font-bold"
                                        : "text-[#A1A1AA] hover:bg-[#1A1A1E] hover:text-white"
                                    }`}
                                  >
                                    <span className="truncate">
                                      {countryName}
                                    </span>
                                  </button>
                                )
                              )}

                              {filteredCountriesList.length === 0 && (
                                <div className="px-2 py-3 text-[11px] text-[#71717A]">
                                  No countries found
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <SortHeader label="VALUATION" field="valuation" />
                  </div>

                  <div>
                    <SortHeader label="VAL/EMP" field="valEmp" />
                  </div>

                  <div className="font-mono">AI NATIVE</div>
                  <div className="font-mono">PROFITABLE</div>
                  <div className="font-mono">SECTOR</div>

                  <div>
                    <SortHeader label="MODELS" field="modelsCount" />
                  </div>

                  <div>
                    <SortHeader label="TOOLS" field="toolsCount" />
                  </div>

                  <div>SHARE</div>
                  <div>BOOKMARK</div>
                </div>

                {/* Data Rows */}
                <div
                  role="list"
                  className="divide-y divide-[#232326]/60"
                >
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

              {/* Unified Floating Pill Pagination */}
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={(p) => {
                  handlePageChange(p);
                  const target = document.getElementById(
                    "companies-container"
                  );
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </main>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Company' : 'Add Company'}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#8A8F98]">
              Name *
            </label>

            <Input
              className="bg-[#111113] border-[#1C1C1F] text-white"
              placeholder="e.g. OpenAI"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs text-[#8A8F98]">
              Slug * (unique, lowercase, no spaces)
            </label>

            <Input
              className="bg-[#111113] border-[#1C1C1F] text-white"
              placeholder="e.g. openai"
              value={formData.slug}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  slug: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-xs text-[#8A8F98]">
              Logo URL (optional)
            </label>

            <Input
              className="bg-[#111113] border-[#1C1C1F] text-white"
              placeholder="https://..."
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  logoUrl: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
}