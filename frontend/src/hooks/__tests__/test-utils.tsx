import React, { ReactElement } from "react";
import { renderHook, RenderHookOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function createWrapper() {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

export function renderHookWithQueryClient<TResult>(
  hook: () => TResult,
  options?: Omit<RenderHookOptions<unknown>, "wrapper">
) {
  return renderHook(hook, { wrapper: createWrapper(), ...options });
}
