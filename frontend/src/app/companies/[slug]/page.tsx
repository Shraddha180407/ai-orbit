import type { Metadata } from "next";
import { Suspense } from "react";
import { CompanyDetailClient } from "@/components/company-detail-client";

export const metadata: Metadata = {
  title: "Company Details — AI Orbit",
  description: "Explore company tools, models, and more.",
};

export default function CompanyPage() {
  return (
    <Suspense>
      <CompanyDetailClient />
    </Suspense>
  );
}
