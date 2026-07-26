import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { CollectionDetailClient } from "@/components/collection-detail-client";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "best-ai-tools" }),
  notFound: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
}));

vi.mock("@/components/collections/CollectionGrid", () => ({
  CollectionGrid: (props: any) => <div data-testid="collection-grid" />,
}));

const mockCollectionData = {
  collection: {
    id: "c1", title: "Best AI Tools", slug: "best-ai-tools",
    description: "Top curated AI tools", curatedBy: "The AI Signal",
    toolCount: 5,
    tools: [
      {
        id: "t1", name: "Test Tool", logoUrl: "https://example.com/logo.png",
        description: "A tool", websiteUrl: "https://example.com", avgRating: 4.5,
      },
    ],
  },
  related: [],
};

describe("CollectionDetailClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true, json: () => Promise.resolve(mockCollectionData),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeleton initially", () => {
    render(<CollectionDetailClient />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders collection title after fetch", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Best AI Tools")).toBeInTheDocument();
    });
  });

  it("renders collection description", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Top curated AI tools")).toBeInTheDocument();
    });
  });

  it("renders curated by info", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("The AI Signal")).toBeInTheDocument();
    });
  });

  it("renders tool count", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("5 tools")).toBeInTheDocument();
    });
  });

  it("renders tool cards", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("renders back link", async () => {
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("All collections")).toHaveAttribute("href", "/collections");
    });
  });

  it("calls notFound on 404", async () => {
    const { notFound } = await import("next/navigation");
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false, status: 404,
    } as Response);
    await act(async () => {
      render(<CollectionDetailClient />);
    });
    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });
});
