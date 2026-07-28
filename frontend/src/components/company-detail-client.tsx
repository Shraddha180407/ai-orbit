'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchCompanyDetails } from "@/lib/api";
import { Company } from "@/lib/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Building, ArrowLeft, Layers, Cpu, Star } from "lucide-react";
import { Button } from "@/components/ui/shadcn-button";

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

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <Header />
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <Button variant="ghost" className="mb-6 text-[#A1A1AA] hover:text-white pl-0" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <div className="flex items-center gap-6 mb-12">
          <div className="h-24 w-24 rounded-2xl bg-[#18181C] flex items-center justify-center font-black text-4xl text-white border border-[#232326] shrink-0 overflow-hidden">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              company.name.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              {company.name}
            </h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-1">
                <Layers className="w-4 h-4 text-[#6E56CF]" />
                <span>{company._count?.tools || 0} Tools</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="w-4 h-4 text-[#26A69A]" />
                <span>{company._count?.aiModels || 0} AI Models</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        {company.tools && company.tools.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#6E56CF]" /> Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {company.tools.map((tool) => (
                <Link key={tool.id} href={`/p/tools/${tool.slug}`} className="group p-5 rounded-xl border border-[#232326] bg-[#131316]/50 hover:bg-[#18181C] transition-all flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-[#232326] flex items-center justify-center text-lg font-bold overflow-hidden shrink-0">
                      {tool.logoUrl ? <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" /> : tool.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#6E56CF] transition-colors">{tool.name}</h3>
                      <div className="text-xs text-[#A1A1AA] flex items-center gap-2 mt-1">
                        <span className="bg-[#232326] px-2 py-0.5 rounded text-xs">{tool.pricingModel}</span>
                        {tool.avgRating > 0 && (
                          <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {tool.avgRating.toFixed(1)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#A1A1AA] line-clamp-3 mt-auto">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* AI Models Section */}
        {company.aiModels && company.aiModels.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-[#26A69A]" /> AI Models
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.aiModels.map((model) => (
                <Link key={model.id} href={`/p/models/${model.id}`} className="group p-5 rounded-xl border border-[#232326] bg-[#131316]/50 hover:bg-[#18181C] transition-all flex flex-col h-full">
                  <h3 className="font-bold text-white text-lg mb-2 group-hover:text-[#26A69A] transition-colors">{model.name}</h3>
                  <p className="text-sm text-[#A1A1AA] mb-4 flex-1">{model.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-[#A1A1AA]">
                    {model.modality && <span className="bg-[#232326] px-2 py-1 rounded">Modality: {model.modality}</span>}
                    {model.parameterSize && <span className="bg-[#232326] px-2 py-1 rounded">Size: {model.parameterSize}</span>}
                    {model.contextWindow && <span className="bg-[#232326] px-2 py-1 rounded">Context: {model.contextWindow}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
