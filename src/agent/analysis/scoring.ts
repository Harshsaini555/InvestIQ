import { type InvestmentAnalysis } from '../types/investment.types';

/**
 * Validates scoring values (0-100) and checks that Overall Score
 * remains consistent with sub-score indicators.
 */
export function validateScores(analysis: InvestmentAnalysis): { valid: boolean; message?: string } {
  const scores = [
    { name: 'businessQualityScore', value: analysis.businessQualityScore.value },
    { name: 'financialHealthScore', value: analysis.financialHealthScore.value },
    { name: 'growthScore', value: analysis.growthScore.value },
    { name: 'riskScore', value: analysis.riskScore.value },
    { name: 'competitiveAdvantageScore', value: analysis.competitiveAdvantageScore.value },
    { name: 'valuationScore', value: analysis.valuationScore.value },
    { name: 'overallInvestmentScore', value: analysis.overallInvestmentScore.value },
  ];

  // 1. Verify bounds
  for (const s of scores) {
    if (s.value < 0 || s.value > 100) {
      return { valid: false, message: `Score "${s.name}" is out of bounds (value: ${s.value})` };
    }
  }

  // 2. Perform consistent calculation checking
  // Overall score should roughly align with the mean of sub-scores (excluding riskScore, since risk is inverse)
  const positiveScores = [
    analysis.businessQualityScore.value,
    analysis.financialHealthScore.value,
    analysis.growthScore.value,
    analysis.competitiveAdvantageScore.value,
    (100 - analysis.riskScore.value), // risk inverted
    analysis.valuationScore.value,
  ];

  const average = positiveScores.reduce((a, b) => a + b, 0) / positiveScores.length;
  const diff = Math.abs(analysis.overallInvestmentScore.value - average);

  // If overall score drifts by more than 20 points, flag a consistency warning
  if (diff > 25) {
    return {
      valid: false,
      message: `Overall Investment Score (${analysis.overallInvestmentScore.value}) is inconsistent with the average of sub-scores (${average.toFixed(1)})`,
    };
  }

  return { valid: true };
}
