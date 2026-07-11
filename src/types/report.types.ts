import { type Recommendation } from '@/types/agent.types';

/* ── Company Profile ───────────────────────────────────────── */
export type CompanyProfile = {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  description: string;
  founded: string;
  headquarters: string;
  employees: number;
  website: string;
};

/* ── Financial Metrics ─────────────────────────────────────── */
export type FinancialMetrics = {
  marketCap: number;
  peRatio: number | null;
  revenueGrowth: number;
  profitMargin: number;
  debtToEquity: number;
  currentRatio: number;
  returnOnEquity: number;
  earningsPerShare: number;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currentPrice: number;
};

/* ── News Item ─────────────────────────────────────────────── */
export type NewsItem = {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
};

/* ── Competitor ────────────────────────────────────────────── */
export type Competitor = {
  name: string;
  ticker: string;
  marketCap: number;
  peRatio: number | null;
  revenueGrowth: number;
  summary: string;
};

/* ── SWOT Analysis ─────────────────────────────────────────── */
export type SwotAnalysis = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

/* ── Risk Factor ───────────────────────────────────────────── */
export type RiskFactor = {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
};

/* ── Investment Report ─────────────────────────────────────── */
export type InvestmentReport = {
  id: string;
  company: string;
  generatedAt: string;
  investmentScore: number;
  confidenceScore: number;
  recommendation: Recommendation;
  executiveSummary: string;
  detailedReasoning: string;
  companyProfile: CompanyProfile;
  financialMetrics: FinancialMetrics;
  recentNews: NewsItem[];
  competitors: Competitor[];
  swotAnalysis: SwotAnalysis;
  riskFactors: RiskFactor[];
};
