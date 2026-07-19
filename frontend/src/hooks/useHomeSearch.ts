import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { fetchSearchAutocomplete, fetchPopularSearches, RealSearchSuggestion } from "@/lib/api";

/**
 * Real-backend counterpart to hooks/useAutocomplete.ts (which is wired to
 * the mock search module used by /search). This one calls
 * /api/v1/search/autocomplete and /api/v1/search/popular directly, for the
 * homepage hero search bar where suggestions must point at real DB rows.
 */
export function useHomeSearch(query: string) {
  const [suggestions, setSuggestions] = useState<RealSearchSuggestion[]>([]);
  const [popular, setPopular] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounced = useDebounce(query, 200);

  // Popular terms only need to load once (empty-query state).
  useEffect(() => {
    let cancelled = false;
    fetchPopularSearches().then((terms) => {
      if (!cancelled) setPopular(terms);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const trimmed = debounced.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    fetchSearchAutocomplete(trimmed)
      .then((results) => {
        if (!cancelled) setSuggestions(results);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return { suggestions, popular, isLoading };
}
