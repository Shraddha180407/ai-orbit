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

const formatRobotTag = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

type TabType = 'tools' | 'models' | 'devices' | 'repositories' | 'robots' | 'news' | 'videos' | 'fundraises' | 'investments';

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
    { id: 'videos', label: 'Videos', count: 0, icon: <Video size={13} /> },
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
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">Tools ({toolsCount})</h2>
                  </div>
                  {company.tools && company.tools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {company.tools.map((tool) => (
                        <Link key={tool.id} href={`/p/tools/${tool.slug}`} className="block group no-underline">
                          <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#18181C] border border-[#26262B] flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                                {tool.logoUrl ? (
                                  <img src={tool.logoUrl} alt={tool.name} className="object-cover w-full h-full rounded-lg" />
                                ) : (
                                  <span className="text-white font-black text-lg">{tool.name.charAt(0)}</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
  <div className="flex items-center gap-2 min-w-0">
    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
      {tool.name}
    </h3>
    <ExternalLink size={13} className="text-[#52525B] shrink-0" />
  </div>

  <span
    className={`inline-flex shrink-0 text-[10px] font-bold px-2 py-1 rounded border ${
      (tool.pricingModel || "").toLowerCase().includes("paid")
        ? "text-[#F5C84C] bg-[#F5C84C]/10 border-[#F5C84C]/30"
        : "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    }`}
  >
    {tool.pricingModel || "Freemium"}
  </span>
</div>
                                
                                <p className="text-xs text-[#8A8F98] leading-relaxed mt-2 line-clamp-3">
                                  {tool.description || "AI solution listed on AIOrbit."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
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
                  {company.aiModels && company.aiModels.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {company.aiModels.map((model) => (
                        <Link key={model.id} href={`/models/${model.slug}`} className="block group no-underline">
                          <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full">
                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors mb-2">{model.name}</h3>
                            <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 line-clamp-2">
                              {model.description || "AI model listed on AIOrbit."}
                            </p>
                            <div className="flex items-center gap-2">
                              {model.modality && (
                                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-0.5 rounded border border-[#28282E]">
                                  {model.modality}
                                </span>
                              )}
                              {model.parameterSize && (
                                <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-0.5 rounded border border-[#28282E]">
                                  {model.parameterSize}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
                      No foundation models listed yet for {cleanName}.
                    </div>
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
        {company.repositories.map((repo: any) => (
          <a
            key={repo.id}
            href={repo.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block group no-underline"
          >
            <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 hover:border-[#6E56CF]/50 hover:bg-[#111116] transition-all h-full">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                  {repo.name}
                </h3>

                <ExternalLink
                  size={13}
                  className="text-[#52525B] shrink-0"
                />
              </div>

              {repo.description && (
                <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 line-clamp-3">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {repo.language && (
                  <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                    {repo.language}
                  </span>
                )}

                {typeof repo.stars === 'number' && (
                  <span className="text-[10px] font-semibold text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded border border-[#28282E]">
                    ★ {repo.stars.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
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
  <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
    <p className="font-semibold text-white mb-1">No videos listed yet</p>
    <p className="text-xs text-[#52525B]">
      There are currently no public videos indexed for {cleanName}.
    </p>
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
