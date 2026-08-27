"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Star from 'lucide-react/dist/esm/icons/star';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingBadge } from "@/components/PricingBadge";
import { API_URL } from "@/lib/api";
import type { ToolDetailData } from "@/lib/types";

function formatPrice(tool: ToolDetailData): string {
  if (tool.pricingModel === "FREE") return "Free";
  const amount =
    tool.pricingAmount !== null && tool.pricingAmount !== undefined && Number(tool.pricingAmount) > 0
      ? `$${tool.pricingAmount}`
      : null;
  if (!amount) return tool.pricingModel === "FREEMIUM" ? "Freemium" : "\u2014";
  const freq =
    tool.billingFrequency === "MONTHLY" ? "/mo" : tool.billingFrequency === "YEARLY" ? "/yr" : "";
  return `${amount}${freq}`;
}

export function CompareClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugs = (searchParams.get("slugs") || "").split(",").filter(Boolean).slice(0, 2);

  const [tools, setTools] = useState<(ToolDetailData | null)[]>([null, null]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slugs.length < 2) {
      setError("Pick 2 tools from the list to compare.");
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all(
      slugs.map(async (slug) => {
        const res = await fetch(`${API_URL}/api/v1/tools/${slug}`);
        if (!res.ok) return null;
        const data = await res.json();
        return (data?.tool ?? null) as ToolDetailData | null;
      })
    ).then((results) => {
      if (cancelled) return;
      if (results.some((r) => r === null)) {
        setError("One of these tools couldn't be found. Try selecting again.");
      }
      setTools(results);
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  const rows: { label: string; render: (t: ToolDetailData) => React.ReactNode }[] = [
    {
      label: "Pricing",
      render: (t) => (
        <div className="flex flex-col items-center gap-1.5">
          <PricingBadge
            pricingModel={t.pricingModel}
            pricingAmount={t.pricingAmount}
            billingFrequency={t.billingFrequency}
          />
          <span className="text-[11px] font-mono text-[#71717A]">{formatPrice(t)}</span>
        </div>
      ),
    },
    {
      label: "Rating",
      render: (t) => (
        <div className="flex items-center justify-center gap-1 text-[13px] font-mono">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="text-white">{t.avgRating?.toFixed(1) ?? "\u2014"}</span>
          <span className="text-[#71717A]">({t.reviewCount ?? t._count?.reviews ?? 0})</span>
        </div>
      ),
    },
    {
      label: "Company",
      render: (t) => (
        <span className="text-[13px] text-[#A1A1AA]">{t.company?.name ?? "\u2014"}</span>
      ),
    },
    {
      label: "Categories",
      render: (t) => (
        <div className="flex flex-wrap justify-center gap-1.5">
          {t.categories.length ? (
            t.categories.map((c) => (
              <span
                key={c.category.slug}
                className="rounded-md border border-[#232326]/60 px-2 py-0.5 text-[11px] text-[#A1A1AA]"
              >
                {c.category.name}
              </span>
            ))
          ) : (
            <span className="text-[13px] text-[#71717A]">\u2014</span>
          )}
        </div>
      ),
    },
    {
      label: "Key features",
      render: (t) => (
        <ul className="space-y-1.5 text-left text-[12.5px] text-[#A1A1AA]">
          {t.features?.length ? (
            t.features.slice(0, 5).map((f, i) => (
              <li key={i} className="flex gap-1.5">
                <span className="text-[#71717A]">&middot;</span>
                <span>{f}</span>
              </li>
            ))
          ) : (
            <li className="text-[#71717A]">No listed features</li>
          )}
        </ul>
      ),
    },
    {
      label: "Website",
      render: (t) => (
        <a
          href={t.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#A1A1AA] hover:text-white transition-colors"
        >
          Visit site <ExternalLink size={11} />
        </a>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#000000]">
      <Header />

      <main className="mx-auto w-full max-w-[900px] flex-1 px-3 sm:px-6 py-6 sm:py-10">
        <button
          type="button"
          onClick={() => router.push("/tools")}
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-[#71717A] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to all tools
        </button>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : error && tools.every((t) => t === null) ? (
          <div className="rounded-xl border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
            <p className="text-sm font-medium text-white">{error}</p>
            <Link
              href="/tools"
              className="mt-3 inline-block text-[13px] font-semibold text-[#A1A1AA] hover:text-white"
            >
              Go pick two tools &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none rounded-xl border border-[#232326]/60 bg-[#131316]/10">
            <div className="min-w-[480px]">
              {/* Header row: the two tools */}
              <div className="grid grid-cols-[140px_1fr_1fr] border-b border-[#232326]/60">
              <div />
              {tools.map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 border-l border-[#232326]/60 px-4 py-6"
                >
                  {t ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white">
                        {t.logoUrl ? (
                          <Image src={t.logoUrl} alt={t.name} width={40} height={40} className="h-9 w-9 object-contain" />
                        ) : (
                          <span className="text-base font-bold text-neutral-900">{t.name.charAt(0)}</span>
                        )}
                      </div>
                      <Link href={`/tools/${t.slug}`} className="text-[14px] font-bold text-white hover:underline">
                        {t.name}
                      </Link>
                      <p className="line-clamp-2 text-center text-[11.5px] text-[#A1A1AA]">{t.description}</p>
                    </>
                  ) : (
                    <span className="text-[13px] text-[#71717A]">Not found</span>
                  )}
                </div>
              ))}
            </div>

            {/* Attribute rows */}
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[140px_1fr_1fr] border-b border-[#232326]/60 last:border-b-0"
              >
                <div className="flex items-center px-4 py-4 text-[11px] font-mono font-semibold uppercase tracking-wide text-[#71717A]">
                  {row.label}
                </div>
                {tools.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center border-l border-[#232326]/60 px-4 py-4"
                  >
                    {t ? row.render(t) : <span className="text-[#71717A]">&mdash;</span>}
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}