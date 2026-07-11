import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type CompanySearchResponse } from '@/types/research.types';

/**
 * Custom hook to manage company autocomplete search queries.
 * Integrates with TanStack Query for request debouncing, caching, and auto-cancellation.
 */
export function useCompanySearch(initialQuery = '') {
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);

  // Debounce searchTerm changes by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useQuery<CompanySearchResponse>({
    queryKey: ['companySearch', debouncedTerm],
    queryFn: async ({ signal }) => {
      const trimmed = debouncedTerm.trim();
      if (!trimmed) return { status: 'not_found', message: null, suggestions: [] };

      const res = await fetch(`/api/company/search?q=${encodeURIComponent(trimmed)}`, { signal });
      if (!res.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Suggestions lookup failed');
      }
      return json.data as CompanySearchResponse;
    },
    enabled: debouncedTerm.trim().length > 0,
    staleTime: 5 * 60 * 1000, // Cache results for 5 minutes
  });

  return {
    searchTerm,
    setSearchTerm,
    suggestions: debouncedTerm.trim().length > 0 ? (data?.suggestions || []) : [],
    status: data?.status || 'success',
    message: data?.message || null,
    isLoading: isLoading && debouncedTerm.trim().length > 0,
    isError,
    error: error instanceof Error ? error.message : String(error),
  };
}
