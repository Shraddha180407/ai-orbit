import CollectionsPageClient from "./CollectionsPageClient";
import type { CollectionListItem } from "@/lib/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";



// 1. Optional Server Component configuration
export const metadata = {
  title: "Curated Collections | Tool Directory",
  description: "Explore curated lists and stack configurations by domain experts.",
};

// 2. Data Fetcher / Mock Seeding (Replace with your actual DB query if needed)
async function getCollections(): Promise<CollectionListItem[]> {
  // Simulating an API call or database round-trip
  return [
    {
      id: "col-1",
      slug: "frontend-architecture-2026",
      title: "Enterprise Frontend Architecture Stack",
      description: "Production-ready open source configurations engineered for high-scale micro-frontends, containing atomic layouts and modern reactive virtualization strategies.",
      curatedBy: "Alex Rivers",
      category: "Engineering",
      featured: true,
      updatedAt: new Date().toISOString(),
      toolCount: 14,
      previewTools: [
        { name: "Next.js", logoUrl: "" },
        { name: "Tailwind CSS", logoUrl: "" },
        { name: "TypeScript", logoUrl: "" },
        { name: "TanStack Virtual", logoUrl: "" }
      ]
    },
    {
      id: "col-2",
      slug: "data-science-tooling",
      title: "Data Science & Pipeline Processing Essentials",
      description: "A comprehensive map of machine learning evaluation toolsets, vector database indices, and high-performance streaming pipelines.",
      curatedBy: "Dr. Elena Rostova",
      category: "Data Science",
      featured: false,
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      toolCount: 8,
      previewTools: [
        { name: "Python", logoUrl: "" },
        { name: "Jupyter", logoUrl: "" },
        { name: "Polars", logoUrl: "" },
        { name: "DuckDB", logoUrl: "" }
      ]
    },
    {
      id: "col-3",
      slug: "design-systems-foundations",
      title: "Design System Foundations & Tokens",
      description: "Curated libraries mapping design primitives, headless component configurations, and automation systems tailored for cohesive cross-platform interfaces.",
      curatedBy: "Marcus Vance",
      category: "Design",
      featured: true,
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
      toolCount: 22,
      previewTools: [
        { name: "Figma", logoUrl: "" },
        { name: "Radix UI", logoUrl: "" },
        { name: "Stitches", logoUrl: "" },
        { name: "Storybook", logoUrl: "" }
      ]
    }
  ];
}

// 3. Main Server Page Entry Route
export default async function CollectionsPage() {
  const initialData = await getCollections();

  return (
    <div>
      <Header/>
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20">
      <CollectionsPageClient initialCollections={initialData} />
    </main>
    <Footer />
    </div>
    
  );
}