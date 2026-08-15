'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000,  // 10 minutes — cached data stays fresh during navigation
        gcTime: 30 * 60 * 1000,     // 30 minutes — keep data in memory even after component unmounts
        retry: false,               // Don't retry failed API calls (avoids flashing on DB disconnect)
        refetchOnWindowFocus: false, // Don't refetch when switching browser tabs
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
