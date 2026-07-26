import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { ToolDetailClient } from "@/components/tool-detail-client";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ slug: "test-tool" }),
  notFound: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
}));

const mockToolData = {
  tool: {
    id: "t1", slug: "test-tool", name: "Test Tool", logoUrl: "https://example.com/logo.png",
    description: "A great tool", websiteUrl: "https://example.com",
    pricingModel: "FREE", pricingAmount: null, billingFrequency: "NA",
    avgRating: 4.5, reviewCount: 42, createdAt: "2024-01-01T00:00:00Z",
    screenshots: [], features: [],
    categories: [{ category: { slug: "coding", name: "Coding" } }],
    tags: [], _count: { reviews: 42, bookmarks: 100 },
    company: { slug: "test-co", name: "Test Co", logoUrl: null },
  },
  similarTools: [],
  reviews: [],
  bookmarked: false,
};

describe("ToolDetailClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true, json: () => Promise.resolve(mockToolData),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading skeleton initially", () => {
    render(<ToolDetailClient />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders tool name after fetch", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getAllByText("Test Tool").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders company name", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Co")).toBeInTheDocument();
    });
  });

  it("renders pricing badge", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Free")).toBeInTheDocument();
    });
  });

  it("renders category chip", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Coding")).toBeInTheDocument();
    });
  });

  it("renders breadcrumb", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("AI Tools")).toBeInTheDocument();
    });
  });

  it("renders visit website link", async () => {
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Visit Website")).toHaveAttribute("href", "https://example.com");
    });
  });

  it("calls notFound on 404 response", async () => {
    const { notFound } = await import("next/navigation");
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false, status: 404,
    } as Response);
    await act(async () => {
      render(<ToolDetailClient />);
    });
    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });
});
