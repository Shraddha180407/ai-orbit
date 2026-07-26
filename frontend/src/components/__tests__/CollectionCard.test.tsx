import { render, screen } from "@testing-library/react";
import { CollectionCard } from "@/components/CollectionCard";
import type { CollectionListItem } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/StackedLogos", () => ({
  StackedLogos: () => <div data-testid="stacked-logos" />,
}));

const mockCollection: CollectionListItem = {
  id: "c1",
  name: "Best AI Tools",
  slug: "best-ai-tools",
  description: "Curated top AI tools for developers",
  isFeatured: true,
  creatorType: "EDITORIAL",
  toolCount: 30,
  updatedAt: "2024-01-01T00:00:00Z",
  creator: { id: "u1", name: "Admin", image: null },
  categories: [],
  previewTools: [
    { logoUrl: null, name: "Tool1" },
    { logoUrl: null, name: "Tool2" },
  ],
  _count: { relatedModels: 5, relatedCompanies: 3 },
};

describe("CollectionCard", () => {
  it("renders collection name", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(screen.getByText("Best AI Tools")).toBeInTheDocument();
  });

  it("renders collection description", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(
      screen.getByText("Curated top AI tools for developers")
    ).toBeInTheDocument();
  });

  it("renders tool count", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(screen.getByText("30 tools")).toBeInTheDocument();
  });

  it("renders featured badge when isFeatured", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("does not render featured badge when not featured", () => {
    const notFeatured = { ...mockCollection, isFeatured: false };
    render(<CollectionCard collection={notFeatured} />);
    expect(screen.queryByText("Featured")).not.toBeInTheDocument();
  });

  it("links to collection detail page", () => {
    render(<CollectionCard collection={mockCollection} />);
    const link = screen.getByRole("link", { name: /Best AI Tools/ });
    expect(link).toHaveAttribute("href", "/collections/best-ai-tools");
  });

  it("renders stacked logos", () => {
    render(<CollectionCard collection={mockCollection} />);
    expect(screen.getByTestId("stacked-logos")).toBeInTheDocument();
  });

  it("renders admin buttons when isAdmin", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <CollectionCard
        collection={mockCollection}
        isAdmin
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
