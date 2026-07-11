import { z } from 'zod';

/* ── Score Item Schema ─────────────────────────────────────── */
export const scoreSchema = z.object({
  value: z.number().min(0).max(100),
  reason: z.string().min(1),
  confidence: z.number().min(0).max(100),
});

/* ── Risk Rating Schema ────────────────────────────────────── */
export const riskRatingSchema = z.object({
  rating: z.enum(['Low', 'Medium', 'High']),
  explanation: z.string().min(1),
});

/* ── SWOT Schema ───────────────────────────────────────────── */
export const swotSchema = z.object({
  strengths: z.array(z.string().min(1)).min(3, 'Strengths must contain at least 3 points'),
  weaknesses: z.array(z.string().min(1)).min(3, 'Weaknesses must contain at least 3 points'),
  opportunities: z.array(z.string().min(1)).min(3, 'Opportunities must contain at least 3 points'),
  threats: z.array(z.string().min(1)).min(3, 'Threats must contain at least 3 points'),
});

/* ── News Article Analysis Schema ────────────────────────── */
export const newsAnalysisItemSchema = z.object({
  title: z.string().min(1),
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  investmentImpact: z.string().min(1),
});

/* ── Competitor Analysis Item Schema ───────────────────────── */
export const competitorAnalysisItemSchema = z.object({
  competitorName: z.string().min(1),
  ticker: z.string().toUpperCase().min(1),
  competitiveAdvantages: z.array(z.string().min(1)).min(1),
  competitiveWeaknesses: z.array(z.string().min(1)).min(1),
  marketPosition: z.string().min(1),
  moat: z.string().min(1),
  threatLevel: z.enum(['Low', 'Medium', 'High']),
});

/* ── Main Investment Analysis Schema ───────────────────────── */
export const investmentAnalysisSchema = z.object({
  executiveSummary: z.string().min(1),
  businessQualityScore: scoreSchema,
  financialHealthScore: scoreSchema,
  growthScore: scoreSchema,
  riskScore: scoreSchema,
  competitiveAdvantageScore: scoreSchema,
  valuationScore: scoreSchema,
  overallInvestmentScore: scoreSchema,
  recommendation: z.enum(['Strong Buy', 'Buy', 'Hold', 'Avoid', 'Strong Avoid']),
  confidence: z.object({
    value: z.number().min(0).max(100),
    reason: z.string().min(1),
  }),
  swot: swotSchema,
  bullCase: z.string().min(1),
  bearCase: z.string().min(1),
  keyRisks: z.object({
    financialRisk: riskRatingSchema,
    marketRisk: riskRatingSchema,
    competitionRisk: riskRatingSchema,
    macroeconomicRisk: riskRatingSchema,
    executionRisk: riskRatingSchema,
    regulatoryRisk: riskRatingSchema,
    technologyRisk: riskRatingSchema,
    supplyChainRisk: riskRatingSchema,
  }),
  growthOpportunities: z.array(z.string().min(1)).min(1),
  catalysts: z.array(z.string().min(1)).min(1),
  investmentHorizon: z.string().min(1),
  finalVerdict: z.string().min(1),
  reasoning: z.object({
    pros: z.array(z.string().min(1)).min(1),
    cons: z.array(z.string().min(1)).min(1),
    importantRisks: z.array(z.string().min(1)).min(1),
    supportingEvidence: z.array(z.string().min(1)).min(1),
    keyDrivers: z.array(z.string().min(1)).min(1),
  }),
  sourcesUsed: z.array(z.string().min(1)).min(1),
  newsAnalysis: z.array(newsAnalysisItemSchema),
  competitorAnalysis: z.array(competitorAnalysisItemSchema),
});
