import type { Metadata } from "next";
import { BusinessDirectory } from "@/components/business-directory";

export const metadata: Metadata = {
  title: "Business AI Tools — Browse the Directory",
  description:
    "Browse AI tools for marketing, sales, finance, operations, and other business workflows.",
  alternates: {
    canonical: "/business",
  },
};

export default function BusinessPage() {
  return <BusinessDirectory />;
}
