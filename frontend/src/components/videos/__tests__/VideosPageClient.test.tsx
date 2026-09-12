import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VideosPageClient } from "../VideosPageClient";
import type { Video } from "@/lib/video-types";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

vi.mock("@/lib/videos-data", () => ({
  API_URL: "http://test",
  getVideosPage: vi.fn(),
  getVideosCount: vi.fn(),
  getCachedVideosPage: vi.fn().mockReturnValue(null),
  getCachedVideosCount: vi.fn().mockReturnValue(null),
  prefetchVideosCategory: vi.fn(),
  buildVideosPageUrl: vi.fn().mockReturnValue("http://test/api/videos"),
  buildVideosCountUrl: vi.fn().mockReturnValue("http://test/api/videos/count"),
  setInCache: vi.fn(),
}));

import { getVideosPage, getVideosCount, getCachedVideosPage } from "@/lib/videos-data";

const mockInitialVideos: Video[] = [
  {
    id: "v1",
    title: "Initial Video 1",
    youtubeId: "yt1",
    channel: "Channel A",
    channelTitle: "Channel A",
    duration: "10:00",
    views: "10K views",
    viewCount: 10000,
    publishedAt: "2024-01-01",
    publishedAtFormatted: "Jan 1, 2024",
    url: "https://youtube.com/watch?v=yt1",
    toolCategory: "general-ai",
    authorName: "Channel A",
    description: "Description 1",
    slug: "initial-video-1",
    thumbnail: "https://img.youtube.com/vi/yt1/hqdefault.jpg",
  },
];

const mockMultimodalVideos: Video[] = [
  {
    id: "v2",
    title: "Multimodal AI Tutorial",
    youtubeId: "yt2",
    channel: "Channel B",
    channelTitle: "Channel B",
    duration: "15:00",
    views: "50K views",
    viewCount: 50000,
    publishedAt: "2024-02-01",
    publishedAtFormatted: "Feb 1, 2024",
    url: "https://youtube.com/watch?v=yt2",
    toolCategory: "multimodal-ai",
    authorName: "Channel B",
    description: "Multimodal description",
    slug: "multimodal-tutorial",
    thumbnail: "https://img.youtube.com/vi/yt2/hqdefault.jpg",
  },
];

describe("VideosPageClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
    (getVideosPage as any).mockResolvedValue(mockMultimodalVideos);
    (getVideosCount as any).mockResolvedValue(1);
    (getCachedVideosPage as any).mockReturnValue(null);
  });

  it("renders initial category chips and initial videos", () => {
    render(
      <VideosPageClient
        initialVideos={mockInitialVideos}
        initialTotal={1}
        pageSize={100}
      />
    );

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Multimodal AI")).toBeInTheDocument();
    expect(screen.getAllByText("Initial Video 1").length).toBeGreaterThan(0);
  });

  it("immediately updates URL and fetches new videos when a category chip is clicked", async () => {
    render(
      <VideosPageClient
        initialVideos={mockInitialVideos}
        initialTotal={1}
        pageSize={100}
      />
    );

    const multimodalBtn = screen.getByText("Multimodal AI");
    await act(async () => {
      fireEvent.click(multimodalBtn);
    });

    // Verify router.push called with the category without hard refresh
    expect(mockPush).toHaveBeenCalledWith("/videos?category=multimodal-ai", { scroll: false });

    // Verify data fetch was triggered for the new category
    await waitFor(() => {
      expect(getVideosPage).toHaveBeenCalledWith(100, 0, "multimodal-ai", "posted", "desc");
      expect(screen.getAllByText("Multimodal AI Tutorial").length).toBeGreaterThan(0);
    });
  });

  it("uses cached data immediately (0ms) when available", async () => {
    (getCachedVideosPage as any).mockReturnValue(mockMultimodalVideos);

    render(
      <VideosPageClient
        initialVideos={mockInitialVideos}
        initialTotal={1}
        pageSize={100}
      />
    );

    const multimodalBtn = screen.getByText("Multimodal AI");
    await act(async () => {
      fireEvent.click(multimodalBtn);
    });

    // Content should show immediately from synchronous cache swap
    expect(screen.getAllByText("Multimodal AI Tutorial").length).toBeGreaterThan(0);
  });

  it("synchronizes when initialVideos prop changes from server", async () => {
    const { rerender } = render(
      <VideosPageClient
        initialVideos={mockInitialVideos}
        initialTotal={1}
        pageSize={100}
      />
    );

    expect(screen.getAllByText("Initial Video 1").length).toBeGreaterThan(0);

    // Server re-renders or navigates with new props
    rerender(
      <VideosPageClient
        initialVideos={mockMultimodalVideos}
        initialTotal={1}
        pageSize={100}
        defaultCategory="multimodal-ai"
      />
    );

    await waitFor(() => {
      expect(screen.getAllByText("Multimodal AI Tutorial").length).toBeGreaterThan(0);
    });
  });
});
