import { render, screen } from "@testing-library/react";
import { SortDropdown } from "@/components/SortDropdown";
import { vi } from "vitest";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams("sort=newest"),
}));

describe("SortDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders sort label", () => {
    render(<SortDropdown />);
    expect(screen.getByText("Sort by")).toBeInTheDocument();
  });

  it("renders select with sort options", () => {
    render(<SortDropdown />);
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("newest");
  });

  it("renders all sort options", () => {
    render(<SortDropdown />);
    expect(screen.getByRole("option", { name: "Newest" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Oldest" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Top Rated" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Name (A-Z)" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Name (Z-A)" })
    ).toBeInTheDocument();
  });
});
