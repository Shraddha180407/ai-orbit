'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from "next/navigation";
import { fetchCompanyDetails } from "@/lib/api";
import { Company } from '@/lib/types';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExternalLink, Twitter, Linkedin, Building, MapPin, Calendar, Briefcase, TrendingUp, DollarSign, Users, CheckCircle, Star, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

function formatValuation(val: string | null | undefined): string {
  if (!val) return "—";
  const num = Number(val);
  if (isNaN(num)) return val;
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(1)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num}`;
}

export function CompanyDetailClient() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#000000] text-white">
        <Header />
        <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!company) return null;

  const dash = "—";

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <Button variant="ghost" className="mb-6 text-[#A1A1AA] hover:text-white pl-0" onClick={() => router.push('/companies')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Companies
        </Button>

        {/* Hero Header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between bg-[#0A0A0C] border border-[#1C1C1F] p-8 rounded-2xl mb-8">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-2xl bg-[#18181C] border border-[#232326] flex flex-col items-center justify-center shrink-0 overflow-hidden shadow-lg">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="object-contain w-full h-full p-2" />
              ) : (
                <span className="text-4xl font-black text-white">{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white tracking-tight">{company.name}</h1>
                {company.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
                {company.featured && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#6E56CF] bg-[#6E56CF]/10 border border-[#6E56CF]/20 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              <p className="text-[#A1A1AA] text-base leading-relaxed max-w-3xl mb-4">
                {company.description || dash}
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#6E56CF] transition-colors bg-[#1C1C1F] hover:bg-[#232326] px-3 py-1.5 rounded-lg border border-[#2A2A2E]">
                    <ExternalLink className="w-4 h-4" /> Website
                  </a>
                )}
                {company.twitterUrl && (
                  <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#1DA1F2] transition-colors bg-[#1C1C1F] hover:bg-[#232326] px-3 py-1.5 rounded-lg border border-[#2A2A2E]">
                    <Twitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {company.linkedinUrl && (
                  <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-medium text-white hover:text-[#0A66C2] transition-colors bg-[#1C1C1F] hover:bg-[#232326] px-3 py-1.5 rounded-lg border border-[#2A2A2E]">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <div className="text-center px-4 py-2 bg-[#131316] border border-[#1C1C1F] rounded-xl min-w-[90px]">
               <div className="text-xs text-[#71717A] uppercase tracking-wider font-semibold mb-1">Views</div>
               <div className="text-xl font-bold text-white">{company.views || 0}</div>
             </div>
             <div className="text-center px-4 py-2 bg-[#131316] border border-[#1C1C1F] rounded-xl min-w-[90px]">
               <div className="text-xs text-[#71717A] uppercase tracking-wider font-semibold mb-1">Upvotes</div>
               <div className="text-xl font-bold text-white">{company.upvotes || 0}</div>
             </div>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <Building className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Sector</span>
            </div>
            <div className="text-white font-medium">{company.sector || dash}</div>
          </div>
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Location</span>
            </div>
            <div className="text-white font-medium">
              {company.city && company.country ? `${company.city}, ${company.country}` : company.country || company.city || dash}
            </div>
          </div>
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Founded</span>
            </div>
            <div className="text-white font-medium">{company.foundedYear || dash}</div>
          </div>
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Employees</span>
            </div>
            <div className="text-white font-medium">{company.employeeCount ? `${company.employeeCount.toLocaleString()}+` : dash}</div>
          </div>
          
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Valuation</span>
            </div>
            <div className="text-white font-medium text-lg">{company.valuation ? formatValuation(company.valuation) : dash}</div>
          </div>
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Funding Raised</span>
            </div>
            <div className="text-white font-medium text-lg">{company.fundingRaised ? formatValuation(company.fundingRaised) : dash}</div>
          </div>
          <div className="bg-[#0A0A0C] border border-[#1C1C1F] p-5 rounded-xl col-span-2">
            <div className="flex items-center gap-2 text-[#71717A] mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Latest Round</span>
            </div>
            <div className="text-white font-medium">{company.latestFundingRound || dash}</div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-lg font-bold text-white mb-4">Company Profile</h2>
          <div className="flex flex-wrap gap-2">
             {company.type && company.type.length > 0 ? company.type.map(t => (
               <span key={t} className="px-3 py-1 bg-[#1A1A1E] border border-[#2A2A2E] rounded-full text-xs font-semibold text-[#A1A1AA]">
                 {t.replace('_', ' ')}
               </span>
             )) : (
               <span className="text-[#A1A1AA]">{dash}</span>
             )}
          </div>
        </div>

        {/* Tabs / Sections for Models and Tools */}
        <div className="space-y-12">
          {company.aiModels && company.aiModels.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-[#232326] pb-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Models <span className="bg-[#1C1C1F] text-[#A1A1AA] text-xs px-2 py-0.5 rounded-full">{company.aiModels.length}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.aiModels.map(model => (
                  <Link key={model.id} href={`/models/${model.slug}`} className="block group">
                    <div className="bg-[#0A0A0C] border border-[#1C1C1F] rounded-xl p-5 hover:border-[#6E56CF]/50 hover:bg-[#111114] transition-all h-full flex flex-col">
                      <h3 className="text-base font-bold text-white group-hover:text-[#6E56CF] transition-colors mb-2">{model.name}</h3>
                      <p className="text-sm text-[#8A8F98] mb-4 line-clamp-2 flex-1">{model.description || dash}</p>
                      <div className="flex items-center gap-2 mt-auto">
                         {model.modality && (
                           <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded">
                             {model.modality.split(',')[0]}
                           </span>
                         )}
                         {model.parameterSize && (
                           <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded">
                             {model.parameterSize}
                           </span>
                         )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {company.tools && company.tools.length > 0 && (
            <div>
              <div className="flex items-center justify-between border-b border-[#232326] pb-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Tools <span className="bg-[#1C1C1F] text-[#A1A1AA] text-xs px-2 py-0.5 rounded-full">{company.tools.length}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {company.tools.map(tool => (
                  <Link key={tool.id} href={`/p/tools/${tool.slug}`} className="block group">
                    <div className="bg-[#0A0A0C] border border-[#1C1C1F] rounded-xl p-5 hover:border-white/20 hover:bg-[#111114] transition-all h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 rounded-lg bg-[#18181C] border border-[#232326] flex items-center justify-center overflow-hidden shrink-0">
                           {tool.logoUrl ? (
                             <img src={tool.logoUrl} alt={tool.name} className="object-cover w-full h-full" />
                           ) : (
                             <span className="text-white font-bold">{tool.name.charAt(0)}</span>
                           )}
                         </div>
                         <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">{tool.name}</h3>
                      </div>
                      <p className="text-sm text-[#8A8F98] mb-4 line-clamp-2 flex-1">{tool.description || dash}</p>
                      <div className="mt-auto flex items-center justify-between">
                         <span className="text-[10px] uppercase font-semibold tracking-wider text-[#A1A1AA] bg-[#1A1A1E] px-2 py-1 rounded">
                           {tool.pricingModel || dash}
                         </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
