import { render, screen } from "@testing-library/react";
import { CollectionGrid } from "@/components/CollectionGrid";
import type { CollectionListItem } from "@/lib/types";

const mockCollections: CollectionListItem[] = [
  {
    id: "c1",
    name: "Best AI Tools",
    slug: "best-ai-tools",
    description: "Curated collection of top AI tools",
    isFeatured: true,
    creatorType: "EDITORIAL",
    toolCount: 25,
    updatedAt: "2024-01-01T00:00:00Z",
    creator: { id: "u1", name: "Admin", image: null },
    categories: [],
    previewTools: [],
    _count: { relatedModels: 2, relatedCompanies: 3 },
  },
];

describe("CollectionGrid", () => {
  it("renders empty state when no collections", () => {
    render(<CollectionGrid collections={[]} />);
    expect(
      screen.getByText("No collections match this filter")
    ).toBeInTheDocument();
  });

  it("renders collection cards", () => {
    render(<CollectionGrid collections={mockCollections} />);
    expect(screen.getByText("Best AI Tools")).toBeInTheDocument();
    expect(screen.getByText("25 tools")).toBeInTheDocument();
  });

  it("renders featured badge", () => {
    render(<CollectionGrid collections={mockCollections} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });
});
