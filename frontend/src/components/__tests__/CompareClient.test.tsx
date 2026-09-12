import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { CompareClient } from "../CompareClient";

const mockPush = vi.fn();
const mockGet = vi.fn();
const mockToString = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet, toString: mockToString }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: (props: any) => <img src={props.src} alt={props.alt} />,
}));

vi.mock("@/components/Header", () => ({
  Header: () => <header>Header</header>,
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

vi.mock("@/components/PricingBadge", () => ({
  PricingBadge: (props: any) => <span>{props.pricingModel}</span>,
}));

const mockTool1 = {
  name: "Tool One",
  slug: "tool-one",
  description: "First tool",
  logoUrl: null,
  websiteUrl: "https://one.com",
  pricingModel: "FREE",
  pricingAmount: null,
  billingFrequency: null,
  avgRating: 4.5,
  reviewCount: 10,
  company: { name: "Company A" },
  categories: [{ category: { slug: "coding", name: "Coding" } }],
  features: ["Feature A", "Feature B"],
  _count: { reviews: 10 },
};

const mockTool2 = {
  name: "Tool Two",
  slug: "tool-two",
  description: "Second tool",
  logoUrl: "https://logo.png",
  websiteUrl: "https://two.com",
  pricingModel: "PAID",
  pricingAmount: "29",
  billingFrequency: "MONTHLY",
  avgRating: null,
  reviewCount: 0,
  company: null,
  categories: [],
  features: [],
  _count: { reviews: 0 },
};

describe("CompareClient", () => {
  beforeEach(() => {
    mockPush.mockClear();
    global.fetch = vi.fn();
    mockToString.mockReturnValue("slugs=tool-one%2Ctool-two");
  });

  it("shows error when less than 2 slugs", async () => {
    mockGet.mockReturnValue("tool-one");
    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("Pick 2 tools from the list to compare.")).toBeInTheDocument();
    });
  });

  it("shows loading spinner initially", () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any).mockReturnValue(new Promise(() => {}));
    render(<CompareClient />);
    // The spinner is a div with animate-spin class
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("fetches and displays two tools", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool2 }) });

    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("Tool One")).toBeInTheDocument();
      expect(screen.getByText("Tool Two")).toBeInTheDocument();
    });
  });

  it("renders comparison rows", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool2 }) });

    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("Pricing")).toBeInTheDocument();
      expect(screen.getByText("Rating")).toBeInTheDocument();
      expect(screen.getByText("Company")).toBeInTheDocument();
      expect(screen.getByText("Categories")).toBeInTheDocument();
      expect(screen.getByText("Key features")).toBeInTheDocument();
      expect(screen.getByText("Website")).toBeInTheDocument();
    });
  });

  it("shows error when one tool is not found", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: false });

    render(<CompareClient />);
    await waitFor(() => {
      // When one tool is null and one is found, the error state still shows
      // but the component renders the comparison table with a "Not found" for the missing tool
      expect(screen.getByText("Not found")).toBeInTheDocument();
    });
  });

  it("shows an error and clears loading when the network request rejects", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any).mockRejectedValue(new Error("offline"));

    render(<CompareClient />);

    await waitFor(() => {
      expect(screen.getByText("Unable to load comparison.")).toBeInTheDocument();
    });
    expect(document.querySelector(".animate-spin")).not.toBeInTheDocument();
  });

  it("aborts detail requests when the comparison unmounts", () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    let requestSignal: AbortSignal | undefined;
    (global.fetch as any).mockImplementation((_url: string, options: RequestInit) => {
      requestSignal = options.signal;
      return new Promise(() => {});
    });

    const { unmount } = render(<CompareClient />);
    unmount();

    expect(requestSignal).toBeInstanceOf(AbortSignal);
    expect(requestSignal?.aborted).toBe(true);
  });

  it("clears previously loaded tools when the comparison becomes invalid", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool2 }) });

    const { rerender } = render(<CompareClient />);
    await waitFor(() => expect(screen.getByText("Tool One")).toBeInTheDocument());

    mockGet.mockReturnValue("tool-one");
    mockToString.mockReturnValue("slugs=tool-one");
    rerender(<CompareClient />);

    await waitFor(() => {
      expect(screen.getByText("Pick 2 tools from the list to compare.")).toBeInTheDocument();
    });
    expect(screen.queryByText("Tool One")).not.toBeInTheDocument();
  });

  it("navigates back to tools on back button click", async () => {
    mockGet.mockReturnValue("");
    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("Back to all tools")).toBeInTheDocument();
    });
    screen.getByText("Back to all tools").click();
    expect(mockPush).toHaveBeenCalledWith("/tools");
  });

  it("renders feature lists", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool2 }) });

    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("Feature A")).toBeInTheDocument();
      expect(screen.getByText("Feature B")).toBeInTheDocument();
    });
  });

  it("shows no listed features when empty", async () => {
    mockGet.mockReturnValue("tool-one,tool-two");
    (global.fetch as any)
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool1 }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tool: mockTool2 }) });

    render(<CompareClient />);
    await waitFor(() => {
      expect(screen.getByText("No listed features")).toBeInTheDocument();
    });
  });
});
