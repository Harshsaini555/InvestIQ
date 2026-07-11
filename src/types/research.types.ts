import { z } from 'zod';

import {
  companyProfileResponseSchema,
  financialDataResponseSchema,
  newsResponseSchema,
  competitorResponseSchema,
  marketIntelligenceResponseSchema,
} from '@/services/research/schemas';

/* ── Domain Types (inferred from schemas) ──────────────────── */
export type CompanyProfileData     = z.infer<typeof companyProfileResponseSchema>;
export type FinancialData          = z.infer<typeof financialDataResponseSchema>;
export type NewsArticle            = z.infer<typeof newsResponseSchema>[number];
export type CompetitorData         = z.infer<typeof competitorResponseSchema>[number];
export type MarketIntelligenceData = z.infer<typeof marketIntelligenceResponseSchema>;

/* ── Research Bundle ───────────────────────────────────────── */
// Aggregates all research outputs for a single company.
// Consumed by LangGraph nodes in later phases.
export type ResearchBundle = {
  company:           string;
  collectedAt:       string;
  companyProfile:    CompanyProfileData;
  financialData:     FinancialData;
  news:              NewsArticle[];
  competitors:       CompetitorData[];
  marketIntelligence: MarketIntelligenceData;
};

/* ── Service Result ────────────────────────────────────────── */
// Every service function returns this discriminated union.
// Callers must check success before accessing data.
export type ServiceResult<T> =
  | { success: true;  data: T }
  | { success: false; error: ServiceError };

/* ── Service Error ─────────────────────────────────────────── */
export type ServiceErrorCode =
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'TIMEOUT'
  | 'INVALID_RESPONSE'
  | 'API_ERROR'
  | 'VALIDATION_ERROR';

export type ServiceError = {
  code:    ServiceErrorCode;
  message: string;
  api:     string;
};

/* ── Company Search Autocomplete Types ─────────────────────── */
export interface CompanySuggestion {
  name: string;
  ticker: string;
  exchange: string;
  country: string;
  industry?: string;
  logoUrl?: string | null;
  marketCap?: number | null;
  currency?: string | null;
  quoteType?: string | null;
  isTradable?: boolean | null;
}

export interface CompanySearchResponse {
  status: 'success' | 'not_found' | 'ambiguous' | 'private';
  message: string | null;
  suggestions: CompanySuggestion[];
}
