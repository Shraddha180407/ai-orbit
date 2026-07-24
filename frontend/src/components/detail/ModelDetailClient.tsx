"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import ArrowLeft from "lucide-react/dist/esm/icons/arrow-left";
import { fetchModelById } from "@/lib/api";
import type { AIModel } from "@/lib/types";

type ModelDetail = AIModel & {
  tasks?: Array<{
    task: { id: string; slug: string; title: string };
  }>;
};

export function ModelDetailClient() {
  const params = useParams();
  const id = params?.id as string;

  const [model, setModel] = useState<ModelDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let active = true;
    fetchModelById(id).then((data) => {
      if (!active) return;
      if (!data) {
        notFound();
        return;
      }
      setModel(data as ModelDetail);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="mx-auto max-w-[900px]">
          <div className="h-64 animate-pulse rounded-lg border border-[#232326]/60 bg-[#131316]/40" />
        </div>
      </main>
    );
  }

  if (!model) return null;

  const companyName = model.provider?.name || model.creator;
  const specs: { label: string; value: string }[] = [
    { label: "Company", value: companyName },
    { label: "Type", value: model.type || model.modality || "—" },
    { label: "Primary Task", value: model.primaryTask || "—" },
    { label: "Modality", value: model.modality || "—" },
    { label: "Context Window", value: model.contextWindow || "—" },
    { label: "Parameters", value: model.parameterSize || "—" },
    { label: "Released", value: model.releaseDate || "—" },
    {
      label: "Open Source",
      value:
        model.openSource === true ? "Yes" : model.openSource === false ? "No" : "—",
    },
  ];

  const tasks = (model.tasks ?? []).map((t) => t.task).filter(Boolean);

  return (
    <main className="w-full px-4 sm:px-6 lg:px-8 py-10 flex-1">
      <div className="mx-auto max-w-[900px]">
        <Link
          href="/models"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft size={15} />
          Back to models
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#232326]/60 bg-white text-lg font-bold text-neutral-900 uppercase">
            {model.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black tracking-tight text-white">{model.name}</h1>
            <p className="mt-1 text-sm text-[#A1A1AA]">
              by <span className="text-white font-medium">{companyName}</span>
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[#D4D4D8]">{model.description}</p>

        <div className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-[#232326]/60 bg-[#131316]/30 p-5 sm:grid-cols-4">
          {specs.map((s) => (
            <div key={s.label}>
              <p className="text-[9.5px] font-mono uppercase tracking-wider text-[#71717A]">
                {s.label}
              </p>
              <p className="mt-1 truncate text-[13px] font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {tasks.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[13px] font-semibold text-white">
              Tasks using this model{" "}
              <span className="text-[#71717A] font-normal">({tasks.length})</span>
            </h2>
            <div className="flex flex-col divide-y divide-[#232326]/60 rounded-lg border border-[#232326]/60 bg-[#131316]/10 overflow-hidden">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.slug}`}
                  className="px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#18181C]/40"
                >
                  {task.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
