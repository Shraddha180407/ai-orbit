import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolListView } from "@/components/ToolListView";
import type { ToolCardData } from "@/lib/types";

vi.mock("next/image", () => ({
  default: (props: any) => <img alt={props.alt} src={props.src} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/tools",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
    update: vi.fn(),
    error: null,
  }),
}));

vi.mock("@/lib/actions", () => ({
  toggleBookmark: vi.fn(),
}));

const mockTools: ToolCardData[] = [
  {
    id: "t1",
    slug: "tool-a",
    name: "Tool A",
    logoUrl: null,
    description: "First tool",
    pricingModel: "FREE",
    pricingAmount: null,
    billingFrequency: "NA",
    categories: [{ category: { slug: "coding", name: "Coding" } }],
    tags: [],
    _count: { reviews: 10, bookmarks: 20 },
    avgRating: 4.5,
    company: null,
    createdAt: "2025-01-01T00:00:00.000Z",
    isOpenSource: false,
    isTrending: false,
  },
  {
    id: "t2",
    slug: "tool-b",
    name: "Tool B",
    logoUrl: null,
    description: "Second tool",
    pricingModel: "PAID",
    pricingAmount: "29",
    billingFrequency: "MONTHLY",
    categories: [],
    tags: [],
    _count: { reviews: 5, bookmarks: 8 },
    avgRating: 3.2,
    company: null,
    createdAt: "2025-01-02T00:00:00.000Z",
    isOpenSource: false,
    isTrending: false,
  },
];

describe("ToolListView", () => {
  it("renders empty state when no tools", () => {
    render(<ToolListView tools={[]} />);
    expect(screen.getByText("No tools match your filters")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(<ToolListView tools={[]} loading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders tool list when tools provided", () => {
    render(<ToolListView tools={mockTools} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
  });

  it("renders tool names", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getByText("Tool A")).toBeInTheDocument();
    expect(screen.getByText("Tool B")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getByText("TOOL")).toBeInTheDocument();
    expect(screen.getByText("TASK")).toBeInTheDocument();
    expect(screen.getByText("PRICING")).toBeInTheDocument();
  });

  it("gives the name filter control an accessible name", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getByRole("button", { name: "Filter tools by name" })).toBeInTheDocument();
  });

  it("uses a directory section heading before tool item headings", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getByRole("heading", { level: 2, name: "AI directory" })).toBeInTheDocument();
  });

  it("renders pricing badges", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getAllByText("Free").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Paid").length).toBeGreaterThanOrEqual(1);
  });

  it("renders compare buttons", () => {
    render(<ToolListView tools={mockTools} />);
    const compareButtons = screen.getAllByRole("button", { name: /Add .* to compare/i });
    expect(compareButtons.length).toBe(2);
  });

  it("allows selecting tools for compare", async () => {
    const user = userEvent.setup();
    render(<ToolListView tools={mockTools} />);

    const compareButtons = screen.getAllByRole("button", { name: /Add .* to compare/i });
    await user.click(compareButtons[0]);
    expect(screen.getAllByText("Tool A").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Select another tool…")).toBeInTheDocument();
  });
});
