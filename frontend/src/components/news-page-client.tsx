'use client';

import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/news/PageShell";
import { NewsListingClient } from "@/components/news/NewsListingClient";

export function NewsPageClient() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const topic = searchParams.get("topic") || undefined;

  return (
    <PageShell>
      <NewsListingClient category={category} initialTopic={topic} />
    </PageShell>
  );
}
