import { cachedFetchJson } from "@/lib/api";
import { EMPTY_HOME_FEED, fetchHomeFeed } from "@/lib/home-feed";

vi.mock("@/lib/api", () => ({
  API_URL: "http://localhost:8787",
  cachedFetchJson: vi.fn(),
}));

describe("fetchHomeFeed", () => {
  it("uses the cached fallback so unavailable feeds do not reject", async () => {
    vi.mocked(cachedFetchJson).mockResolvedValue(EMPTY_HOME_FEED);

    const result = await fetchHomeFeed({
      show: "tools,devices",
      page: 2,
      pageSize: 25,
    });

    expect(result).toEqual(EMPTY_HOME_FEED);
    expect(cachedFetchJson).toHaveBeenCalledWith(
      "http://localhost:8787/api/v1/feed?show=tools%2Cdevices&page=2&pageSize=25",
      EMPTY_HOME_FEED,
      { ttlMs: 5 * 60 * 1000 },
    );
  });
});
