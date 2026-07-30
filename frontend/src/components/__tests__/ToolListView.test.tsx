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
    expect(screen.getByText("NAME")).toBeInTheDocument();
    expect(screen.getByText("PRICING")).toBeInTheDocument();
  });

  it("renders pricing badges", () => {
    render(<ToolListView tools={mockTools} />);
    expect(screen.getAllByText("Free").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Paid").length).toBeGreaterThanOrEqual(1);
  });

  it("renders compare buttons", () => {
    render(<ToolListView tools={mockTools} />);
    const compareButtons = screen.getAllByText("Compare");
    expect(compareButtons.length).toBe(2);
  });

  it("allows selecting tools for compare", async () => {
    const user = userEvent.setup();
    render(<ToolListView tools={mockTools} />);

    const compareButtons = screen.getAllByText("Compare");
    await user.click(compareButtons[0]);
    expect(screen.getByText("Added")).toBeInTheDocument();
  });
});
