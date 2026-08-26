import { cachedFetchJson } from "./api-cache";

function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url.startsWith("http") && url !== "undefined") {
    return url.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8787";
  }
  return "https://ai-orbit.palamrendra-pm.workers.dev";
}
const BASE_URL = resolveApiUrl();

export type Difficulty = "EASY" | "MEDIUM" | "ADVANCED";
export type PricingModel = "FREE" | "FREEMIUM" | "PAID" | "FREE_TRIAL";
export type SortOption = "newest" | "oldest" | "alphabetical" | "popular";
export type FilterOption = "all" | "for-you" | "following";

export type Category = {
  slug: string;
  name: string;
};

export type Creator = {
  id?: string;
  name: string;
  avatarUrl?: string;
} | null;

export type PopularTool = {
  slug: string;
  name: string;
  logoUrl: string | null;
  tagline: string | null;
  pricingModel: string | null;
  rating: number | null;
  bookmarkCount: number | null;
  visitUrl: string | null;
};

export type Task = {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconUrl: string | null;
  difficulty: Difficulty;
  pricingModel: PricingModel;
  isFeatured: boolean;
  category: Category;
  creator: Creator;
  createdAt: string;
  likes: number | null;
  subscribers: number | null;
  saves: number | null;
  resources: number | null;
  tools: number | null;
  models: number | null;
  robots: number | null;
  devices: number | null;
  url?: string;
};

export type TaskDetail = Task & {
  popularTools: PopularTool[];
};

export type TaskListResponse = {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
  sort: string;
  categories: Category[];
};

export type TaskDetailResponse = {
  task: TaskDetail;
  bookmarked: boolean;
  liked: boolean;
  subscribed: boolean;
};

export type BookmarkResponse = { bookmarked: boolean };
export type LikeResponse = { liked: boolean };
export type SubscribeResponse = { subscribed: boolean };

export type FetchTasksParams = {
  q?: string;
  category?: string;
  difficulty?: Difficulty;
  pricing?: PricingModel;
  featuredOnly?: boolean;
  sort?: SortOption;
  filter?: FilterOption;
  page?: number;
};

class TasksApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "TasksApiError";
    this.status = status;
  }
}

export class AuthRequiredError extends Error {
  constructor(message = "You need to be logged in to see this.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

function buildQueryString(params: FetchTasksParams): string {
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.difficulty) search.set("difficulty", params.difficulty);
  if (params.pricing) search.set("pricing", params.pricing);
  if (params.featuredOnly) search.set("featuredOnly", "true");
  if (params.sort) search.set("sort", params.sort);
  if (params.filter && params.filter !== "all") search.set("filter", params.filter);
  if (params.page) search.set("page", String(params.page));

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function parseAuthError(res: Response): Promise<AuthRequiredError | null> {
  if (res.status !== 401) return null;
  try {
    const body = await res.clone().json();
    if (body?.code === "AUTH_REQUIRED") {
      return new AuthRequiredError(body?.error || "You need to be logged in to see this.");
    }
  } catch {
    // Fall through
  }
  return new AuthRequiredError();
}

export async function fetchTasks(params: FetchTasksParams = {}): Promise<TaskListResponse> {
  const url = `${BASE_URL}/api/v1/tasks${buildQueryString(params)}`;

  const fallback: TaskListResponse = {
    tasks: [],
    total: 0,
    page: params.page || 1,
    totalPages: 1,
    categories: [],
    sort: params.sort || "newest",
  };

  // If user filtering ("for-you" or "following"), fetch with auth credentials directly
  if (params.filter && params.filter !== "all") {
    try {
      const res = await fetch(url, { credentials: "include" });
      const authError = await parseAuthError(res);
      if (authError) throw authError;
      if (!res.ok) return fallback;
      return (await res.json()) as TaskListResponse;
    } catch (e) {
      if (e instanceof AuthRequiredError) throw e;
      return fallback;
    }
  }

  return cachedFetchJson<TaskListResponse>(url, fallback, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchTask(slug: string): Promise<TaskDetailResponse | null> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}`;
  return cachedFetchJson<TaskDetailResponse | null>(url, null, { ttlMs: 15 * 60 * 1000 });
}

export async function fetchCategories(): Promise<Category[]> {
  const url = `${BASE_URL}/api/v1/tasks/categories`;
  return cachedFetchJson<Category[]>(url, [], { ttlMs: 30 * 60 * 1000 });
}

export async function toggleTaskBookmark(slug: string, _taskId?: string): Promise<BookmarkResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/bookmark`;
  let res: Response;
  try {
    res = await fetch(url, { method: "POST", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while bookmarking task.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle bookmark (status ${res.status}).`, res.status);
  }

  return (await res.json()) as BookmarkResponse;
}

export async function toggleTaskLike(slug: string): Promise<LikeResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/like`;
  let res: Response;
  try {
    res = await fetch(url, { method: "POST", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while liking task.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle like (status ${res.status}).`, res.status);
  }

  return (await res.json()) as LikeResponse;
}

export async function toggleTaskSubscription(slug: string): Promise<SubscribeResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/subscribe`;
  let res: Response;
  try {
    res = await fetch(url, { method: "POST", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while subscribing to task.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle subscription (status ${res.status}).`, res.status);
  }

  return (await res.json()) as SubscribeResponse;
}

export const toggleBookmark = toggleTaskBookmark;
export const toggleLike = toggleTaskLike;
export const toggleSubscribe = toggleTaskSubscription;