'use client';

import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/news/PageShell";
import { NewsListingClient } from "@/components/news/NewsListingClient";

export function NewsPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const topic = searchParams.get("topic") || undefined;

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <NewsListingClient category={category} initialTopic={topic} />
    </div>
  );
}
