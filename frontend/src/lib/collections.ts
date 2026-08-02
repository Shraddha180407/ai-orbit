import type { CollectionsApiResponse, CollectionFilterParams, CollectionSubCategory } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function fetchCollections(
  params: CollectionFilterParams,
  signal?: AbortSignal
): Promise<CollectionsApiResponse> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.creatorType) query.set("creatorType", params.creatorType);
  if (params.subCategory) query.set("subCategory", params.subCategory);
  if (params.hasRelatedModels) query.set("hasRelatedModels", "true");
  if (params.hasRelatedCompanies) query.set("hasRelatedCompanies", "true");
  if (params.featured) query.set("featured", "true");
  if (params.updatedWithin) query.set("updatedWithin", params.updatedWithin);
  if (params.sort) query.set("sort", params.sort);
  if (params.cursor) query.set("cursor", params.cursor);

  // Backend reads categories via c.req.queries('category'), so append each separately
  if (params.category?.length) {
    for (const cat of params.category) {
      query.append("category", cat);
    }
  }

  const res = await fetch(`${API_BASE}/collections?${query.toString()}`, {
    signal,
    headers: { Accept: "application/json" },
  });

  const data: CollectionsApiResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function getCollectionDetail(slug: string) {
  const res = await fetch(`${API_BASE}/collections/${slug}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return { collection: data.collection, related: data.related ?? [] };
}

export async function toggleBookmark(
  collectionId: string,
  bookmarked: boolean
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/collections/${collectionId}/bookmark`, {
    method: bookmarked ? "DELETE" : "POST",
    headers: { Accept: "application/json" },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data.bookmarked as boolean;
}

export async function fetchCollectionSubCategories(): Promise<CollectionSubCategory[]> {
  const res = await fetch(`${API_BASE}/collections/subcategories`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  } as RequestInit);
  if (!res.ok) return [];
  return res.json();
}