import { describe, it, expect } from "vitest";
import {
  sortArticles,
  applySearch,
  defaultSortDir,
  nextSortState,
  buildTopicOptions,
  buildSourceOptions,
} from "@/lib/news/news";
import type { NewsArticle, NewsSource, SortState } from "@/types/news";

const mockSources: Record<string, NewsSource> = {
  sourceA: { name: "Alpha News", domain: "alpha.com", color: "#f00", followers: "10K", logoUrl: null },
  sourceB: { name: "Beta Daily", domain: "beta.com", color: "#0f0", followers: "5K", logoUrl: null },
};

const mockArticles: NewsArticle[] = [
  {
    id: "1",
    headline: "Alpha launches new model",
    dek: "Alpha announces a breakthrough AI model.",
    aiSummary: "Summary 1",
    articleUrl: "https://alpha.com/article1",
    category: "AI",
    topics: ["AI", "Models"],
    source: "sourceA",
    hours: 2,
    up: 10,
    down: 2,
    filters: [],
    bookmarked: false,
    score: 80,
  },
  {
    id: "2",
    headline: "Beta releases open source tool",
    dek: "Beta releases a new open source AI tool.",
    aiSummary: "Summary 2",
    articleUrl: "https://beta.com/article2",
    category: "Tools",
    topics: ["Open Source", "Tools"],
    source: "sourceB",
    hours: 48,
    up: 5,
    down: 1,
    filters: [],
    bookmarked: false,
    score: 60,
  },
  {
    id: "3",
    headline: "Gamma raises funding round",
    dek: "Gamma closes a major funding round for AI development.",
    aiSummary: "Summary 3",
    articleUrl: "https://gamma.com/article3",
    category: "Funding",
    topics: ["AI", "Funding"],
    source: "sourceA",
    hours: 12,
    up: 8,
    down: 0,
    filters: [],
    bookmarked: false,
    score: 90,
  },
];

describe("sortArticles", () => {
  it("sorts by date descending (newest first)", () => {
    // desc: dir=-1, comparator (a,b)=>b.hours-a.hours * -1 = a.hours-b.hours => lowest hours first (newest)
    const result = sortArticles(mockArticles, { key: "date", dir: "desc" }, mockSources);
    expect(result[0].id).toBe("1"); // 2h ago (newest)
    expect(result[2].id).toBe("2"); // 48h ago (oldest)
  });

  it("sorts by date ascending (oldest first)", () => {
    // asc: dir=1, comparator (a,b)=>b.hours-a.hours => highest hours first (oldest)
    const result = sortArticles(mockArticles, { key: "date", dir: "asc" }, mockSources);
    expect(result[0].id).toBe("2"); // 48h ago (oldest)
    expect(result[2].id).toBe("1"); // 2h ago (newest)
  });

  it("sorts by title ascending", () => {
    const result = sortArticles(mockArticles, { key: "title", dir: "asc" }, mockSources);
    expect(result[0].headline).toBe("Alpha launches new model");
    expect(result[2].headline).toBe("Gamma raises funding round");
  });

  it("sorts by title descending", () => {
    const result = sortArticles(mockArticles, { key: "title", dir: "desc" }, mockSources);
    expect(result[0].headline).toBe("Gamma raises funding round");
  });

  it("sorts by source ascending", () => {
    const result = sortArticles(mockArticles, { key: "source", dir: "asc" }, mockSources);
    expect(result[0].source).toBe("sourceA");
    expect(result[2].source).toBe("sourceB");
  });

  it("sorts by trending descending", () => {
    const result = sortArticles(mockArticles, { key: "trending", dir: "desc" }, mockSources);
    expect(result[0].id).toBe("3"); // score 90
    expect(result[2].id).toBe("2"); // score 60
  });

  it("sorts by topics ascending", () => {
    const result = sortArticles(mockArticles, { key: "topics", dir: "asc" }, mockSources);
    expect(result[0].topics[0]).toBe("AI");
  });

  it("does not mutate original array", () => {
    const original = [...mockArticles];
    sortArticles(mockArticles, { key: "date", dir: "desc" }, mockSources);
    expect(mockArticles).toEqual(original);
  });
});

