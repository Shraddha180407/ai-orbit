import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DiscoveryFilters } from "../DiscoveryFilters";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/tools",
  useSearchParams: () => new URLSearchParams(""),
}));

describe("DiscoveryFilters", () => {
  const categories = [
    { slug: "coding", name: "Coding", _count: { tools: 42 } },
    { slug: "writing", name: "Writing", _count: { tools: 18 } },
  ];

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders sort pills", () => {
    render(<DiscoveryFilters categories={categories} />);
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Popular")).toBeInTheDocument();
    expect(screen.getAllByText("Newest").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getAllByText("Top Rated").length).toBeGreaterThanOrEqual(1);
  });

  it("renders sort select", () => {
    render(<DiscoveryFilters categories={categories} />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("newest");
  });

  it("renders category chips", () => {
    render(<DiscoveryFilters categories={categories} />);
    expect(screen.getByText("All Tools")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Writing")).toBeInTheDocument();
  });

  it("renders view toggle buttons", () => {
    render(<DiscoveryFilters categories={categories} />);
    expect(screen.getByLabelText("Grid view")).toBeInTheDocument();
    expect(screen.getByLabelText("List view")).toBeInTheDocument();
  });

  it("renders filters button", () => {
    render(<DiscoveryFilters categories={categories} />);
    expect(screen.getByText("Filters")).toBeInTheDocument();
  });

  it("calls router.push on sort select change", () => {
    render(<DiscoveryFilters categories={categories} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "rating" } });
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("sort=rating"));
  });

  it("calls router.push on category chip click", () => {
    render(<DiscoveryFilters categories={categories} />);
    fireEvent.click(screen.getByText("Coding"));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("category=coding"));
  });

  it("calls router.push on Free pill click", () => {
    render(<DiscoveryFilters categories={categories} />);
    fireEvent.click(screen.getByText("Free"));
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("pricing=FREE"));
  });

  it("resets page param on filter change", () => {
    render(<DiscoveryFilters categories={categories} />);
    fireEvent.click(screen.getByText("Coding"));
    const url = mockPush.mock.calls[0][0] as string;
    expect(url).not.toContain("page=");
  });
});
