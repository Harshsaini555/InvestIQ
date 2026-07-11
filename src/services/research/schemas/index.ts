import { z } from 'zod';

/* ── Company Profile ───────────────────────────────────────── */
export const companyProfileResponseSchema = z.object({
  name:        z.string().min(1),
  ticker:      z.string().min(1),
  exchange:    z.string(),
  sector:      z.string(),
  industry:    z.string(),
  description: z.string(),
  ceo:         z.string(),
  founded:     z.string(),
  employees:   z.number().int().nonnegative(),
  country:     z.string(),
  headquarters: z.string(),
  website:     z.string().url(),
  marketCap:   z.number().nonnegative(),
  logoUrl:     z.string().url().nullable(),
});

/* ── Financial Data ────────────────────────────────────────── */
export const financialDataResponseSchema = z.object({
  ticker:         z.string().min(1),
  currency:       z.string().length(3),
  currentPrice:   z.number().positive(),
  fiftyTwoWeekHigh: z.number().positive(),
  fiftyTwoWeekLow:  z.number().positive(),
  marketCap:      z.number().nonnegative(),
  beta:           z.number().nullable(),
  peRatio:        z.number().nullable(),
  pegRatio:       z.number().nullable(),
  eps:            z.number().nullable(),
  dividendYield:  z.number().nonnegative().nullable(),
  revenue:        z.number().nonnegative().nullable(),
  netIncome:      z.number().nullable(),
  operatingIncome: z.number().nullable(),
  revenueGrowth:  z.number().nullable(),
  profitMargin:   z.number().nullable(),
  debtToEquity:   z.number().nonnegative().nullable(),
  freeCashFlow:   z.number().nullable(),
  operatingCashFlow: z.number().nullable(),
});

/* ── News Article ──────────────────────────────────────────── */
export const newsArticleSchema = z.object({
  title:       z.string().min(1),
  summary:     z.string(),
  source:      z.string().min(1),
  publishedAt: z.string(),
  url:         z.string().url(),
  category:    z.string(),
});

export const newsResponseSchema = z.array(newsArticleSchema);

/* ── Competitor ────────────────────────────────────────────── */
export const competitorItemSchema = z.object({
  name:        z.string().min(1),
  ticker:      z.string().min(1),
  industry:    z.string(),
  marketCap:   z.number().nonnegative().nullable(),
  currentPrice: z.number().positive().nullable(),
  description: z.string(),
});

export const competitorResponseSchema = z.array(competitorItemSchema);

/* ── Market Intelligence ───────────────────────────────────── */
export const marketIntelligenceResponseSchema = z.object({
  country:              z.string(),
  sectorPerformance:    z.string(),
  industryPerformance:  z.string(),
  economicEnvironment:  z.string(),
  recentEvents:         z.array(z.string()),
});

/* ── Yahoo Finance Quote (raw API shape) ───────────────────── */
// Used internally by the Yahoo Finance service to validate the raw response
// before mapping to our domain schema.
export const yahooQuoteSchema = z.object({
  symbol:                    z.string(),
  shortName:                 z.string().optional(),
  longName:                  z.string().optional(),
  regularMarketPrice:        z.number().optional(),
  regularMarketDayHigh:      z.number().optional(),
  regularMarketDayLow:       z.number().optional(),
  fiftyTwoWeekHigh:          z.number().optional(),
  fiftyTwoWeekLow:           z.number().optional(),
  marketCap:                 z.number().optional(),
  trailingPE:                z.number().optional(),
  forwardPE:                 z.number().optional(),
  trailingEps:               z.number().optional(),
  dividendYield:             z.number().optional(),
  beta:                      z.number().optional(),
  currency:                  z.string().optional(),
});

export const yahooSummarySchema = z.object({
  assetProfile: z.object({
    longBusinessSummary: z.string().optional(),
    sector:              z.string().optional(),
    industry:            z.string().optional(),
    country:             z.string().optional(),
    city:                z.string().optional(),
    website:             z.string().optional(),
    fullTimeEmployees:   z.number().optional(),
    companyOfficers:     z.array(z.object({
      name:  z.string(),
      title: z.string().optional(),
    })).optional(),
  }).optional(),
  financialData: z.object({
    totalRevenue:        z.object({ raw: z.number().optional() }).optional(),
    netIncomeToCommon:   z.object({ raw: z.number().optional() }).optional(),
    operatingIncome:     z.object({ raw: z.number().optional() }).optional(),
    revenueGrowth:       z.object({ raw: z.number().optional() }).optional(),
    profitMargins:       z.object({ raw: z.number().optional() }).optional(),
    debtToEquity:        z.object({ raw: z.number().optional() }).optional(),
    freeCashflow:        z.object({ raw: z.number().optional() }).optional(),
    operatingCashflow:   z.object({ raw: z.number().optional() }).optional(),
    pegRatio:            z.object({ raw: z.number().optional() }).optional(),
  }).optional(),
  defaultKeyStatistics: z.object({
    trailingEps:         z.object({ raw: z.number().optional() }).optional(),
    forwardEps:          z.object({ raw: z.number().optional() }).optional(),
    beta:                z.object({ raw: z.number().optional() }).optional(),
  }).optional(),
});

/* ── NewsAPI raw response ──────────────────────────────────── */
export const newsApiArticleSchema = z.object({
  title:       z.string().nullable(),
  description: z.string().nullable(),
  source:      z.object({ name: z.string() }),
  publishedAt: z.string(),
  url:         z.string().url(),
  urlToImage:  z.string().nullable().optional(),
});

export const newsApiResponseSchema = z.object({
  status:   z.string(),
  articles: z.array(newsApiArticleSchema),
});
