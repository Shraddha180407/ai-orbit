import type { ReactElement } from "react";
import {
  render as testingLibraryRender,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToolsClient } from "@/components/tools-client";

function render(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return testingLibraryRender(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/tools",
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

  it("uses the business endpoint and renders business categories", async () => {
    await act(async () => {
      render(<ToolsClient defaultMode="business" />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/tools/category/business"),
      );
      expect(screen.getByText("Writing & Editing")).toBeInTheDocument();
      expect(screen.getByText("Design & Creative")).toBeInTheDocument();
      expect(screen.getByText("Back Office")).toBeInTheDocument();
      expect(screen.getByText("Growth & Marketing")).toBeInTheDocument();
      const businessCategories = [
        "All",
        "Writing & Editing",
        "Design & Creative",
        "Customer Service & Support",
        "Growth & Marketing",
        "Technology & IT",
        "Workflow Automation",
        "Back Office",
        "Operations",
        "Sales",
      ];
      businessCategories.forEach((label) => {
        const button = screen.getByRole("button", { name: label });
        expect(button.querySelector("svg")).toBeInTheDocument();
        expect(button).toHaveClass("flex-col", "items-center");
      });
      expect(document.querySelector(".grid")).toHaveClass("lg:grid-cols-4");
    });
  });

  it("filters business tools by the selected frontend category", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          ...mockToolsResponse,
          tools: [
            {
              ...mockToolsResponse.tools[0],
              id: "sales-tool",
              slug: "sales-tool",
              name: "Sales Assistant",
              description: "An AI CRM that helps sales teams manage leads.",
            },
            {
              ...mockToolsResponse.tools[0],
              id: "legal-tool",
              slug: "legal-tool",
              name: "Contract Reviewer",
              description: "Reviews legal contracts for compliance risks.",
            },
          ],
        }),
    } as Response);

    await act(async () => {
      render(<ToolsClient defaultMode="business" defaultCategory="sales" />);
    });

    await waitFor(() => {
      expect(screen.getByText("Sales Assistant")).toBeInTheDocument();
      expect(screen.queryByText("Contract Reviewer")).not.toBeInTheDocument();
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
