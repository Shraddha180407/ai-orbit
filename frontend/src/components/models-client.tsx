'use client';

import React, { useEffect, useState, useRef } from "react";
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import { AIModel } from "@/lib/types";
import { fetchAllModels } from "@/lib/api";

export function ModelsClient() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [visibleCount, setVisibleCount] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getModels() {
      try {
        const data = await fetchAllModels();
        setModels(data || []);
      } catch (e) {
        console.error("Failed to fetch models:", e);
      } finally {
        setIsLoading(false);
      }
    }
    getModels();
  }, []);

  // IntersectionObserver for client-side endless scroll
  useEffect(() => {
    if (isLoading || visibleCount >= models.length) return;

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
  }, [isLoading, visibleCount, models.length]);

  const visibleModels = models.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col bg-[#000000] text-white selection:bg-neutral-800 selection:text-white">
      <main className="mx-auto max-w-[1070px] px-8 py-12 flex-1 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <Sparkles className="text-[#6E56CF]" />
            AI Language Models
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-2">
            Discover and explore state-of-the-art LLMs, neural architectures, and vision models pushing machine intelligence limits.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-[#131316]/50" />
            ))}
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-20 border border-[#232326] bg-[#131316] rounded-xl">
            <p className="text-[#A1A1AA] text-sm">No models found.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-[#232326]/60 border border-[#232326]/60 rounded-xl overflow-hidden bg-[#131316]/10">
            {visibleModels.map((model: AIModel) => (
              <div
                key={model.id}
                className="group grid grid-cols-1 sm:grid-cols-[40px_1fr_180px_120px] gap-4 items-center p-4 bg-transparent hover:bg-[#18181C]/40 transition-all w-full"
              >
                {/* Column 1: Initials */}
                <div className="h-10 w-10 rounded-lg bg-[#18181C] flex items-center justify-center font-bold text-white uppercase border border-[#232326]/60 shrink-0">
                  {model.name.charAt(0)}
                </div>

                {/* Column 2: Name + Description */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm truncate">
                      {model.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-[#18181C] text-[9px] text-[#A1A1AA] border border-[#232326] shrink-0 font-mono">
                      {model.modality}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] line-clamp-1 mt-1 leading-relaxed">
                    {model.description}
                  </p>
                </div>

                {/* Column 3: Context / Parameters */}
                <div className="text-xs text-[#A1A1AA] font-mono flex flex-col gap-0.5 sm:block hidden">
                  <div>Context: <strong className="text-white">{model.contextWindow}</strong></div>
                  <div className="text-[10px] text-[#71717A]">Params: {model.parameterSize}</div>
                </div>

                {/* Column 4: Release Date */}
                <div className="text-right sm:block hidden">
                  <span className="text-[10px] font-mono text-[#71717A] block">RELEASED</span>
                  <span className="text-xs text-white font-medium">{model.releaseDate}</span>
                </div>
              </div>
            ))}

            {/* Sentinel for infinite scroll */}
            {models.length > 0 && visibleCount < models.length && (
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
