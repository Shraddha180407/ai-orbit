'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

let globalQueryClient: QueryClient | null = null;

export function getGlobalQueryClient(): QueryClient {
  if (!globalQueryClient) {
    globalQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 15 * 60 * 1000,   // 15 minutes — serve cached data instantly with 0ms lag
          gcTime: 24 * 60 * 60 * 1000, // 24 hours — keep data in memory to avoid screen flashing
          retry: 1,
          refetchOnWindowFocus: false, // Don't refetch on window focus to avoid noise and tab-switch lag
          refetchOnMount: false,       // Don't refetch on component remount if cached
          refetchOnReconnect: false,   // Avoid unexpected layout shifts on network reconnect
        },
      },
    });
  }
  return globalQueryClient;
}

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getGlobalQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
