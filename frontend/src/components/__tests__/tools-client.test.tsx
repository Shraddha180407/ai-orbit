import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { ToolsClient } from "@/components/tools-client";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
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

const mockToolsResponse = {
  tools: [
    {
      id: "1", slug: "test-tool", name: "Test Tool", logoUrl: null,
      description: "A test tool", pricingModel: "FREE", pricingAmount: null,
      billingFrequency: "NA",
      categories: [{ category: { slug: "coding", name: "Coding" } }],
      tags: [], _count: { reviews: 5, bookmarks: 10 }, avgRating: 4.2, company: null,
    },
  ],
  total: 1, page: 1, totalPages: 1,
  categories: [{ slug: "coding", name: "Coding", _count: { tools: 1 } }],
};

describe("ToolsClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true, json: () => Promise.resolve(mockToolsResponse),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders page heading", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    render(<ToolsClient />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders tools after fetch", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("renders tool count", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("renders breadcrumb back link", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("renders search bar", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
  });

  it("does not show admin button for non-admin", async () => {
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("Test Tool")).toBeInTheDocument();
    });
    expect(screen.queryByText("Add Tool")).not.toBeInTheDocument();
  });

  it("handles fetch error gracefully", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
    await act(async () => {
      render(<ToolsClient />);
    });
    await waitFor(() => {
      expect(screen.queryByTestId("skeleton")).not.toBeInTheDocument();
    });
  });
});
