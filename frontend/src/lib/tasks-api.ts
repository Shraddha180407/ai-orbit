function resolveApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url && url.startsWith("http") && url !== "undefined") {
    return url.replace(/\/$/, "");
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

export type Task = {
  id: string;
  slug: string;
  title: string;
  description: string;
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

export type TaskListResponse = {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
  sort: string;
  categories: Category[];
};

export type TaskDetailResponse = {
  task: Task;
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
    // Body wasn't JSON or didn't match the expected shape — fall through
    // to a generic 401 auth error, since the status code is authoritative.
  }
  return new AuthRequiredError();
}

export async function fetchTasks(params: FetchTasksParams = {}): Promise<TaskListResponse> {
  const url = `${BASE_URL}/api/v1/tasks${buildQueryString(params)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while fetching tasks.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to fetch tasks (status ${res.status}).`, res.status);
  }

  return (await res.json()) as TaskListResponse;
}

export async function fetchTask(slug: string): Promise<TaskDetailResponse | null> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while fetching task detail.");
  }

  if (res.status === 404) {
    return null;
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to fetch task "${slug}" (status ${res.status}).`, res.status);
  }

  return (await res.json()) as TaskDetailResponse;
}

export async function toggleBookmark(slug: string, taskId: string): Promise<BookmarkResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/bookmark`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
  } catch {
    throw new TasksApiError("Network error while toggling bookmark.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle bookmark (status ${res.status}).`, res.status);
  }

  return (await res.json()) as BookmarkResponse;
}

export async function toggleLike(slug: string): Promise<LikeResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/like`;

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while toggling like.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle like (status ${res.status}).`, res.status);
  }

  return (await res.json()) as LikeResponse;
}

export async function toggleSubscribe(slug: string): Promise<SubscribeResponse> {
  const url = `${BASE_URL}/api/v1/tasks/${encodeURIComponent(slug)}/subscribe`;

  let res: Response;
  try {
    res = await fetch(url, { method: "POST", credentials: "include" });
  } catch {
    throw new TasksApiError("Network error while toggling subscribe.");
  }

  const authError = await parseAuthError(res);
  if (authError) throw authError;

  if (!res.ok) {
    throw new TasksApiError(`Failed to toggle subscribe (status ${res.status}).`, res.status);
  }

  return (await res.json()) as SubscribeResponse;
}