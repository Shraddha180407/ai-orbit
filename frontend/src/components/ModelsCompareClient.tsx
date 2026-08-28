"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { fetchModelById } from "@/lib/api";
import type { ModelDetail } from "@/lib/types";

const ROWS: { key: string; label: string; get: (m: ModelDetail) => string }[] = [
  {
    key: "company",
    label: "Company",
    get: (m) => m.provider?.name || m.creator || "—",
  },
  {
    key: "type",
    label: "Type",
    get: (m) => m.type || m.modality || "—",
  },
  {
    key: "primaryTask",
    label: "Primary Task",
    get: (m) => m.primaryTask || "—",
  },
  { key: "modality", label: "Modality", get: (m) => m.modality || "—" },
  {
    key: "context",
    label: "Context Window",
    get: (m) => m.contextWindow || "—",
  },
  {
    key: "params",
    label: "Parameters",
    get: (m) => m.parameterSize || "—",
  },
  { key: "released", label: "Released", get: (m) => m.releaseDate || "—" },
  {
    key: "oss",
    label: "Open Source",
    get: (m) =>
      m.openSource === true ? "Yes" : m.openSource === false ? "No" : "—",
  },
];

export function ModelsCompareClient() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2);

  const [models, setModels] = useState<(ModelDetail | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setModels([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(ids.map((id) => fetchModelById(id))).then((results) => {
      setModels(results);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("ids")]);

  return (
    <div className="flex flex-col flex-1">

      <main className="mx-auto w-full max-w-[1100px] px-3 sm:px-6 py-6 sm:py-8 flex-1">
        <Link
          href="/models"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to models
        </Link>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">Compare models</h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] mb-6 sm:mb-8">
          Side-by-side specs for the models you selected.
        </p>

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl border border-[#232326]/60 bg-[#131316]/40" />
        ) : ids.length < 2 || models.filter(Boolean).length < 2 ? (
          <div className="rounded-xl border border-dashed border-[#232326] bg-[#131316]/40 py-16 text-center">
            <p className="text-sm text-white font-medium">Select two models to compare</p>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              Use the Compare buttons on the{" "}
              <Link href="/models" className="underline hover:text-white">
                models list
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none rounded-xl border border-[#232326]/60 bg-[#131316]/10">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[#232326]/60 bg-[#131316]/40">
                  <th className="px-4 py-3 text-[9.5px] font-mono font-semibold tracking-wider text-[#71717A] w-40">
                    SPEC
                  </th>
                  {models.map((m) =>
                    m ? (
                      <th key={m.id} className="px-4 py-3 min-w-[200px]">
                        <Link href={`/models/${m.id}`} className="group block">
                          <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#232326]/60 bg-white text-xs font-bold text-neutral-900">
                              {m.provider?.logoUrl ? (
                                <Image
                                  src={m.provider.logoUrl}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="h-7 w-7 object-contain"
                                />
                              ) : (
                                m.name.charAt(0)
                              )}
                            </div>
                            <span className="text-[13px] font-semibold text-white group-hover:underline">
                              {m.name}
                            </span>
                          </div>
                        </Link>
                      </th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#232326]/60">
                <tr>
                  <td className="px-4 py-3 text-[11px] font-mono text-[#71717A]">Description</td>
                  {models.map((m) =>
                    m ? (
                      <td key={m.id} className="px-4 py-3 text-[12px] text-[#A1A1AA] leading-snug">
                        {m.description}
                      </td>
                    ) : null
                  )}
                </tr>
                {ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="px-4 py-3 text-[11px] font-mono text-[#71717A]">{row.label}</td>
                    {models.map((m) =>
                      m ? (
                        <td key={m.id} className="px-4 py-3 text-[13px] font-semibold text-white">
                          {row.get(m)}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

    </div>
  );
}
