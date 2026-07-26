import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { VideosClient } from "@/components/videos-client";

vi.mock("@/hooks/use-user", () => ({
  useUser: () => ({ user: null, isLoading: false, isAuthenticated: false }),
}));

vi.mock("@/lib/api", () => ({
  API_URL: "https://api.test.com",
  fetchAllVideos: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("lucide-react/dist/esm/icons/play", () => ({
  default: (props: any) => <svg data-testid="play-icon" {...props} />,
}));

import { fetchAllVideos } from "@/lib/api";

const mockVideos = [
  {
    id: "v1", title: "AI Tutorial", youtubeId: "abc123", channel: "TechChannel",
    duration: "10:30", views: "100K views", publishedAt: "Jan 15, 2024",
    url: "https://youtube.com/watch?v=abc123", toolCategory: "general-ai",
    authorName: "TechChannel", description: "Learn AI basics",
  },
  {
    id: "v2", title: "ML Deep Dive", youtubeId: "def456", channel: "MLChannel",
    duration: "25:00", views: "50K views", publishedAt: "Feb 20, 2024",
    url: "https://youtube.com/watch?v=def456", toolCategory: "llm",
    authorName: "MLChannel", description: "Deep ML concepts",
  },
];

describe("VideosClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (fetchAllVideos as ReturnType<typeof vi.fn>).mockResolvedValue(mockVideos);
  });

  it("renders page heading", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    expect(screen.getByText("Trending AI Videos & Tutorials")).toBeInTheDocument();
  });

  it("shows loading state initially", () => {
    (fetchAllVideos as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    render(<VideosClient />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders videos after fetch", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("AI Tutorial")).toBeInTheDocument();
      expect(screen.getByText("ML Deep Dive")).toBeInTheDocument();
    });
  });

  it("renders video channel names", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("by TechChannel")).toBeInTheDocument();
      expect(screen.getByText("by MLChannel")).toBeInTheDocument();
    });
  });

  it("renders video durations", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("10:30")).toBeInTheDocument();
      expect(screen.getByText("25:00")).toBeInTheDocument();
    });
  });

  it("renders empty state when no videos", async () => {
    (fetchAllVideos as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("No videos found.")).toBeInTheDocument();
    });
  });

  it("does not show admin button for non-admin", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      expect(screen.getByText("AI Tutorial")).toBeInTheDocument();
    });
    expect(screen.queryByText("Add Video")).not.toBeInTheDocument();
  });

  it("renders play icons", async () => {
    await act(async () => {
      render(<VideosClient />);
    });
    await waitFor(() => {
      const playIcons = screen.getAllByTestId("play-icon");
      expect(playIcons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
