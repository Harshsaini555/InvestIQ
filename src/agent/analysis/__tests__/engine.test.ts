import { describe, it, expect } from 'vitest';
import { InvestmentAnalysisParser } from '../output-parser';
import { validateSummary } from '../summary';
import { calculateCompletenessPenalty } from '../confidence';
import { validateRecommendation } from '../recommendation';
import { type InvestmentAnalysis } from '../../types/investment.types';
import { type ResearchBundle } from '@/types/research.types';

describe('InvestmentAnalysisParser', () => {
  const parser = new InvestmentAnalysisParser();

  it('should parse JSON wrapped in markdown code fences', async () => {
    const jsonStr = `
    \`\`\`json
    {
      "executiveSummary": "Valid summary.",
      "businessQualityScore": { "value": 80, "reason": "Good", "confidence": 90 },
      "financialHealthScore": { "value": 85, "reason": "Healthy", "confidence": 90 },
      "growthScore": { "value": 75, "reason": "Growing", "confidence": 85 },
      "riskScore": { "value": 20, "reason": "Low", "confidence": 90 },
      "competitiveAdvantageScore": { "value": 80, "reason": "Moat", "confidence": 90 },
      "valuationScore": { "value": 70, "reason": "Fair", "confidence": 80 },
      "overallInvestmentScore": { "value": 78, "reason": "Buy candidate", "confidence": 90 },
      "recommendation": "Buy",
      "confidence": { "value": 85, "reason": "Data complete" },
      "swot": {
        "strengths": ["Brand", "Patents", "Cash"],
        "weaknesses": ["Costs", "Debt", "Dependence"],
        "opportunities": ["SaaS", "Asia", "AI Integration"],
        "threats": ["Regulation", "Competitors", "Inflation"]
      },
      "bullCase": "Fast growth.",
      "bearCase": "Inflation pressure.",
      "keyRisks": {
        "financialRisk": { "rating": "Low", "explanation": "Low leverage" },
        "marketRisk": { "rating": "Low", "explanation": "Low volatility" },
        "competitionRisk": { "rating": "Medium", "explanation": "A few competitors" },
        "macroeconomicRisk": { "rating": "Low", "explanation": "Stable rates" },
        "executionRisk": { "rating": "Low", "explanation": "Strong management" },
        "regulatoryRisk": { "rating": "Low", "explanation": "Compliant" },
        "technologyRisk": { "rating": "Low", "explanation": "Modern stack" },
        "supplyChainRisk": { "rating": "Low", "explanation": "Local sourcing" }
      },
      "growthOpportunities": ["New product launch"],
      "catalysts": ["Earnings surprise"],
      "investmentHorizon": "2-3 years",
      "finalVerdict": "A solid Buy.",
      "reasoning": {
        "pros": ["Moat"],
        "cons": ["Valuation"],
        "importantRisks": ["Regulation"],
        "supportingEvidence": ["Margins"],
        "keyDrivers": ["AI tools"]
      },
      "sourcesUsed": ["SEC 10-K"],
      "newsAnalysis": [],
      "competitorAnalysis": []
    }
    \`\`\`
    `;

    const result = await parser.parse(jsonStr);
    expect(result.recommendation).toBe('Buy');
    expect(result.overallInvestmentScore.value).toBe(78);
  });

  it('should throw an error on schema mismatch', async () => {
    const invalidJsonStr = `
    {
      "recommendation": "INVALID_REC",
      "overallInvestmentScore": { "value": 200 }
    }
    `;
    await expect(parser.parse(invalidJsonStr)).rejects.toThrow();
  });
});

describe('validateSummary', () => {
  const mockReport = (summaryText: string): InvestmentAnalysis => ({
    executiveSummary: summaryText,
  } as any);

  it('should pass on summary within 250 words', () => {
    const text = 'This is a short summary under word limit constraints.';
    const check = validateSummary(mockReport(text));
    expect(check.valid).toBe(true);
    expect(check.wordCount).toBe(9);
  });

  it('should fail on summary exceeding 250 words', () => {
    const text = Array(260).fill('word').join(' ');
    const check = validateSummary(mockReport(text));
    expect(check.valid).toBe(false);
    expect(check.message).toContain('exceeds');
  });
});

describe('calculateCompletenessPenalty', () => {
  const baseMockBundle: ResearchBundle = {
    company: 'AAPL',
    collectedAt: '2026-07-10',
    companyProfile: { name: 'Apple Inc.', sector: 'Tech', industry: 'Consumer Electronics' } as any,
    financialData: { marketCap: 3000000000000, currentPrice: 180, peRatio: 30, pegRatio: 2.5 } as any,
    news: [{} as any, {} as any, {} as any],
    competitors: [{} as any],
    marketIntelligence: {} as any,
  };

  it('should recommend 100 on fully complete data bundle', () => {
    const check = calculateCompletenessPenalty(baseMockBundle);
    expect(check.confidenceLimit).toBe(100);
    expect(check.warnings.length).toBe(0);
  });

  it('should penalize confidence score if competitor data is missing', () => {
    const incompleteBundle = {
      ...baseMockBundle,
      competitors: [],
    };
    const check = calculateCompletenessPenalty(incompleteBundle);
    expect(check.confidenceLimit).toBe(80); // -20 penalty
    expect(check.warnings[0]).toContain('competitor');
  });
});

describe('validateRecommendation', () => {
  const mockReport = (score: number, rec: string): InvestmentAnalysis => ({
    overallInvestmentScore: { value: score },
    recommendation: rec,
  } as any);

  it('should pass on matching score and recommendation', () => {
    const check = validateRecommendation(mockReport(85, 'Strong Buy'));
    expect(check.valid).toBe(true);
  });

  it('should fail on mismatched score and recommendation', () => {
    const check = validateRecommendation(mockReport(30, 'Strong Buy'));
    expect(check.valid).toBe(false);
    expect(check.message).toContain('inconsistent');
  });
});
