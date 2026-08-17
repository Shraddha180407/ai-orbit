'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // In development, refetch in the background immediately so changes are visible instantly.
        // In production, keep cache fresh for 10 minutes.
        staleTime: process.env.NODE_ENV === 'development' ? 0 : 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,     // 30 minutes — keep data in memory to avoid screen flashing
        retry: false,               // Don't retry failed API calls (avoids flashing on DB disconnect)
        refetchOnWindowFocus: process.env.NODE_ENV !== 'development', // Don't refetch on window focus in dev to avoid noise
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
