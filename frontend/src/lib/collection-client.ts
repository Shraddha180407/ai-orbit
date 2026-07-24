import { useEffect, useState } from "react";
import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import type {
    CollectionsApiResponse,
    CollectionFilterParams,
} from "@/lib/types";


// ----------------------------------------
// Fetch Collections
// ----------------------------------------

async function fetchCollections(
    params: CollectionFilterParams
): Promise<CollectionsApiResponse> {
    const search = new URLSearchParams();

    if (params.search)
        search.set("search", params.search);

    if (params.sort)
        search.set("sort", params.sort);

    if (params.creatorType)
        search.set("creatorType", params.creatorType);

    if (params.featured)
        search.set("featured", "true");

    if (params.hasRelatedModels)
        search.set("hasRelatedModels", "true");

    if (params.hasRelatedCompanies)
        search.set("hasRelatedCompanies", "true");

    if (params.updatedWithin)
        search.set("updatedWithin", params.updatedWithin);

    if (params.cursor)
        search.set("cursor", params.cursor);

    if (params.category?.length) {
        params.category.forEach((cat) =>
            search.append("category", cat)
        );
    }

    const res = await fetch(`/api/collections?${search.toString()}`);

    if (!res.ok) {
        throw new Error("Failed to fetch collections");
    }

    return res.json();
}



// ----------------------------------------
// Bookmark
// ----------------------------------------

class BookmarkError extends Error { }

async function setBookmark(
    id: string,
    bookmarked: boolean
) {
    const res = await fetch(
        `/api/collections/${id}/bookmark`,
        {
            method: bookmarked ? "POST" : "DELETE",
        }
    );

    if (!res.ok) {
        throw new BookmarkError();
    }

    return res.json();
}



// ----------------------------------------
// Debounce
// ----------------------------------------

export function useDebouncedValue<T>(
    value: T,
    delay = 300
) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(
            () => setDebounced(value),
            delay
        );

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}



// ----------------------------------------
// Infinite Query
// ----------------------------------------

export function useCollectionsInfinite(
    params: Omit<CollectionFilterParams, "cursor">
) {
    return useInfiniteQuery({
        queryKey: ["collections", params],

        queryFn: ({ pageParam = undefined }) =>
            fetchCollections({
                ...params,
                cursor: pageParam,
            }),

        initialPageParam: undefined as string | undefined,

        getNextPageParam: (lastPage) =>
            lastPage.nextCursor ?? undefined,
    });
}



// ----------------------------------------
// Bookmark Mutation
// ----------------------------------------

export function useBookmarkMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            bookmarked,
        }: {
            id: string;
            bookmarked: boolean;
        }) => setBookmark(id, bookmarked),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collections"],
            });
        },
    });
}