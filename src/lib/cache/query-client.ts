'use client';

import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 60 seconds
        staleTime: 60 * 1000,
        // Keep unused data in cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests once before surfacing error
        retry: 1,
        retryDelay: 1000,
        // Don't refetch on window focus for this app (reports are static)
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Singleton for client-side — avoids creating a new client on every render
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new client
    return makeQueryClient();
  }

  // Browser: reuse existing client
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
