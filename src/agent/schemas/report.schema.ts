import { z } from 'zod';

import { SCORE_THRESHOLDS } from '@/constants/agent.constants';

/* ── Company Profile ───────────────────────────────────────── */
export const companyProfileSchema = z.object({
  name:         z.string().min(1),
  ticker:       z.string().min(1).toUpperCase(),
  sector:       z.string().min(1),
  industry:     z.string().min(1),
  description:  z.string().min(1),
  founded:      z.string(),
  headquarters: z.string(),
  employees:    z.number().int().nonnegative(),
  website:      z.string().url(),
});

/* ── Financial Metrics ─────────────────────────────────────── */
export const financialMetricsSchema = z.object({
  marketCap:          z.number().nonnegative(),
  peRatio:            z.number().nullable(),
  revenueGrowth:      z.number(),
  profitMargin:       z.number(),
  debtToEquity:       z.number().nonnegative(),
  currentRatio:       z.number().nonnegative(),
  returnOnEquity:     z.number(),
  earningsPerShare:   z.number(),
  dividendYield:      z.number().nonnegative().nullable(),
  fiftyTwoWeekHigh:   z.number().positive(),
  fiftyTwoWeekLow:    z.number().positive(),
  currentPrice:       z.number().positive(),
});

/* ── News Item ─────────────────────────────────────────────── */
export const newsItemSchema = z.object({
  title:       z.string().min(1),
  source:      z.string().min(1),
  url:         z.string().url(),
  publishedAt: z.string().datetime({ offset: true }),
  sentiment:   z.enum(['positive', 'negative', 'neutral']),
  summary:     z.string().min(1),
});

/* ── Competitor ────────────────────────────────────────────── */
export const competitorSchema = z.object({
  name:          z.string().min(1),
  ticker:        z.string().min(1).toUpperCase(),
  marketCap:     z.number().nonnegative(),
  peRatio:       z.number().nullable(),
  revenueGrowth: z.number(),
  summary:       z.string().min(1),
});

/* ── SWOT Analysis ─────────────────────────────────────────── */
export const swotAnalysisSchema = z.object({
  strengths:     z.array(z.string().min(1)).min(1),
  weaknesses:    z.array(z.string().min(1)).min(1),
  opportunities: z.array(z.string().min(1)).min(1),
  threats:       z.array(z.string().min(1)).min(1),
});

/* ── Risk Factor ───────────────────────────────────────────── */
export const riskFactorSchema = z.object({
  title:       z.string().min(1),
  description: z.string().min(1),
  severity:    z.enum(['low', 'medium', 'high']),
});

/* ── Recommendation ────────────────────────────────────────── */
export const recommendationSchema = z.enum(['INVEST', 'HOLD', 'PASS']);

/* ── Investment Report ─────────────────────────────────────── */
export const investmentReportSchema = z.object({
  id:               z.string().uuid(),
  company:          z.string().min(1),
  generatedAt:      z.string().datetime({ offset: true }),
  investmentScore:  z.number().int().min(0).max(100),
  confidenceScore:  z.number().int().min(0).max(100),
  recommendation:   recommendationSchema,
  executiveSummary: z.string().min(1),
  detailedReasoning: z.string().min(1),
  companyProfile:   companyProfileSchema,
  financialMetrics: financialMetricsSchema,
  recentNews:       z.array(newsItemSchema),
  competitors:      z.array(competitorSchema),
  swotAnalysis:     swotAnalysisSchema,
  riskFactors:      z.array(riskFactorSchema).min(1),
}).refine(
  (report) => {
    // Recommendation must be consistent with investmentScore
    if (report.investmentScore >= SCORE_THRESHOLDS.INVEST_MIN) {
      return report.recommendation === 'INVEST';
    }
    if (report.investmentScore >= SCORE_THRESHOLDS.HOLD_MIN) {
      return report.recommendation === 'HOLD';
    }
    return report.recommendation === 'PASS';
  },
  { message: 'Recommendation is inconsistent with investmentScore' }
);

/* ── Inferred Types ────────────────────────────────────────── */
// Single source of truth — types derived from schemas, never defined separately.
// These are the canonical domain types used across the entire application.
export type CompanyProfile   = z.infer<typeof companyProfileSchema>;
export type FinancialMetrics = z.infer<typeof financialMetricsSchema>;
export type NewsItem         = z.infer<typeof newsItemSchema>;
export type Competitor       = z.infer<typeof competitorSchema>;
export type SwotAnalysis     = z.infer<typeof swotAnalysisSchema>;
export type RiskFactor       = z.infer<typeof riskFactorSchema>;
export type Recommendation   = z.infer<typeof recommendationSchema>;
export type InvestmentReport = z.infer<typeof investmentReportSchema>;
