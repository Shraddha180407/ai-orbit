import { API_URL, cachedFetchJson } from "@/lib/api";
import type { ToolCardData } from "@/lib/types";

export interface HomeFeedData {
  items?: ToolCardData[];
  tools?: ToolCardData[];
  total?: number;
  totalPages?: number;
}

export const EMPTY_HOME_FEED: HomeFeedData = {
  items: [],
  total: 0,
  totalPages: 1,
};

interface HomeFeedParams {
  show: string;
  page: number;
  pageSize: number;
}

export function fetchHomeFeed({ show, page, pageSize }: HomeFeedParams) {
  const query = new URLSearchParams({
    show,
    page: String(page),
    pageSize: String(pageSize),
  });

  return cachedFetchJson<HomeFeedData>(
    `${API_URL}/api/v1/feed?${query.toString()}`,
    EMPTY_HOME_FEED,
    { ttlMs: 5 * 60 * 1000 },
  );
}
