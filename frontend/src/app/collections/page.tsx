import CollectionsPageClient from "./CollectionsPageClient";
import { CategoryNav } from "@/components/CategoryNav"; 
import type { CollectionListItem } from "@/lib/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
export const metadata = {
  title: "Curated Collections | Tool Directory",
  description: "Explore curated lists and stack configurations by domain experts.",
};

async function getCollections(): Promise<CollectionListItem[]> {
  return [
    {
      id: "col-1",
      name: "Enterprise Frontend Architecture Stack",
      slug: "frontend-architecture-2026",
      description: "Production-ready open source configurations engineered for high-scale micro-frontends, containing atomic layouts and modern reactive virtualization strategies.",
      isFeatured: true,
      isCurated: true,
      toolCount: 14,
      updatedAt: new Date().toISOString(), // Today
      creator: {
        id: "user-1",
        name: "Alex Rivers",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
        isOfficial: true
      },
      categories: [
        { categoryName: "Engineering" },
        { categoryName: "Architecture" }
      ],
      _count: {
        relatedModels: 5,
        relatedCompanies: 12
      }
    },
    {
      id: "col-2",
      name: "Data Science & Pipeline Processing Essentials",
      slug: "data-science-tooling",
      description: "A comprehensive map of machine learning evaluation toolsets, vector database indices, and high-performance streaming pipelines.",
      isFeatured: false,
      isCurated: true,
      toolCount: 8,
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      creator: {
        id: "user-2",
        name: "Dr. Elena Rostova",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
        isOfficial: false
      },
      categories: [
        { categoryName: "Data Science" },
        { categoryName: "Pipelines" }
      ],
      _count: {
        relatedModels: 24,
        relatedCompanies: 4
      }
    },
    {
      id: "col-3",
      name: "Design System Foundations & Tokens",
      slug: "design-systems-foundations",
      description: "Curated libraries mapping design primitives, headless component configurations, and automation systems tailored for cohesive cross-platform interfaces.",
      isFeatured: true,
      isCurated: false,
      toolCount: 22,
      updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
      creator: {
        id: "user-3",
        name: "Marcus Vance",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
        isOfficial: true
      },
      categories: [
        { categoryName: "Design" }
      ],
      _count: {
        relatedModels: 0,
        relatedCompanies: 8
      }
    }
  ];
}

export default async function CollectionsPage() {
  const initialData = await getCollections();

  return (
    <div className="relative min-h-screen bg-[#000000] text-[#E4E4E7] antialiased">
    <Header/>
      <CategoryNav />
      
      <main className="relative z-10 bg-[#000000]">
        <CollectionsPageClient initialCollections={initialData} />
      </main>
      <Footer/>
    </div>
  );
}