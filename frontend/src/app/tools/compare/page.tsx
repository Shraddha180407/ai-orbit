import { Suspense } from "react";
import { CompareClient } from "@/components/CompareClient";

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#000000]">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <CompareClient />
    </Suspense>
  );
}