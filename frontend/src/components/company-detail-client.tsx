'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { fetchCompanyDetails, API_URL, getFromCache } from "@/lib/api";
import { Company } from '@/lib/types';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import {
  MapPin, CheckCircle, Home, ChevronRight, Bell, Globe, Linkedin, Twitter,
  Bookmark, Share2, Building, Sparkles, ExternalLink,
  Layers, Cpu, Briefcase, Code, Newspaper, Video, DollarSign, Award
} from 'lucide-react';
import { Button } from "@/components/ui/shadcn-button";
import { useQuery } from "@tanstack/react-query";

function formatCompanyName(name: string): string {
  if (!name) return "";
  const cleaned = name.replace(/^!\[+/, '').replace(/\]\(.*?\)/g, '').replace(/[\!\[\]]/g, '').trim();
  return cleaned || name;
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

function formatJoinedDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatVideoDuration(seconds: number | null | undefined): string {
  if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatVideoViews(views: number | null | undefined): string {
  if (typeof views !== "number" || !Number.isFinite(views)) return "—";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toLocaleString();
}

function formatVideoDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatToolViews(views: number | null | undefined): string {
  if (typeof views !== "number" || !Number.isFinite(views)) return "—";
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toLocaleString();
}

function formatToolTargetUser(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatToolDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

const formatRobotTag = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

type TabType = 'tools' | 'models' | 'devices' | 'repositories' | 'robots' | 'news' | 'videos' | 'fundraises' | 'investments';

function formatModelDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatModelValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(", ");
  return String(value);
}

function formatModelLabel(value: unknown): string {
  return formatModelValue(value).replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function CompanyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = rawSlug ? rawSlug.replace(/^!\[+/, '').replace(/[\]\(\)]/g, '').trim() : '';
  const { user, isAuthenticated } = useUser();

  const { data: company = null, isLoading } = useQuery<Company | null>({
    queryKey: ["company-detail", slug],
    queryFn: () => fetchCompanyDetails(slug),
    initialData: () => {
      if (!slug) return undefined;
      return getFromCache<Company>(`${API_URL}/api/v1/companies/${encodeURIComponent(slug)}`) || undefined;
    },
    staleTime: 15 * 60 * 1000,
    enabled: Boolean(slug),
  });

  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      toast.error("Sign in required to follow companies", {
        description: "Please sign in or create an account to follow companies.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/signin"),
        },
        duration: 5000,
      });
      return;
    }
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast.success(`You are now following ${formatCompanyName(company?.name || 'this company')}`);
    } else {
      toast.info(`Unfollowed ${formatCompanyName(company?.name || 'this company')}`);
    }
  };

  const handleBookmarkToggle = () => {
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
    setIsBookmarked(!isBookmarked);
    toast.success(!isBookmarked ? "Company saved to bookmarks" : "Removed from bookmarks");
  };

  const handleShareClick = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success(`Copied ${formatCompanyName(company?.name || 'company')} link to clipboard!`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1">

        <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </main>
  
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col flex-1">

        <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-20 flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Company Not Found</h1>
          <p className="text-sm text-[#71717A] max-w-md mb-6">
            The company profile you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/companies"
            className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-neutral-200 transition-colors"
          >
            Back to Companies Directory
          </Link>
        </main>
  
      </div>
    );
  }

  const dash = "—";
  const cleanName = formatCompanyName(company.name);
  const logoSrc = getCompanyLogo(company);

  const toolsCount = company.tools?.length || company._count?.tools || 0;
  const modelsCount = company.aiModels?.length || company._count?.aiModels || 0;
  const companyVideos = ((company as any).videos || []) as any[];
  const videosCount = companyVideos.length || (company as any)._count?.videos || 0;
  const firstTool = company.tools && company.tools.length > 0 ? company.tools[0] : null;
  const sectorName = company.sector || (firstTool as any)?.category || (firstTool as any)?.tags?.[0] || "Artificial Intelligence";
  const companyDesc = company.description || (firstTool as any)?.description || `${cleanName} is an artificial intelligence entity building software solutions.`;
  const typesList = (company.type || []) as string[];
  const isAiNative = typesList.length > 0 ? typesList.includes('AI_NATIVE') : null;
  const isProfitable = typesList.length > 0 ? typesList.includes('PROFITABLE') : null;
  const mostPopularTool = firstTool;
  const locationString = company.city && company.country ? `${company.city}, ${company.country}` : company.country || company.city || dash;

  // Module Navigation Tabs Config (Strict AI Orbit Published Modules: Papers & Jobs Removed)
  const moduleTabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'Tools', count: toolsCount, icon: <Layers size={13} /> },
  { id: 'models', label: 'Models', count: modelsCount, icon: <Sparkles size={13} /> },
  { id: 'devices', label: 'Devices', count: company.devices?.length || 0, icon: <Cpu size={13} /> },
  { id: 'repositories', label: 'Repositories', count: company.repositories?.length || 0, icon: <Code size={13} /> },
  { id: 'robots', label: 'Robots', count: company.robots?.length || 0, icon: <Briefcase size={13} /> },
    { id: 'news', label: 'News', count: 0, icon: <Newspaper size={13} /> },
    { id: 'videos', label: 'Videos', count: videosCount, icon: <Video size={13} /> },
    { id: 'fundraises', label: 'Fundraises', count: 0, icon: <DollarSign size={13} /> },
    { id: 'investments', label: 'Investments', count: 0, icon: <Award size={13} /> },
  ];

  const companyDetails = (
    <>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div className="h-28 w-28 sm:h-48 sm:w-48 lg:h-44 lg:w-44 rounded-[24px] sm:rounded-[30px] bg-[#141418] border border-[#26262B] flex items-center justify-center overflow-hidden p-2 shadow-lg mb-4 sm:mb-6">
            {logoSrc ? (
              <img src={logoSrc} alt={cleanName} className="object-contain w-full h-full rounded-[18px] sm:rounded-[24px]" />
            ) : (
              <span className="text-4xl sm:text-5xl font-black text-white">{cleanName.charAt(0)}</span>
            )}
          </div>
          <div className="min-w-0 flex flex-col items-center">
            <h2 className="text-lg font-extrabold text-white truncate max-w-full">{cleanName}</h2>
            {company.verified && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white mt-1">
                <CheckCircle size={14} className="text-[#6E56CF] fill-[#6E56CF] stroke-black" />
                Verified Company
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-2.5 text-xs text-[#A1A1AA]">
            <MapPin size={15} className="text-[#71717A] shrink-0" />
            <span>{locationString}</span>
          </div>
          {company.foundedYear && (
            <div className="flex items-center gap-2.5 text-xs text-[#A1A1AA]">
              <Building size={15} className="text-[#71717A] shrink-0" />
              <span>Founded {company.foundedYear}</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <Button
            type="button"
            onClick={handleFollowClick}
            className={`w-full h-10 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isFollowing ? "bg-[#232326] text-white border border-[#333338]" : "bg-[#6E56CF] text-white hover:bg-[#7C63E8]"
            }`}
          >
            <Bell size={14} />
            {isFollowing ? "Following" : "Follow"}
          </Button>

          {company.website && (
            <a
              href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 px-4 text-xs font-bold text-white bg-[#131316] hover:bg-[#1A1A1E] border border-[#2C2C32] rounded-xl flex items-center justify-center gap-1.5 transition-all no-underline"
            >
              <Globe size={14} />
              Visit Website
            </a>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleBookmarkToggle}
              className={`h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-[#6E56CF]/10 border-[#6E56CF]/40 text-[#A78BFA]"
                  : "bg-[#131316] border-[#2C2C32] text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E]"
              }`}
              title="Bookmark Company"
            >
              <Bookmark size={15} fill={isBookmarked ? "#6E56CF" : "none"} />
            </button>
            <button
              type="button"
              onClick={handleShareClick}
              className="h-10 rounded-xl bg-[#131316] border border-[#2C2C32] text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1E] flex items-center justify-center transition-all cursor-pointer"
              title="Share Company"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      {(company.linkedinUrl || company.twitterUrl || company.website) && (
        <div className="border-t border-[#1F1F24] p-4 sm:p-6">
          <h3 className="text-xs font-semibold text-[#A1A1AA] mb-3 sm:mb-4">Social Links</h3>
          <div className="space-y-2.5 sm:space-y-3">
            {company.linkedinUrl && (
              <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 text-xs text-[#A1A1AA] hover:text-white transition-colors no-underline">
                <span className="flex items-center gap-2.5"><Linkedin size={15} /> LinkedIn</span>
                <ExternalLink size={13} className="text-[#52525B]" />
              </a>
            )}
            {company.twitterUrl && (
              <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 text-xs text-[#A1A1AA] hover:text-white transition-colors no-underline">
                <span className="flex items-center gap-2.5"><Twitter size={15} /> Twitter</span>
                <ExternalLink size={13} className="text-[#52525B]" />
              </a>
            )}
            {company.website && (
              <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 text-xs text-[#A1A1AA] hover:text-white transition-colors no-underline">
                <span className="flex items-center gap-2.5"><Globe size={15} /> Website</span>
                <ExternalLink size={13} className="text-[#52525B]" />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-[#1F1F24] p-4 sm:p-6">
        <h3 className="text-xs font-semibold text-[#A1A1AA] mb-1.5 sm:mb-2">Joined AIOrbit</h3>
        <p className="text-sm font-bold text-white">{formatJoinedDate(company.createdAt)}</p>
      </div>
    </>
  );

  return (
    <div className="flex flex-col flex-1 bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-10 py-3 sm:py-4 flex-1">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#71717A] flex-wrap">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-[#52525B]" />
          <Link href="/companies" className="hover:text-white transition-colors">
            Companies
          </Link>
          {company.sector && (
            <>
              <ChevronRight size={12} className="text-[#52525B]" />
              <Link
                href={`/companies?filter=${encodeURIComponent(company.sector.toLowerCase())}`}
                className="hover:text-white transition-colors"
              >
                {company.sector}
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-[#52525B]" />
          <div className="flex items-center gap-1.5 text-white font-semibold truncate max-w-[220px] sm:max-w-none">
            {logoSrc ? (
              <img src={logoSrc} alt={cleanName} className="w-4 h-4 object-contain rounded shrink-0" />
            ) : (
              <span className="w-4 h-4 bg-[#232326] rounded text-[10px] flex items-center justify-center font-bold shrink-0">
                {cleanName.charAt(0)}
              </span>
            )}
            <span className="truncate">{cleanName}</span>
          </div>
        </nav>

        {/* Desktop: main content + right company sidebar. The page container provides the outer left/right breathing room. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 lg:gap-7 items-start">
          {/* LEFT / MAIN COLUMN */}
          <div className="min-w-0 space-y-3 sm:space-y-5 lg:col-start-1 lg:row-start-1">
            {/* Company Hero */}
            <section className="bg-[#0D0D10] border border-[#1F1F24] rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-20 w-80 h-80 bg-[#F5C84C]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-40 pointer-events-none overflow-hidden">
                <div className="absolute -top-8 right-8 w-80 h-44 bg-[radial-gradient(circle_at_center,_rgba(110,86,207,0.35)_1px,_transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom_left,black,transparent_75%)]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-end gap-3 flex-wrap mb-4">
  <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white tracking-tight leading-none">
    {cleanName}
  </h1>

  <Link
    href={`/companies?filter=${encodeURIComponent(sectorName.toLowerCase())}`}
className="text-white text-xs font-bold bg-[#1C1C20] border border-[#2B2B30] px-2.5 py-1 rounded-lg hover:border-[#6E56CF] hover:text-[#A78BFA] transition-colors no-underline"  >
    {sectorName}
  </Link>
</div>

                <p className="text-[#A1A1AA] text-sm sm:text-[15px] leading-7 max-w-3xl mb-6">
                  {companyDesc}
                </p>

                {/* Existing company statistics only */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-4 pt-5 border-t border-[#1F1F24]">
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">AI Native</div>
                    <div className="text-sm font-bold">
                      {isAiNative === null ? <span className="text-[#52525B]">{dash}</span> : isAiNative ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Profitable</div>
                    <div className="text-sm font-bold">
                      {isProfitable === null ? <span className="text-[#52525B]">{dash}</span> : isProfitable ? <span className="text-emerald-400">Yes</span> : <span className="text-red-400">No</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Valuation</div>
                    <div className="text-sm font-bold text-white">{formatValuation(company.valuation)}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">$ Raised</div>
                    <div className="text-sm font-bold text-white">{formatValuation(company.fundingRaised)}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Employees</div>
                    <div className="text-sm font-bold text-white">{company.employeeCount ? company.employeeCount.toLocaleString() : dash}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Total Tools</div>
                    <div className="text-sm font-bold text-white">{toolsCount}</div>
                  </div>
                  <div>
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Total Models</div>
                    <div className="text-sm font-bold text-white">{modelsCount}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[#71717A] text-[11px] font-semibold mb-1.5">Flagship Tool</div>
                    {mostPopularTool ? (
                      <div className="inline-flex items-center gap-1.5 bg-[#1C1C20] border border-[#2B2B30] rounded-full px-2.5 py-1 text-white font-semibold text-[11px] max-w-full">
                        {mostPopularTool.logoUrl && <img src={mostPopularTool.logoUrl} alt="" className="w-3.5 h-3.5 object-cover rounded-full shrink-0" />}
                        <span className="truncate">{mostPopularTool.name}</span>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-[#52525B]">{dash}</div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile: company details before module tabs */}
            <section className="lg:hidden bg-[#0D0D10] border border-[#1F1F24] rounded-xl sm:rounded-2xl overflow-hidden">
              {companyDetails}
            </section>

            {/* Company Module Navigation Tabs */}
            <div className="flex items-center gap-1.5 touch-scroll-x scrollbar-none overflow-x-auto pb-3 sm:pb-4 border-b border-[#1F1F24]">
              {moduleTabs.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer whitespace-nowrap flex items-center gap-2 border shrink-0 ${
                      isSelected
                        ? "bg-[#6E56CF] text-white border-[#6E56CF] shadow-md shadow-[#6E56CF]/20"
                        : "bg-[#131316] text-[#A1A1AA] border-[#232326] hover:text-white hover:border-[#333]"
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? "bg-white/15 text-white" : "bg-[#1C1C20] text-[#71717A]"}`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'tools' && (
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      Tools ({toolsCount})
                    </h2>
                  </div>

                  {company.tools && company.tools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {company.tools.map((tool) => {
                        const toolData = tool as any;

                        const dbTags = Array.isArray(toolData.tags)
                          ? toolData.tags
                              .map((item: any) =>
                                item?.tag?.name ||
                                item?.tag?.slug ||
                                item?.name ||
                                item?.slug
                              )
                              .filter(Boolean)
                          : [];

                        const useCaseTags = Array.isArray(toolData.useCases)
                          ? toolData.useCases
                              .map((useCase: any) =>
                                typeof useCase === "string"
                                  ? useCase
                                  : useCase?.name ||
                                    useCase?.label ||
                                    useCase?.title
                              )
                              .filter(Boolean)
                          : [];

                        const taskTags = Array.isArray(toolData.ttasks)
                          ? toolData.ttasks
                              .map((taskItem: any) => {
                                const task = taskItem?.task || taskItem;
                                return task?.title || task?.name || task?.slug || null;
                              })
                              .filter(Boolean)
                          : [];

                        const toolTags = Array.from(
                          new Set([...dbTags, ...useCaseTags, ...taskTags])
                        ).slice(0, 6);

                        const targetUsers = Array.isArray(toolData.targetUsers)
                          ? toolData.targetUsers.filter(Boolean).slice(0, 3)
                          : [];

                        const reviewCount = toolData._count?.reviews || 0;

                        const pricingLabel = toolData.pricingModel || "Freemium";
                        const pricingLower = pricingLabel.toLowerCase();
                        const pricingIsPaid =
                          pricingLower.includes("paid") ||
                          pricingLower.includes("subscription");

                        const toolDate =
                          toolData.releaseDate || toolData.launchDate;

                        return (
                          <Link
                            key={tool.id}
                            href={`/p/tools/${tool.slug}`}
                            className="block group no-underline"
                          >
                            <div className="relative overflow-hidden bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full">
                              <div className="absolute -top-20 -right-20 w-36 h-36 rounded-full bg-[#6E56CF]/5 blur-3xl pointer-events-none" />

                              <div className="relative">
                                {/* Header */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-[#18181C] border border-[#26262B] flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                                      {tool.logoUrl ? (
                                        <img
                                          src={tool.logoUrl}
                                          alt={tool.name}
                                          className="object-cover w-full h-full rounded-lg"
                                        />
                                      ) : (
                                        <span className="text-white font-black text-lg">
                                          {tool.name.charAt(0)}
                                        </span>
                                      )}
                                    </div>

                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                                          {tool.name}
                                        </h3>
                                        <ExternalLink
                                          size={12}
                                          className="text-[#52525B] shrink-0"
                                        />
                                      </div>

                                      <div className="flex items-center gap-2 mt-1">
                                        {toolData.verified && (
                                          <span className="text-[9px] font-semibold text-[#A78BFA]">
                                            Verified
                                          </span>
                                        )}
                                        {toolData.isTrending && (
                                          <span className="text-[9px] font-semibold text-[#F5C84C]">
                                            Trending
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <span
                                    className={`inline-flex shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border ${
                                      pricingIsPaid
                                        ? "text-[#F5C84C] bg-[#F5C84C]/10 border-[#F5C84C]/30"
                                        : "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
                                    }`}
                                  >
                                    {pricingLabel}
                                  </span>
                                </div>

                                {/* Short description */}
                                <p className="text-xs text-[#8A8F98] leading-5 line-clamp-2 min-h-[40px] mt-4">
                                  {toolData.description || "AI solution listed on AIOrbit."}
                                </p>

                                {/* Tags / use cases / tasks */}
                                {toolTags.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {toolTags.map((tag: string) => (
                                      <span
                                        key={tag}
                                        className="inline-flex items-center rounded-full border border-[#29292F] bg-[#15151A] px-2 py-1 text-[9px] font-semibold text-[#A1A1AA]"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Target users */}
                                {targetUsers.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                                    <span className="text-[9px] uppercase tracking-[0.08em] text-[#52525B]">
                                      For
                                    </span>
                                    {targetUsers.map((userType: string) => (
                                      <span
                                        key={userType}
                                        className="inline-flex items-center rounded-full bg-[#18181C] border border-[#29292F] px-2 py-1 text-[9px] font-medium text-[#A1A1AA]"
                                      >
                                        {formatToolTargetUser(userType)}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Bottom metadata */}
                                <div className="mt-4 pt-3 border-t border-[#1F1F24] flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0 flex-wrap">
                                    {toolDate && (
                                      <span className="text-[10px] text-[#71717A] whitespace-nowrap">
                                        Released {formatToolDate(toolDate)}
                                      </span>
                                    )}

                                    {typeof toolData.avgRating === "number" &&
                                      Number.isFinite(toolData.avgRating) &&
                                      toolData.avgRating > 0 && (
                                        <span className="inline-flex items-center gap-1 text-[10px] text-[#A1A1AA] whitespace-nowrap">
                                          <span className="text-[#F5C84C]">★</span>
                                          {toolData.avgRating.toFixed(1)}
                                          {reviewCount > 0
                                            ? ` · ${reviewCount} reviews`
                                            : ""}
                                        </span>
                                      )}

                                    {typeof toolData.views === "number" &&
                                      Number.isFinite(toolData.views) &&
                                      toolData.views > 0 && (
                                        <span className="text-[10px] text-[#71717A] whitespace-nowrap">
                                          {formatToolViews(toolData.views)} views
                                        </span>
                                      )}
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {toolData.hasApi && (
                                      <span className="text-[9px] font-bold text-[#A78BFA] bg-[#6E56CF]/10 border border-[#6E56CF]/25 px-1.5 py-0.5 rounded">
                                        API
                                      </span>
                                    )}

                                    {toolData.isOpenSource && (
                                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-1.5 py-0.5 rounded">
                                        Open Source
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}

                    </div>
                  ) : (
                    <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
                      No public AI tools listed yet for {cleanName}.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'models' && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-5">Models ({modelsCount})</h2>
                  {Array.isArray(company.aiModels) && company.aiModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {company.aiModels.map((model: any) => {
                        const m = model as any;
                        const capabilities = Array.isArray(m.capabilities) ? m.capabilities.filter(Boolean).map(String).slice(0, 4) : [];
                        const releaseDate = formatModelDate(m.releaseDate);
                        const modelType = formatModelLabel(m.modelType);
                        const primaryTask = formatModelLabel(m.primaryTask);
                        const modality = formatModelLabel(m.modality);
                        const parameterSize = formatModelValue(m.parameterSize);
                        const contextWindow = formatModelValue(m.contextWindow);
                        const hasApi = m.apiAvailable === true || m.hasApi === true;
                        const isOpenSource = m.openSource === true;

                        return (
                          <Link key={m.id} href={m.slug ? `/models/${m.slug}` : "#"} className={`block group no-underline${m.slug ? "" : " pointer-events-none"}`}>
                            <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full flex flex-col">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="min-w-0">
                                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">{m.name}</h3>
                                  <p className="text-[10px] text-[#71717A] mt-1">{cleanName}</p>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-[#52525B] group-hover:text-[#A78BFA] shrink-0 mt-0.5" />
                              </div>

                              <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 line-clamp-2 min-h-[34px]">{m.description || "AI model listed on AIOrbit."}</p>

                              {(modelType || primaryTask || modality) && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {modelType && <span className="text-[9px] font-semibold text-[#C4B5FD] bg-[#6E56CF]/10 border border-[#6E56CF]/20 px-2 py-1 rounded-md">{modelType}</span>}
                                  {primaryTask && <span className="text-[9px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] border border-[#28282E] px-2 py-1 rounded-md">{primaryTask}</span>}
                                  {modality && <span className="text-[9px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] border border-[#28282E] px-2 py-1 rounded-md">{modality}</span>}
                                </div>
                              )}

                              {(parameterSize || contextWindow) && (
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  {parameterSize && <div className="rounded-lg bg-[#111116] border border-[#202026] px-2.5 py-2"><p className="text-[8px] uppercase tracking-wider text-[#52525B]">Parameters</p><p className="text-[10px] font-semibold text-[#D4D4D8] mt-0.5 truncate">{parameterSize}</p></div>}
                                  {contextWindow && <div className="rounded-lg bg-[#111116] border border-[#202026] px-2.5 py-2"><p className="text-[8px] uppercase tracking-wider text-[#52525B]">Context</p><p className="text-[10px] font-semibold text-[#D4D4D8] mt-0.5 truncate">{contextWindow}</p></div>}
                                </div>
                              )}

                              {capabilities.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {capabilities.map((capability: string) => <span key={capability} className="text-[9px] text-[#A1A1AA] bg-[#17171C] border border-[#26262C] px-1.5 py-0.5 rounded">{formatModelLabel(capability)}</span>)}
                                </div>
                              )}

                              <div className="mt-auto pt-3 border-t border-[#1B1B20] flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">{releaseDate && <span className="text-[9px] text-[#71717A]">Released {releaseDate}</span>}</div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {hasApi && <span className="text-[9px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] border border-[#28282E] px-1.5 py-0.5 rounded">API</span>}
                                  {isOpenSource && <span className="text-[9px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] border border-[#28282E] px-1.5 py-0.5 rounded">Open Source</span>}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">No foundation models listed yet for {cleanName}.</div>
                  )}
                </div>
              )}

              {activeTab === 'devices' && (
  <div>
    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-5">
      Devices ({company.devices?.length || 0})
    </h2>

    {company.devices && company.devices.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {company.devices.map((device: any) => (
          <div
            key={device.id}
            className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {device.name}
              </h3>

              {device.availability && (
                <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded border text-emerald-400 bg-emerald-400/10 border-emerald-400/30">
                  {device.availability}
                </span>
              )}
            </div>

            {device.description && (
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 line-clamp-3">
                {device.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {device.category && (
                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                  {device.category}
                </span>
              )}

              {device.year && (
                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                  {device.year}
                </span>
              )}

              {device.price && (
                <span className="text-[10px] font-semibold text-[#F5C84C] bg-[#F5C84C]/10 px-2 py-1 rounded border border-[#F5C84C]/30">
                  {device.price}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
        No public devices listed yet for {cleanName}.
      </div>
    )}
  </div>
)}

{activeTab === 'repositories' && (
  <div>
    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-5">
      Repositories ({company.repositories?.length || 0})
    </h2>

    {company.repositories && company.repositories.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {company.repositories.map((repo: any) => {
          const repoTopics = Array.isArray(repo.topics)
            ? repo.topics
                .map((topic: any) =>
                  typeof topic === "string"
                    ? topic
                    : topic?.name || topic?.label || topic?.slug
                )
                .filter(Boolean)
                .slice(0, 6)
            : [];

          const stars =
            typeof repo.stars === "number" && Number.isFinite(repo.stars)
              ? repo.stars
              : null;

          const forks =
            typeof repo.forks === "number" && Number.isFinite(repo.forks)
              ? repo.forks
              : null;

          const language = repo.language || null;
          const license = repo.license || repo.licenseName || null;

          const formatCount = (value: number) => {
            if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
            if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
            return value.toLocaleString();
          };

          return (
            <Link
              key={repo.id}
              href={
                repo.slug
                  ? `/repositories/${repo.slug}`
                  : `/repositories/${repo.id}`
              }
              className="block group no-underline"
            >
              <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full flex flex-col">
                {/* Name */}
                <div className="mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                    {repo.name}
                  </h3>
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="text-xs text-[#8A8F98] leading-relaxed mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                {/* Language / stars / forks */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {language && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#A78BFA] bg-[#6E56CF]/10 border border-[#6E56CF]/25 px-2 py-1 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                      {language}
                    </span>
                  )}

                  {stars !== null && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F5C84C] bg-[#F5C84C]/10 border border-[#F5C84C]/25 px-2 py-1 rounded-md">
                      <span>★</span>
                      {formatCount(stars)}
                    </span>
                  )}

                  {forks !== null && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2 py-1 rounded-md">
                      <span>⑂</span>
                      {formatCount(forks)}
                    </span>
                  )}
                </div>

                {/* Topics */}
                {repoTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {repoTopics.map((topic: string) => (
                      <span
                        key={topic}
                        className="inline-flex items-center rounded-full border border-[#29292F] bg-[#15151A] px-2 py-1 text-[9px] font-semibold text-[#A1A1AA]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* License */}
                {license && (
                  <div className="mt-auto pt-3 border-t border-[#1F1F24]">
                    <span className="text-[10px] font-semibold text-[#71717A]">
                      License:{" "}
                      <span className="text-[#D4D4D8]">{license}</span>
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    ) : (
      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
        No public repositories listed yet for {cleanName}.
      </div>
    )}
  </div>
)}

{activeTab === 'robots' && (
  <div>
    <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-5">
      Robots ({company.robots?.length || 0})
    </h2>

    {company.robots && company.robots.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {company.robots.map((robot: any) => (
          <div
            key={robot.id}
            className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all"
          >
            <div className="mb-1">
              <Link
                href={`/robots/${robot.slug}`}
                className="text-sm sm:text-base font-bold text-white hover:text-[#A78BFA] transition-colors no-underline"
              >
                {robot.name}
              </Link>
            </div>

            {robot.mainTask && (
              <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 line-clamp-2">
                {robot.mainTask}
              </p>
            )}

            {robot.availability && (
              <div className="mb-3">
                <span className="inline-flex text-[10px] font-bold px-2 py-1 rounded border text-emerald-400 bg-emerald-400/10 border-emerald-400/30">
                  {formatRobotTag(robot.availability)}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {robot.category && (
                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                  {formatRobotTag(robot.category)}
                </span>
              )}

              {robot.autonomyLevel && (
                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                  {formatRobotTag(robot.autonomyLevel)}
                </span>
              )}
            </div>

            {(robot.country || robot.price) && (
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#1F1F24]">
                <span className="text-[10px] font-semibold text-[#A1A1AA]">
                  {robot.country || "—"}
                </span>

                {robot.price ? (
                  <span className="text-[10px] font-bold text-[#F5C84C]">
                    {robot.price}
                  </span>
                ) : (
                  <span className="text-[10px] text-[#52525B]">—</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
        No public robots listed yet for {cleanName}.
      </div>
    )}
  </div>
)}

{activeTab === 'news' && (
  <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
    <p className="font-semibold text-white mb-1">No news listed yet</p>
    <p className="text-xs text-[#52525B]">
      There are currently no public news records indexed for {cleanName}.
    </p>
  </div>
)}

{activeTab === 'videos' && (
  <div>
    <div className="flex items-center justify-between gap-4 mb-3 sm:mb-4">
      <h2 className="text-xl sm:text-2xl font-extrabold text-white">
        Videos ({videosCount})
      </h2>
    </div>

    {companyVideos.length > 0 ? (
      <div className="w-full overflow-x-auto rounded-2xl border border-[#1F1F24] bg-[#0D0D10]">
        <div className="min-w-[1080px]">
          <div className="grid grid-cols-[minmax(390px,2.4fr)_125px_95px_75px_105px_135px_minmax(180px,1fr)_76px] items-center gap-4 px-5 py-3 border-b border-[#1F1F24] text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-white">
            <div>Name</div>
            <div>Posted <span className="text-[#52525B]">⌄</span></div>
            <div>Duration</div>
            <div>Views</div>
            <div>Level</div>
            <div>CATEGORY</div>
            <div>CHANNEL</div>
            <div className="text-right">Actions</div>
          </div>

          <div>
            {companyVideos.map((video: any) => {
              const videoUrl = video.youtubeId
                ? `https://www.youtube.com/watch?v=${video.youtubeId}`
                : video.url || "#";

              const categoryStyles: Record<string, { color: string; backgroundColor: string; borderColor: string }> = {
                "generative ai": { color: "#D8CCFF", backgroundColor: "rgba(110, 86, 207, 0.28)", borderColor: "rgba(139, 117, 232, 0.55)" },
                "developer tools": { color: "#C4E2FF", backgroundColor: "rgba(72, 126, 176, 0.28)", borderColor: "rgba(111, 166, 208, 0.55)" },
                "productivity": { color: "#FFE3A3", backgroundColor: "rgba(181, 138, 58, 0.28)", borderColor: "rgba(196, 154, 74, 0.55)" },
                "marketing": { color: "#F0C7F4", backgroundColor: "rgba(154, 94, 172, 0.28)", borderColor: "rgba(184, 120, 196, 0.55)" },
                "design": { color: "#D2DDF2", backgroundColor: "rgba(113, 134, 170, 0.28)", borderColor: "rgba(143, 164, 201, 0.55)" },
                "education": { color: "#D0E9C8", backgroundColor: "rgba(95, 138, 88, 0.28)", borderColor: "rgba(121, 169, 111, 0.55)" },
                "business": { color: "#E7D0C1", backgroundColor: "rgba(145, 107, 88, 0.30)", borderColor: "rgba(177, 136, 112, 0.55)" },
                "research": { color: "#D2DCEB", backgroundColor: "rgba(101, 116, 138, 0.28)", borderColor: "rgba(132, 149, 178, 0.55)" },
              };

              const category = video.toolCategory
                ? String(video.toolCategory)
                    .replace(/[-_]/g, " ")
                    .replace(/\b\w/g, (char: string) => char.toUpperCase())
                    .trim()
                : "—";

              const categoryStyle =
                categoryStyles[category.toLowerCase()] || {
                  color: "#D4D4D8",
                  backgroundColor: "rgba(82, 82, 91, 0.22)",
                  borderColor: "rgba(113, 113, 122, 0.45)",
                };

              const level = video.level || video.difficulty || "—";

              return (
                <div
                  key={video.id}
                  className="grid grid-cols-[minmax(390px,2.4fr)_125px_95px_75px_105px_135px_minmax(180px,1fr)_76px] items-center gap-4 px-5 py-3.5 border-b border-[#17171B] last:border-b-0 hover:bg-[#111116] transition-colors"
                >
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex items-center gap-3 group no-underline"
                  >
                    <div className="relative w-[126px] h-[70px] rounded-lg overflow-hidden bg-[#18181C] border border-[#26262B] shrink-0">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video size={18} className="text-[#52525B]" />
                        </div>
                      )}

                      {video.durationSeconds ? (
                        <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {formatVideoDuration(video.durationSeconds)}
                        </span>
                      ) : null}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors line-clamp-2">
                          {video.title || "Untitled video"}
                        </span>
                        <ExternalLink size={12} className="text-[#52525B] shrink-0" />
                      </div>
                    </div>
                  </a>

                  <div className="text-xs text-[#A1A1AA] whitespace-nowrap">
                    {formatVideoDate(video.publishedAt)}
                  </div>

                  <div className="text-xs text-[#A1A1AA] tabular-nums whitespace-nowrap">
                    {formatVideoDuration(video.durationSeconds)}
                  </div>

                  <div className="text-xs text-[#A1A1AA] tabular-nums whitespace-nowrap">
                    {formatVideoViews(video.views)}
                  </div>

                  <div className="text-xs text-[#A1A1AA] whitespace-nowrap">
                    {level}
                  </div>

                  <div className="min-w-0">
                    <span
                      className="inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold truncate"
                      style={{
                        color: categoryStyle.color,
                        backgroundColor: categoryStyle.backgroundColor,
                        borderColor: categoryStyle.borderColor,
                      }}
                    >
                      {category}
                    </span>
                  </div>

                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 flex items-center gap-2 group/channel no-underline"
                  >
                    {video.authorAvatar ? (
                      <img
                        src={video.authorAvatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover border border-[#29292F] shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#1C1C20] border border-[#29292F] flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {(video.authorName || "?").charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-white truncate group-hover/channel:text-[#A78BFA] transition-colors">
                      {video.authorName || "Unknown channel"}
                    </span>
                    <ExternalLink size={11} className="text-[#52525B] shrink-0" />
                  </a>

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(videoUrl);
                          toast.success("Video link copied to clipboard!");
                        }
                      }}
                      className="h-9 w-9 rounded-xl bg-[#1A1A1E] border border-[#2A2A30] text-[#A1A1AA] hover:text-white hover:bg-[#222228] flex items-center justify-center transition-colors cursor-pointer"
                      title="Share video"
                    >
                      <Share2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isAuthenticated) {
                          toast.error("Sign in required to bookmark videos", {
                            description: "Please sign in or create an account to save videos.",
                            action: {
                              label: "Sign In",
                              onClick: () => router.push("/auth/signin"),
                            },
                            duration: 5000,
                          });
                          return;
                        }

                        toast.success("Video saved to bookmarks");
                      }}
                      className="h-9 w-9 rounded-xl bg-[#1A1A1E] border border-[#2A2A30] text-[#A1A1AA] hover:text-white hover:bg-[#222228] flex items-center justify-center transition-colors cursor-pointer"
                      title="Bookmark video"
                    >
                      <Bookmark size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    ) : (
      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
        <p className="font-semibold text-white mb-1">No videos listed yet</p>
        <p className="text-xs text-[#52525B]">
          There are currently no public videos indexed for {cleanName}.
        </p>
      </div>
    )}
  </div>
)}

{activeTab === 'fundraises' && (
  <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
    <p className="font-semibold text-white mb-1">No fundraises listed yet</p>
    <p className="text-xs text-[#52525B]">
      There are currently no public fundraise records indexed for {cleanName}.
    </p>
  </div>
)}

{activeTab === 'investments' && (
  <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
    <p className="font-semibold text-white mb-1">No investments listed yet</p>
    <p className="text-xs text-[#52525B]">
      There are currently no public investment records indexed for {cleanName}.
    </p>
  </div>
)}
            </div>
          </div>

          {/* RIGHT / COMPANY SIDEBAR */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 bg-[#0D0D10] border border-[#1F1F24] rounded-2xl overflow-hidden">
            {companyDetails}
          </aside>
        </div>
      </main>
    </div>
  );
}
