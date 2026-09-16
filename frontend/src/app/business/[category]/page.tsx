import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BusinessDirectory } from "@/components/business-directory";
import {
  BUSINESS_CATEGORIES,
  isBusinessCategorySlug,
} from "@/lib/business-categories";

type BusinessCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return BUSINESS_CATEGORIES.filter((category) => category.slug !== "").map(
    (category) => ({ category: category.slug }),
  );
}

export async function generateMetadata({
  params,
}: BusinessCategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const currentCategory = BUSINESS_CATEGORIES.find(
    (item) => item.slug === category,
  );

  if (!currentCategory) {
    return {};
  }

  return {
    title: `${currentCategory.name} AI Tools for Business`,
    description: `Discover AI tools for ${currentCategory.name.toLowerCase()} workflows and teams.`,
    alternates: {
      canonical: `/business/${currentCategory.slug}`,
    },
  };
}

export default async function BusinessCategoryPage({
  params,
}: BusinessCategoryPageProps) {
  const { category } = await params;

  if (!isBusinessCategorySlug(category)) {
    notFound();
  }

  return <BusinessDirectory defaultCategory={category} />;
}
