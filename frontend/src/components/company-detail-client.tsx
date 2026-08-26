'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from "next/navigation";
import { fetchCompanyDetails } from "@/lib/api";
import { Company } from '@/lib/types';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import {
  MapPin, CheckCircle, Home, ChevronRight, Bell, Globe, Linkedin, Twitter,
  Bookmark, Share2, GitCompare, Building, Sparkles, TrendingUp, ExternalLink,
  Layers, FileText, Cpu, Briefcase, Code, Newspaper, Video, DollarSign, Award
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

type TabType = 'tools' | 'models' | 'devices' | 'papers' | 'jobs' | 'repositories' | 'news' | 'videos' | 'fundraises' | 'investments';

export function CompanyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = params.slug as string;
  const slug = rawSlug ? rawSlug.replace(/^!\[+/, '').replace(/[\]\(\)]/g, '').trim() : '';
  const { user, isAuthenticated } = useUser();

  const { data: company = null, isLoading } = useQuery<Company | null>({
    queryKey: ["company-detail", slug],
    queryFn: () => fetchCompanyDetails(slug),
    staleTime: 10 * 60 * 1000,
  });

  const [activeTab, setActiveTab] = useState<TabType>('tools');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!isLoading && !company && slug) {
      router.replace('/companies');
    }
  }, [isLoading, company, slug, router]);

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
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-12 flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) return null;

  const dash = "—";
  const cleanName = formatCompanyName(company.name);
  const logoSrc = getCompanyLogo(company);

  const toolsCount = company.tools?.length || company._count?.tools || 0;
  const modelsCount = company.aiModels?.length || company._count?.aiModels || 0;
  const sectorName = company.sector || "Artificial Intelligence";
  const typesList = (company.type || []) as string[];
  const isAiNative = typesList.length > 0 ? typesList.includes('AI_NATIVE') : null;
  const isProfitable = typesList.length > 0 ? typesList.includes('PROFITABLE') : null;
  const mostPopularTool = company.tools && company.tools.length > 0 ? company.tools[0] : null;
  const locationString = company.city && company.country ? `${company.city}, ${company.country}` : company.country || company.city || dash;

  // Module Navigation Tabs Config (Complete 10 Tabs from Matrix)
  const moduleTabs: { id: TabType; label: string; count: number; icon: React.ReactNode }[] = [
    { id: 'tools', label: 'Tools', count: toolsCount, icon: <Layers size={13} /> },
    { id: 'models', label: 'Models', count: modelsCount, icon: <Sparkles size={13} /> },
    { id: 'devices', label: 'Devices', count: 0, icon: <Cpu size={13} /> },
    { id: 'papers', label: 'Papers', count: 0, icon: <FileText size={13} /> },
    { id: 'jobs', label: 'Jobs', count: 0, icon: <Briefcase size={13} /> },
    { id: 'repositories', label: 'Repositories', count: 0, icon: <Code size={13} /> },
    { id: 'news', label: 'News', count: 0, icon: <Newspaper size={13} /> },
    { id: 'videos', label: 'Videos', count: 0, icon: <Video size={13} /> },
    { id: 'fundraises', label: 'Fundraises', count: 0, icon: <DollarSign size={13} /> },
    { id: 'investments', label: 'Investments', count: 0, icon: <Award size={13} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />

      <main className="w-full max-w-[1240px] mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-[#71717A] flex-wrap">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-[#52525B]" />
          <Link href="/companies" className="hover:text-white transition-colors flex items-center gap-1">
            <span>Companies</span>
          </Link>
          {company.sector && (
            <>
              <ChevronRight size={12} className="text-[#52525B]" />
              <Link href={`/companies?filter=${encodeURIComponent(company.sector.toLowerCase())}`} className="hover:text-white transition-colors flex items-center gap-1">
                <span>{company.sector}</span>
              </Link>
            </>
          )}
          <ChevronRight size={12} className="text-[#52525B]" />
          <div className="flex items-center gap-1.5 text-white font-semibold truncate max-w-[200px] sm:max-w-none">
            {logoSrc ? (
              <img src={logoSrc} alt={cleanName} className="w-4 h-4 object-contain rounded shrink-0" />
            ) : (
              <span className="w-4 h-4 bg-[#232326] rounded text-[10px] flex items-center justify-center font-bold shrink-0">{cleanName.charAt(0)}</span>
            )}
            <span className="truncate">{cleanName}</span>
            <span className="text-[10px] bg-[#1A1A1E] px-1.5 py-0.5 rounded text-[#A1A1AA] shrink-0">{toolsCount} Tools</span>
          </div>
        </nav>

        {/* High-End Company Profile Hero Header Box */}
        <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-xl sm:rounded-2xl p-5 sm:p-8 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow Background Accent */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Industry & Verified Badges Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#A1A1AA] text-xs font-semibold flex items-center gap-1.5">
                <Home size={13} className="text-[#71717A]" /> Industry:
              </span>
              <Link
                href={`/companies?filter=${encodeURIComponent(sectorName.toLowerCase())}`}
                className="text-white text-xs font-bold bg-[#1C1C20] border border-[#2B2B30] px-3 py-1 rounded-lg hover:border-[#F5A623] hover:text-[#F5A623] transition-colors no-underline"
              >
                {sectorName}
              </Link>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#A1A1AA] bg-[#1A1A1E] border border-[#2A2A2E] px-2.5 py-1 rounded-lg">
                <Layers size={12} className="text-[#F5A623]" /> {toolsCount} AI Tools
              </span>
            </div>

            {company.verified && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle size={13} /> Verified Company
                </span>
              </div>
            )}
          </div>

          {/* Company Main Header & Quick Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#141418] border border-[#26262B] flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-lg">
                {logoSrc ? (
                  <img src={logoSrc} alt={cleanName} className="object-contain w-full h-full rounded-xl" />
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-white">{cleanName.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{cleanName}</h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A1A1AA] flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#71717A]" />
                    {locationString}
                  </span>
                  {company.foundedYear && (
                    <>
                      <span>•</span>
                      <span>Founded {company.foundedYear}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Button Group */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full lg:w-auto">
              <Button
                type="button"
                onClick={handleFollowClick}
                className={`h-10 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer flex-1 lg:flex-initial ${
                  isFollowing
                    ? "bg-[#232326] text-white border border-[#333338]"
                    : "bg-white text-black hover:bg-neutral-200"
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
                  className="h-10 px-4 text-xs font-bold text-white bg-[#1A1A1E] hover:bg-[#25252B] border border-[#2C2C32] rounded-xl flex items-center justify-center gap-1.5 transition-all no-underline flex-1 lg:flex-initial"
                >
                  <Globe size={14} />
                  Visit Website
                </a>
              )}

              <button
                type="button"
                onClick={handleBookmarkToggle}
                className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                  isBookmarked
                    ? "bg-[#6E56CF]/10 border-[#6E56CF]/40 text-[#6E56CF]"
                    : "bg-[#1A1A1E] border-[#2C2C32] text-[#A1A1AA] hover:text-white hover:bg-[#25252B]"
                }`}
                title="Bookmark Company"
              >
                <Bookmark size={15} fill={isBookmarked ? "#6E56CF" : "none"} />
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                className="h-10 w-10 rounded-xl bg-[#1A1A1E] border border-[#2C2C32] text-[#A1A1AA] hover:text-white hover:bg-[#25252B] flex items-center justify-center transition-all cursor-pointer shrink-0"
                title="Share Company"
              >
                <Share2 size={15} />
              </button>
            </div>
          </div>

          {/* Description Overview */}
          <p className="text-[#A1A1AA] text-xs sm:text-sm leading-relaxed max-w-4xl mb-5">
            {company.description || `${cleanName} is a pioneer in artificial intelligence, building cutting-edge foundation models and scalable intelligent software solutions.`}
          </p>

          {/* Social Links Row */}
          <div className="flex items-center gap-4 text-[#71717A] text-xs mb-6">
            <span className="font-semibold text-[#A1A1AA]">Social Links:</span>
            {company.linkedinUrl && (
              <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 no-underline" title="LinkedIn">
                <Linkedin size={15} />
                <span>LinkedIn</span>
              </a>
            )}
            {company.twitterUrl && (
              <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 no-underline" title="Twitter / X">
                <Twitter size={15} />
                <span>Twitter</span>
              </a>
            )}
            {company.website && (
              <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 no-underline" title="Website">
                <Globe size={15} />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Authentic DB Statistics Grid (Complete Feature Matrix Alignment) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 pt-6 border-t border-[#1F1F24] text-[11px] sm:text-xs">
            <div>
              <div className="text-[#71717A] font-semibold mb-1">AI Native</div>
              <div className="font-bold">
                {isAiNative === null ? (
                  <span className="text-[#52525B]">{dash}</span>
                ) : isAiNative ? (
                  <span className="text-emerald-400 font-bold">Yes</span>
                ) : (
                  <span className="text-red-400 font-bold">No</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Profitable</div>
              <div className="font-bold">
                {isProfitable === null ? (
                  <span className="text-[#52525B]">{dash}</span>
                ) : isProfitable ? (
                  <span className="text-emerald-400 font-bold">Yes</span>
                ) : (
                  <span className="text-red-400 font-bold">No</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Valuation</div>
              <div className="font-bold text-white">{formatValuation(company.valuation)}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">$ Raised</div>
              <div className="font-bold text-white">{formatValuation(company.fundingRaised)}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Employees</div>
              <div className="font-bold text-white">{company.employeeCount ? `${company.employeeCount.toLocaleString()}` : dash}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Total Tools</div>
              <div className="font-bold text-white">{toolsCount}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Total Models</div>
              <div className="font-bold text-white">{modelsCount}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-semibold mb-1">Flagship Tool</div>
              {mostPopularTool ? (
                <div className="inline-flex items-center gap-1.5 bg-[#1C1C20] border border-[#2B2B30] rounded-full px-2.5 py-0.5 text-white font-semibold text-[11px] sm:text-xs truncate max-w-full">
                  {mostPopularTool.logoUrl && <img src={mostPopularTool.logoUrl} alt="" className="w-3.5 h-3.5 object-cover rounded-full shrink-0" />}
                  <span className="truncate">{mostPopularTool.name}</span>
                </div>
              ) : (
                <div className="font-bold text-[#52525B]">{dash}</div>
              )}
            </div>
          </div>
        </div>

        {/* Company Module Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-4 mb-6 border-b border-[#1F1F24]">
          {moduleTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                  isSelected
                    ? "bg-white text-black border-white shadow-md font-extrabold"
                    : "bg-[#131316] text-[#A1A1AA] border-[#232326] hover:text-white hover:border-[#333]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-black/10 text-black font-extrabold" : "bg-[#1C1C20] text-[#71717A]"}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="space-y-6">
          {activeTab === 'tools' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-6">Tools ({toolsCount})</h2>
              {company.tools && company.tools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {company.tools.map((tool) => (
                    <Link key={tool.id} href={`/p/tools/${tool.slug}`} className="block group no-underline">
                      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#131316] transition-all h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#18181C] border border-[#26262B] flex items-center justify-center overflow-hidden shrink-0 p-1">
                            {tool.logoUrl ? (
                              <img src={tool.logoUrl} alt={tool.name} className="object-cover w-full h-full rounded-lg" />
                            ) : (
                              <span className="text-white font-black text-base sm:text-lg">{tool.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#6E56CF] transition-colors">{tool.name}</h3>
                            <span className="text-[10px] sm:text-[11px] text-[#A1A1AA] bg-[#1A1A1E] px-2 py-0.5 rounded border border-[#28282E]">
                              {tool.pricingModel || "Freemium"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-1">
                          {tool.description || "Leading AI solution for enterprise & personal workflows."}
                        </p>
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
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-6">Models ({modelsCount})</h2>
              {company.aiModels && company.aiModels.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {company.aiModels.map((model) => (
                    <Link key={model.id} href={`/models/${model.slug}`} className="block group no-underline">
                      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-4 sm:p-5 hover:border-[#6E56CF]/50 hover:bg-[#131316] transition-all h-full flex flex-col">
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#6E56CF] transition-colors mb-2">{model.name}</h3>
                        <p className="text-xs text-[#8A8F98] leading-relaxed mb-3 sm:mb-4 line-clamp-3 flex-1">
                          {model.description || "State-of-the-art foundation model optimized for reasoning & performance."}
                        </p>
                        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#1F1F24]">
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

          {activeTab !== 'tools' && activeTab !== 'models' && (
            <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-8 sm:p-12 text-center text-[#71717A] text-xs sm:text-sm">
              <p className="font-semibold text-white mb-1">No {activeTab} listed yet</p>
              <p className="text-xs text-[#52525B]">There are currently no public {activeTab} records indexed for {cleanName}.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
