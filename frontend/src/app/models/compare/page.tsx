import { Suspense } from "react";
import type { Metadata } from "next";
import { ModelsCompareClient } from "@/components/ModelsCompareClient";

export const metadata: Metadata = {
  title: "Compare AI Models",
  description: "Side-by-side comparison of AI models — company, type, context, and more.",
};

export default function ModelsComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#000000]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <ModelsCompareClient />
    </Suspense>
  );
}
