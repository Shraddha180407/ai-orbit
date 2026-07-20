// lib/mockCollections.ts

import type { CollectionListItem } from "@/lib/types";

export const mockCollections: CollectionListItem[] = [
  {
    id: "1",
    slug: "best-ai-tools",
    name: "Best AI Tools",
    description: "A curated list of the best AI tools.",
    toolCount: 42,
    isFeatured: true,
    updatedAt: "2026-07-20T10:00:00Z",

    creator: {
      id: "c1",
      name: "OpenTools",
      image: "",
    },

    categories: [
      { categoryName: "AI" },
      { categoryName: "Productivity" },
    ],

    _count: {
      relatedCompanies: 6,
      relatedModels: 8,
    },
  },

  // more...
];