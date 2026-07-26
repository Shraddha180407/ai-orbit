import { render, screen } from "@testing-library/react";
import { Pagination } from "@/components/Pagination";
import type { ToolsSearchParams } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const defaultParams: ToolsSearchParams = {};

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} params={defaultParams} />
    );
    expect(container.querySelector("nav")).not.toBeInTheDocument();
  });

  it("renders navigation with page links", () => {
    render(<Pagination page={1} totalPages={5} params={defaultParams} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("renders previous and next links", () => {
    render(<Pagination page={2} totalPages={5} params={defaultParams} />);
    expect(screen.getByRole("link", { name: "Previous page" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Next page" })).toBeInTheDocument();
  });

  it("marks current page with aria-current", () => {
    render(<Pagination page={3} totalPages={5} params={defaultParams} />);
    const currentPage = screen.getByRole("link", { name: "3" });
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("disables previous button on first page", () => {
    render(<Pagination page={1} totalPages={5} params={defaultParams} />);
    expect(screen.getByRole("link", { name: "Previous page" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("disables next button on last page", () => {
    render(<Pagination page={5} totalPages={5} params={defaultParams} />);
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("shows ellipsis for large page counts", () => {
    render(<Pagination page={5} totalPages={10} params={defaultParams} />);
    expect(screen.getAllByText("…").length).toBeGreaterThanOrEqual(1);
  });

  it("includes search params in link hrefs", () => {
    const params: ToolsSearchParams = { q: "test", category: "coding" };
    render(<Pagination page={1} totalPages={3} params={params} />);
    const nextLink = screen.getByRole("link", { name: "Next page" });
    expect(nextLink.getAttribute("href")).toContain("q=test");
    expect(nextLink.getAttribute("href")).toContain("category=coding");
  });
});
