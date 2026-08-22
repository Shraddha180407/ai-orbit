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
  ExternalLink, Twitter, Linkedin, Building, MapPin, Calendar, Briefcase,
  TrendingUp, DollarSign, Users, CheckCircle, Star, ArrowLeft, Home,
  ChevronRight, Bell, MoreVertical, BarChart2, Globe
} from 'lucide-react';
import { Button } from "@/components/ui/shadcn-button";

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

export function CompanyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useUser();

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tools' | 'models'>('tools');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    fetchCompanyDetails(slug)
      .then((data) => {
        if (!data) {
          router.replace('/companies');
        } else {
          setCompany(data);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [slug, router]);

  const handleFollowClick = () => {
    if (!user) {
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
      toast.success(`You are now following ${company?.name || 'this company'}`);
    } else {
      toast.info(`Unfollowed ${company?.name || 'this company'}`);
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
  const toolsCount = company.tools?.length || company._count?.tools || 0;
  const modelsCount = company.aiModels?.length || company._count?.aiModels || 0;
  const sectorName = company.sector || "Artificial Intelligence";
  const typesList = company.type || [];
  const isAiNative = typesList.length > 0 ? typesList.includes('AI_NATIVE') : null;
  const isProfitable = typesList.length > 0 ? typesList.includes('PROFITABLE') : null;
  const mostPopularTool = company.tools && company.tools.length > 0 ? company.tools[0] : null;
  const locationString = company.city && company.country ? `${company.city}, ${company.country}` : company.country || company.city || dash;

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />

      <main className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#71717A] flex-wrap">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-white transition-colors">
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} className="text-[#52525B]" />
          <Link href="/companies" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>Companies</span>
          </Link>
          {company.sector && (
            <>
              <ChevronRight size={13} className="text-[#52525B]" />
              <Link href={`/companies?filter=${encodeURIComponent(company.sector.toLowerCase())}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                <span>{company.sector}</span>
              </Link>
            </>
          )}
          <ChevronRight size={13} className="text-[#52525B]" />
          <div className="flex items-center gap-1.5 text-white font-semibold">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-4 h-4 object-contain rounded" />
            ) : (
              <span className="w-4 h-4 bg-[#232326] rounded text-[10px] flex items-center justify-center font-bold">{company.name.charAt(0)}</span>
            )}
            <span>{company.name}</span>
            <span className="text-[10px] bg-[#1A1A1E] px-1.5 py-0.5 rounded text-[#A1A1AA]">{toolsCount}</span>
          </div>
        </nav>

        {/* Demo-Matched Company Hero Profile Box */}
        <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
          {/* Top Industry Pill Badges (Clean separated styling) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-[#A1A1AA] text-xs font-semibold flex items-center gap-1.5">
                <Home size={13} className="text-[#71717A]" /> Industries
              </span>
              <Link
                href={`/companies?filter=${encodeURIComponent(sectorName.toLowerCase())}`}
                className="text-white text-xs font-bold bg-[#1C1C20] border border-[#2B2B30] px-3 py-1 rounded-lg hover:border-[#F5A623] hover:text-[#F5A623] transition-colors no-underline"
              >
                {sectorName}
              </Link>
            </div>

            {company.verified && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle size={12} /> Verified Company
                </span>
              </div>
            )}
          </div>

          {/* Company Title Header & Action Buttons */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-[#141418] border border-[#26262B] flex items-center justify-center shrink-0 overflow-hidden p-2 shadow-md">
                {company.logoUrl ? (
                  <img src={company.logoUrl} alt={company.name} className="object-contain w-full h-full rounded" />
                ) : (
                  <span className="text-2xl font-black text-white">{company.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">{company.name}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleFollowClick}
                className={`h-9 px-4 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
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
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 text-xs font-bold text-white bg-[#1A1A1E] hover:bg-[#25252B] border border-[#2C2C32] rounded-xl flex items-center gap-1.5 transition-all no-underline"
                >
                  <Globe size={14} />
                  Visit website
                </a>
              )}
            </div>
          </div>

          {/* Description Tagline */}
          <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-4xl mb-5">
            {company.description || `${company.name} is a technology company specializing in artificial intelligence and machine learning solutions.`}
          </p>

          {/* Social Icons Row */}
          <div className="flex items-center gap-4 text-[#71717A] text-sm mb-6">
            {company.linkedinUrl && (
              <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="LinkedIn">
                <Linkedin size={16} />
              </a>
            )}
            {company.twitterUrl && (
              <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" title="Twitter / X">
                <Twitter size={16} />
              </a>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] mb-6">
            <MapPin size={14} className="text-[#71717A]" />
            <span>{locationString}</span>
          </div>

          {/* Metrics Grid Row (Authentic Data strictly from DB) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-6 border-t border-[#1F1F24] text-xs">
            <div>
              <div className="text-[#71717A] font-medium mb-1">AI Native</div>
              <div className="font-bold text-white">{isAiNative === null ? dash : isAiNative ? "Yes" : "No"}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Number of tools</div>
              <div className="font-bold text-white">{toolsCount}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Number of models</div>
              <div className="font-bold text-white">{modelsCount}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Number of employees</div>
              <div className="font-bold text-white">{company.employeeCount ? `${company.employeeCount.toLocaleString()}` : dash}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Profitable</div>
              <div className="font-bold">
                {isProfitable === null ? (
                  <span className="text-[#A1A1AA]">{dash}</span>
                ) : isProfitable ? (
                  <span className="text-emerald-400">Yes</span>
                ) : (
                  <span className="text-red-400">No</span>
                )}
              </div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Valuation</div>
              <div className="font-bold text-white">{formatValuation(company.valuation)}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Raised</div>
              <div className="font-bold text-white">{formatValuation(company.fundingRaised)}</div>
            </div>
            <div>
              <div className="text-[#71717A] font-medium mb-1">Most popular AI tool</div>
              {mostPopularTool ? (
                <div className="inline-flex items-center gap-1.5 bg-[#1C1C20] border border-[#2B2B30] rounded-full px-2.5 py-0.5 text-white font-semibold text-xs truncate max-w-full">
                  {mostPopularTool.logoUrl && <img src={mostPopularTool.logoUrl} alt="" className="w-3.5 h-3.5 object-cover rounded-full shrink-0" />}
                  <span className="truncate">{mostPopularTool.name}</span>
                </div>
              ) : (
                <div className="font-bold text-[#A1A1AA]">{dash}</div>
              )}
            </div>
          </div>
        </div>

        {/* Subcategory Tabs Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-none pb-6 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('tools')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'tools'
                ? "bg-white text-black border-white shadow-md"
                : "bg-[#131316] text-[#A1A1AA] border-[#232326] hover:text-white hover:border-[#333]"
            }`}
          >
            Tools {toolsCount}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('models')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === 'models'
                ? "bg-white text-black border-white shadow-md"
                : "bg-[#131316] text-[#A1A1AA] border-[#232326] hover:text-white hover:border-[#333]"
            }`}
          >
            Models {modelsCount}
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="space-y-6">
          {activeTab === 'tools' && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-6">Tools</h2>
              {company.tools && company.tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {company.tools.map((tool) => (
                    <Link key={tool.id} href={`/p/tools/${tool.slug}`} className="block group no-underline">
                      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-5 hover:border-[#F5A623]/50 hover:bg-[#131316] transition-all h-full flex flex-col">
                        <div className="flex items-center gap-3.5 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-[#18181C] border border-[#26262B] flex items-center justify-center overflow-hidden shrink-0 p-1">
                            {tool.logoUrl ? (
                              <img src={tool.logoUrl} alt={tool.name} className="object-cover w-full h-full rounded-lg" />
                            ) : (
                              <span className="text-white font-black text-lg">{tool.name.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-[#F5A623] transition-colors">{tool.name}</h3>
                            <span className="text-[11px] text-[#A1A1AA] bg-[#1A1A1E] px-2 py-0.5 rounded border border-[#28282E]">
                              {tool.pricingModel || "Freemium"}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-[#8A8F98] leading-relaxed mb-4 line-clamp-3 flex-1">
                          {tool.description || "Leading AI solution for enterprise & personal workflows."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-12 text-center text-[#71717A] text-sm">
                  No public tools listed yet for this company.
                </div>
              )}
            </div>
          )}

          {activeTab === 'models' && (
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-6">Models</h2>
              {company.aiModels && company.aiModels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {company.aiModels.map((model) => (
                    <Link key={model.id} href={`/models/${model.slug}`} className="block group no-underline">
                      <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-5 hover:border-[#F5A623]/50 hover:bg-[#131316] transition-all h-full flex flex-col">
                        <h3 className="text-base font-bold text-white group-hover:text-[#F5A623] transition-colors mb-2">{model.name}</h3>
                        <p className="text-xs text-[#8A8F98] leading-relaxed mb-4 line-clamp-3 flex-1">
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
                <div className="bg-[#0D0D10] border border-[#1F1F24] rounded-2xl p-12 text-center text-[#71717A] text-sm">
                  No AI models listed yet for this company.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
