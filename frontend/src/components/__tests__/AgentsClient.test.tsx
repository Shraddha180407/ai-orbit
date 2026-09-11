import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AgentsClient } from "../AgentsClient";

const mockPush = vi.fn();
const mockGet = vi.fn();
const mockToString = vi.fn();

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet, toString: mockToString }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("@/components/AgentListView", () => ({
  AgentListView: ({ agents, loading }: { agents: { name: string }[]; loading: boolean }) => (
    <div>
      {loading ? "Loading agents" : agents.map((agent) => <span key={agent.name}>{agent.name}</span>)}
    </div>
  ),
}));

function renderWithQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AgentsClient />
    </QueryClientProvider>
  );
}

describe("AgentsClient", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockImplementation((key: string) => {
      if (key === "page") return "1";
      return null;
    });
    mockToString.mockReturnValue("page=1");
    global.fetch = vi.fn();
  });

  it("renders an error instead of an empty state when agents API fails", async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.endsWith("/agents/categories")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({ ok: false, status: 500 });
    });

    renderWithQueryClient();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Unable to load agents");
    });
    expect(screen.queryByText("No agents match your filters")).not.toBeInTheDocument();
  });

  it("updates the URL when pagination changes", async () => {
    (global.fetch as any).mockImplementation((url: string) => {
      if (url.endsWith("/agents/categories")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ tools: [{ name: "Agent One" }], totalPages: 2 }),
      });
    });

    renderWithQueryClient();
    await waitFor(() => expect(screen.getByText("Agent One")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(mockPush).toHaveBeenCalledWith("/agents?page=2");
  });
});
