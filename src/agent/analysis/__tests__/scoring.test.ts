import { describe, it, expect } from 'vitest';
import { validateScores } from '../scoring';
import { type InvestmentAnalysis } from '../../types/investment.types';

describe('validateScores', () => {
  const baseMockReport: InvestmentAnalysis = {
    executiveSummary: 'This is a test summary.',
    businessQualityScore: { value: 85, reason: 'Strong business', confidence: 90 },
    financialHealthScore: { value: 90, reason: 'Solid balance sheet', confidence: 90 },
    growthScore: { value: 80, reason: 'Steady growth', confidence: 85 },
    riskScore: { value: 20, reason: 'Low risks', confidence: 90 }, // risk inverted (100 - 20 = 80)
    competitiveAdvantageScore: { value: 85, reason: 'High switching costs', confidence: 90 },
    valuationScore: { value: 75, reason: 'Reasonable P/E', confidence: 80 },
    overallInvestmentScore: { value: 82, reason: 'Consistent', confidence: 90 },
    recommendation: 'Strong Buy',
    confidence: { value: 88, reason: 'High completeness' },
    swot: {
      strengths: ['Brand', 'Patent', 'Scale'],
      weaknesses: ['Debt', 'Churn', 'Costs'],
      opportunities: ['Asia', 'SaaS', 'AI'],
      threats: ['Regulation', 'Competitors', 'Rates'],
    },
    bullCase: 'Growth acceleration.',
    bearCase: 'Regulatory crackdown.',
    keyRisks: {
      financialRisk: { rating: 'Low', explanation: 'Low debt leverage' },
      marketRisk: { rating: 'Medium', explanation: 'Moderate competition' },
      competitionRisk: { rating: 'Medium', explanation: 'Major peers active' },
      macroeconomicRisk: { rating: 'Low', explanation: 'Stable inflation' },
      executionRisk: { rating: 'Low', explanation: 'Experienced management' },
      regulatoryRisk: { rating: 'Low', explanation: 'Compliance solid' },
      technologyRisk: { rating: 'Low', explanation: 'Cutting edge tech' },
      supplyChainRisk: { rating: 'Low', explanation: 'Diversified supply' },
    },
    growthOpportunities: ['New markets'],
    catalysts: ['Product launch'],
    investmentHorizon: '3-5 years',
    finalVerdict: 'Strong investment candidate.',
    reasoning: {
      pros: ['Strong margin'],
      cons: ['High valuation'],
      importantRisks: ['Competition'],
      supportingEvidence: ['Consistent revenue'],
      keyDrivers: ['Cloud business'],
    },
    sourcesUsed: ['SEC 10-K'],
    newsAnalysis: [],
    competitorAnalysis: [],
  };

  it('should pass on a consistent set of scores', () => {
    const check = validateScores(baseMockReport);
    expect(check.valid).toBe(true);
  });

  it('should fail if any score is out of bounds', () => {
    const invalidReport = {
      ...baseMockReport,
      businessQualityScore: { value: 120, reason: 'Too high', confidence: 90 },
    };
    const check = validateScores(invalidReport);
    expect(check.valid).toBe(false);
    expect(check.message).toContain('out of bounds');
  });

  it('should fail if the overall score is highly inconsistent with sub-scores', () => {
    const inconsistentReport = {
      ...baseMockReport,
      overallInvestmentScore: { value: 30, reason: 'Too low', confidence: 90 }, // average of positive is ~81.6 (diff ~51.6)
    };
    const check = validateScores(inconsistentReport);
    expect(check.valid).toBe(false);
    expect(check.message).toContain('inconsistent');
  });
});
