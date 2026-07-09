import { QueryClient } from "@tanstack/react-query";

/**
 * Shared TanStack Query client. Used for API/server-state and sync mutation
 * state only — SQLite remains the durable offline source of truth.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5000,
    },
    mutations: {
      retry: 0,
    },
  },
});
