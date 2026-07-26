import { render, screen } from "@testing-library/react";
import { ToolCard } from "@/components/ToolCard";
import type { ToolCardData } from "@/lib/types";

vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} src={props.src} />;
  },
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockTool: ToolCardData = {
  id: "t1",
  slug: "test-tool",
  name: "Test Tool",
  logoUrl: "https://example.com/logo.png",
  description: "A great AI tool for testing purposes",
  pricingModel: "FREEMIUM",
  pricingAmount: null,
  billingFrequency: "NA",
  categories: [
    { category: { slug: "coding", name: "Coding" } },
    { category: { slug: "productivity", name: "Productivity" } },
  ],
  tags: [],
  _count: { reviews: 42, bookmarks: 100 },
  avgRating: 4.7,
  company: { slug: "test-co", name: "Test Co" },
};

describe("ToolCard", () => {
  it("renders tool name", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText("Test Tool")).toBeInTheDocument();
  });

  it("renders tool description", () => {
    render(<ToolCard tool={mockTool} />);
    expect(
      screen.getByText("A great AI tool for testing purposes")
    ).toBeInTheDocument();
  });

  it("renders link to tool detail page", () => {
    render(<ToolCard tool={mockTool} />);
    const link = screen.getByRole("link", { name: /Test Tool/ });
    expect(link).toHaveAttribute("href", "/tools/test-tool");
  });

  it("renders logo image", () => {
    render(<ToolCard tool={mockTool} />);
    const img = screen.getByRole("img", { name: "Test Tool logo" });
    expect(img).toHaveAttribute("src", "https://example.com/logo.png");
  });

  it("renders first letter when no logo", () => {
    const toolNoLogo = { ...mockTool, logoUrl: null };
    render(<ToolCard tool={toolNoLogo} />);
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("renders pricing badge", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText("Freemium")).toBeInTheDocument();
  });

  it("renders category chips", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Productivity")).toBeInTheDocument();
  });

  it("renders rating and review count", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText("4.7")).toBeInTheDocument();
    expect(screen.getByText("(42)")).toBeInTheDocument();
  });

  it("renders bookmark count", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.getByText("100 saves")).toBeInTheDocument();
  });

  it("renders admin edit/delete buttons when isAdmin", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <ToolCard tool={mockTool} isAdmin onEdit={onEdit} onDelete={onDelete} />
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("does not render admin buttons when not isAdmin", () => {
    render(<ToolCard tool={mockTool} />);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