describe("applySearch", () => {
  it("returns all articles for empty query", () => {
    expect(applySearch(mockArticles, "", mockSources)).toHaveLength(3);
  });

  it("filters by headline", () => {
    // "alpha" matches article 1 (headline) and article 3 (source name "Alpha News")
    const result = applySearch(mockArticles, "alpha", mockSources);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((a) => a.id === "1")).toBe(true);
  });

  it("filters by description", () => {
    const result = applySearch(mockArticles, "open source", mockSources);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("filters by topics", () => {
    const result = applySearch(mockArticles, "Funding", mockSources);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("3");
  });

  it("filters by source name", () => {
    const result = applySearch(mockArticles, "Beta Daily", mockSources);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("is case-insensitive", () => {
    // "ALPHA" matches article 1 (headline) and article 3 (source name "Alpha News")
    const result = applySearch(mockArticles, "ALPHA", mockSources);
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some((a) => a.id === "1")).toBe(true);
  });

  it("returns empty for no matches", () => {
    expect(applySearch(mockArticles, "nonexistent", mockSources)).toHaveLength(0);
  });

  it("handles whitespace-only query", () => {
    expect(applySearch(mockArticles, "   ", mockSources)).toHaveLength(3);
  });
});

describe("defaultSortDir", () => {
  it("returns asc for title", () => {
    expect(defaultSortDir("title")).toBe("asc");
  });

  it("returns asc for source", () => {
    expect(defaultSortDir("source")).toBe("asc");
  });

  it("returns asc for topics", () => {
    expect(defaultSortDir("topics")).toBe("asc");
  });

  it("returns desc for date", () => {
    expect(defaultSortDir("date")).toBe("desc");
  });

  it("returns desc for trending", () => {
    expect(defaultSortDir("trending")).toBe("desc");
  });
});

describe("nextSortState", () => {
  it("toggles direction when same key", () => {
    const current: SortState = { key: "date", dir: "desc" };
    const result = nextSortState(current, "date");
    expect(result).toEqual({ key: "date", dir: "asc" });
  });

  it("resets to default direction for new key", () => {
    const current: SortState = { key: "date", dir: "desc" };
    const result = nextSortState(current, "title");
    expect(result).toEqual({ key: "title", dir: "asc" });
  });

  it("toggles asc to desc", () => {
    const current: SortState = { key: "title", dir: "asc" };
    const result = nextSortState(current, "title");
    expect(result).toEqual({ key: "title", dir: "desc" });
  });
});

describe("buildTopicOptions", () => {
  it("builds topic options with counts", () => {
    const options = buildTopicOptions(mockArticles);
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: "AI", label: "AI", count: 2 }),
        expect.objectContaining({ value: "Funding", label: "Funding", count: 1 }),
        expect.objectContaining({ value: "Models", label: "Models", count: 1 }),
      ])
    );
  });

  it("returns sorted alphabetically", () => {
    const options = buildTopicOptions(mockArticles);
    const labels = options.map((o) => o.label);
    expect(labels).toEqual([...labels].sort());
  });

  it("returns empty array for no articles", () => {
    expect(buildTopicOptions([])).toEqual([]);
  });
});

describe("buildSourceOptions", () => {
  it("builds source options with counts", () => {
    const options = buildSourceOptions(mockArticles, mockSources);
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ value: "sourceA", label: "Alpha News", count: 2 }),
        expect.objectContaining({ value: "sourceB", label: "Beta Daily", count: 1 }),
      ])
    );
  });

  it("returns sorted by source name", () => {
    const options = buildSourceOptions(mockArticles, mockSources);
    expect(options[0].label).toBe("Alpha News");
    expect(options[1].label).toBe("Beta Daily");
  });

  it("returns empty array for no articles", () => {
    expect(buildSourceOptions([], mockSources)).toEqual([]);
  });
});
