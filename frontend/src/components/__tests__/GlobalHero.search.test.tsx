import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GlobalHero } from "../GlobalHero";

vi.mock("next/link", () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/business",
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ prefetchInfiniteQuery: vi.fn() }),
}));

vi.mock("@/hooks/useHomeSearch", () => ({
  useHomeSearch: () => ({ suggestions: [], isLoading: false }),
}));

vi.mock("@/components/HeroFeatureChips", () => ({
  HeroFeatureChips: () => <div data-testid="hero-feature-chips" />,
}));

vi.mock("@/components/SortDropdown", () => ({
  SortDropdown: () => <div data-testid="sort-dropdown" />,
}));

vi.mock("@/components/UnifiedFilterDropdown", () => ({
  UnifiedFilterDropdown: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
  fetchAllCompanies: vi.fn(),
  fetchAllDevices: vi.fn(),
  fetchAllRobots: vi.fn(),
  fetchMCPItems: vi.fn(),
  fetchModels: vi.fn(),
  fetchRepositories: vi.fn(),
  prefetchUrl: vi.fn(),
}));

vi.mock("@/lib/tasks-api", () => ({ fetchTasks: vi.fn() }));
vi.mock("@/lib/videos-data", () => ({ prefetchVideosCategory: vi.fn() }));
vi.mock("@/lib/utils", () => ({ scrollChipIntoView: vi.fn() }));

describe("GlobalHero search visibility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("omits the search bar when disabled", () => {
    render(<GlobalHero showSearch={false} />);

    expect(screen.queryByLabelText("Search the AI ecosystem")).not.toBeInTheDocument();
  });
});
