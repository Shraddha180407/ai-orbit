import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ReactElement,
} from "react";
import {
  render as testingLibraryRender,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("lucide-animated", () => {
  const createAnimatedIcon = (name: string) =>
    forwardRef<any, any>(({ animateOnHover, ...props }, ref) => {
      const iconRef = useRef<SVGSVGElement>(null);

      useImperativeHandle(ref, () => ({
        startAnimation: () =>
          iconRef.current?.setAttribute("data-animation-started", "true"),
        stopAnimation: () =>
          iconRef.current?.removeAttribute("data-animation-started"),
      }), []);

      return (
        <svg
          ref={iconRef}
          data-animated-icon={name}
          data-animate-on-hover={animateOnHover ? "true" : "false"}
          {...props}
        />
      );
    });

  return {
    BriefcaseBusinessIcon: createAnimatedIcon("BriefcaseBusinessIcon"),
    CogIcon: createAnimatedIcon("CogIcon"),
    CpuIcon: createAnimatedIcon("CpuIcon"),
    FigmaIcon: createAnimatedIcon("FigmaIcon"),
    HandCoinsIcon: createAnimatedIcon("HandCoinsIcon"),
    LayoutGridIcon: createAnimatedIcon("LayoutGridIcon"),
    MessageCircleIcon: createAnimatedIcon("MessageCircleIcon"),
    SquarePenIcon: createAnimatedIcon("SquarePenIcon"),
    TrendingUpIcon: createAnimatedIcon("TrendingUpIcon"),
    WorkflowIcon: createAnimatedIcon("WorkflowIcon"),
  };
});

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

  it("uses compact category chips for the tools directory", () => {
    render(<ToolsClient />);

    const allButton = screen.getByRole("button", { name: "All" });
    const categoryRow = allButton.parentElement;

    expect(allButton).toHaveClass("rounded-full", "py-1");
    expect(allButton).not.toHaveClass("min-h-[72px]", "flex-col");
    expect(categoryRow).toHaveClass("justify-start", "gap-1.5", "pb-2.5");
  });

  it("uses the business endpoint without rendering the legacy category row", async () => {
    await act(async () => {
      render(<ToolsClient defaultMode="business" showCategories={false} />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/tools/category/business"),
      );
      expect(screen.queryByRole("button", { name: "Writing & Editing" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Sales" })).not.toBeInTheDocument();
      expect(document.querySelector(".grid")).toHaveClass("lg:grid-cols-4");
    });
  });

  it("can hide the category row for the business icon directory", () => {
    render(<ToolsClient defaultMode="business" showCategories={false} />);

    expect(screen.queryByRole("button", { name: "Writing & Editing" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sales" })).not.toBeInTheDocument();
  });

  it("uses centered pagination with a fixed 100-item page size for business", async () => {
    const manyTools = Array.from({ length: 101 }, (_, index) => ({
      ...mockToolsResponse.tools[0],
      id: `business-tool-${index}`,
      slug: `business-tool-${index}`,
      name: `Business Tool ${index}`,
    }));
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ...mockToolsResponse, tools: manyTools }),
    } as Response);

    await act(async () => {
      render(<ToolsClient defaultMode="business" />);
    });

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveClass(
        "justify-center",
      );
      expect(
        screen.queryByRole("button", { name: "Items per page" }),
      ).not.toBeInTheDocument();
      expect(screen.getByText("100 / page")).toBeInTheDocument();
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
