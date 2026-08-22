'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000,   // 10 minutes — serve cached data instantly with 0ms lag
        gcTime: 60 * 60 * 1000,      // 60 minutes — keep data in memory to avoid screen flashing
        retry: 1,
        refetchOnWindowFocus: false, // Don't refetch on window focus to avoid noise and tab-switch lag
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
