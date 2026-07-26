import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { CollectionsClient } from "@/components/collections-client";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({ user: null, isLoading: false, isAuthenticated: false }),
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/components/CategoryMenu", () => ({
  CategoryMenu: (props: any) => <div data-testid="category-menu" />,
}));

const mockCollectionsResponse = {
  items: [
    {
      id: "c1", name: "Best AI Tools", slug: "best-ai-tools",
      description: "Top tools", isFeatured: true, creatorType: "EDITORIAL",
      toolCount: 25, updatedAt: "2024-01-01T00:00:00Z",
      creator: { id: "u1", name: "Admin", image: null },
      categories: [], previewTools: [],
      _count: { relatedModels: 2, relatedCompanies: 3 },
    },
  ],
  pagination: { total: 1 },
  categoryCounts: { coding: 5 },
};

describe("CollectionsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true, json: () => Promise.resolve(mockCollectionsResponse),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page heading", async () => {
    await act(async () => {
      render(<CollectionsClient />);
    });
    expect(screen.getByText("Collections")).toBeInTheDocument();
  });

  it("shows loading skeleton initially", () => {
    render(<CollectionsClient />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders collections after fetch", async () => {
    await act(async () => {
      render(<CollectionsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Best AI Tools")).toBeInTheDocument();
    });
  });

  it("renders collection count", async () => {
    await act(async () => {
      render(<CollectionsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("1 curated bundle of the best AI tools")).toBeInTheDocument();
    });
  });

  it("renders category menu", async () => {
    await act(async () => {
      render(<CollectionsClient />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("category-menu")).toBeInTheDocument();
    });
  });

  it("does not show admin button for non-admin", async () => {
    await act(async () => {
      render(<CollectionsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Best AI Tools")).toBeInTheDocument();
    });
    expect(screen.queryByText("Add Collection")).not.toBeInTheDocument();
  });
});
