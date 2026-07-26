import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeroSearchBar } from "../HeroSearchBar";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("@/hooks/useHomeSearch", () => ({
  useHomeSearch: () => ({
    suggestions: [],
    popular: [],
    featured: [],
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useRecentSearches", () => ({
  useRecentSearches: () => ({
    recent: [],
    addRecent: vi.fn(),
    clearRecent: vi.fn(),
  }),
}));

vi.mock("@/lib/entityMeta", () => ({
  ENTITY_META: {
    tool: { label: "Tools", basePath: "/tools", icon: () => null, tint: "" },
    company: { label: "Companies", basePath: "/companies", icon: () => null, tint: "" },
    model: { label: "Models", basePath: "/models", icon: () => null, tint: "" },
    robot: { label: "Robots", basePath: "/robots", icon: () => null, tint: "" },
    repository: { label: "Repositories", basePath: "/repositories", icon: () => null, tint: "" },
    device: { label: "Devices", basePath: "/devices", icon: () => null, tint: "" },
    collection: { label: "Collections", basePath: "/collections", icon: () => null, tint: "" },
  },
}));

describe("HeroSearchBar", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders search input with placeholder", () => {
    render(<HeroSearchBar />);
    expect(screen.getByPlaceholderText("Search AI tools, models, companies...")).toBeInTheDocument();
  });

  it("shows Cmd+K shortcut when input is empty", () => {
    render(<HeroSearchBar />);
    expect(screen.getByText("⌘")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("shows clear button when input has value", () => {
    render(<HeroSearchBar />);
    const input = screen.getByPlaceholderText(/Search/);
    fireEvent.change(input, { target: { value: "test" } });
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clears input when clear button clicked", () => {
    render(<HeroSearchBar />);
    const input = screen.getByPlaceholderText(/Search/) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.click(screen.getByLabelText("Clear search"));
    expect(input.value).toBe("");
  });

  it("opens dropdown on focus", () => {
    render(<HeroSearchBar />);
    fireEvent.focus(screen.getByPlaceholderText(/Search/));
    expect(screen.getByText("Trending")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });

  it("shows Browse by type section when dropdown open", () => {
    render(<HeroSearchBar />);
    fireEvent.focus(screen.getByPlaceholderText(/Search/));
    expect(screen.getByText("Browse by type")).toBeInTheDocument();
  });

  it("shows More to explore section when dropdown open", () => {
    render(<HeroSearchBar />);
    fireEvent.focus(screen.getByPlaceholderText(/Search/));
    expect(screen.getByText("More to explore")).toBeInTheDocument();
  });

  it("navigates to search results on Enter", () => {
    render(<HeroSearchBar />);
    const input = screen.getByPlaceholderText(/Search/);
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/tools?q=react");
  });

  it("navigates on search button click", () => {
    render(<HeroSearchBar />);
    const input = screen.getByPlaceholderText(/Search/);
    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.click(screen.getByLabelText("Search"));
    expect(mockPush).toHaveBeenCalledWith("/tools?q=react");
  });

  it("renders default value", () => {
    render(<HeroSearchBar defaultValue="initial" />);
    expect(screen.getByDisplayValue("initial")).toBeInTheDocument();
  });

  it("links trending to search/trending", () => {
    render(<HeroSearchBar />);
    fireEvent.focus(screen.getByPlaceholderText(/Search/));
    expect(screen.getByText("Trending").closest("a")).toHaveAttribute("href", "/search/trending");
  });
});
