'use client';

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Building from 'lucide-react/dist/esm/icons/building';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { Company } from "@/lib/types";
import { fetchAllCompanies } from "@/lib/api";

export function CompaniesClient() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getCompanies() {
      try {
        const data = await fetchAllCompanies();
        setCompanies(data || []);
      } catch (e) {
        console.error("Failed to fetch companies:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getCompanies();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= companies.length) return;

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
  }, [isLoading, visibleCount, companies.length]);

  const visibleCompanies = companies.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Building className="text-[#6E56CF]" />
            AI Companies
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Explore leading AI research labs, software vendors, and hardware makers in the global ecosystem.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No companies found.</p>
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

                {/* Column 3: Headquarters */}
                <div className="text-sm text-[#A1A1AA] flex items-center gap-1 truncate">
                  <MapPin size={12} className="shrink-0 text-[#71717A]" />
                  <span>{company.headquarters || "Global HQ"}</span>
                </div>

                {/* Column 4: Founded Year */}
                <div className="text-sm text-[#A1A1AA] truncate">
                  <span className="sm:hidden text-xs text-[#71717A] mr-1">Founded:</span>
                  {company.foundedYear || "N/A"}
                </div>

                {/* Column 5: Action Link */}
                <div className="text-right sm:block hidden">
                  <span className="text-xs font-semibold text-[#71717A] group-hover:text-white transition-colors">
                    View Details &rarr;
                  </span>
                </div>
              </Link>
            ))}

            {/* Sentinel for infinite scroll */}
            {companies.length > 0 && visibleCount < companies.length && (
              <div ref={sentinelRef} className="h-20 flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
