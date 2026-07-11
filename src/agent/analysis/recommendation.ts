import { type InvestmentAnalysis } from '../types/investment.types';

/**
 * Validates consistency between Overall Investment Score and Recommendation.
 */
export function validateRecommendation(analysis: InvestmentAnalysis): { valid: boolean; message?: string } {
  const score = analysis.overallInvestmentScore.value;
  const rec = analysis.recommendation;

  if (rec === 'Strong Buy' && score < 80) {
    return { valid: false, message: `Recommendation "${rec}" is inconsistent with Overall Score ${score} (should be >= 80)` };
  }
  if (rec === 'Buy' && score < 65) {
    return { valid: false, message: `Recommendation "${rec}" is inconsistent with Overall Score ${score} (should be >= 65)` };
  }
  if (rec === 'Hold' && (score < 45 || score > 75)) {
    return { valid: false, message: `Recommendation "${rec}" is inconsistent with Overall Score ${score} (should be between 45 and 75)` };
  }
  if (rec === 'Avoid' && score > 50) {
    return { valid: false, message: `Recommendation "${rec}" is inconsistent with Overall Score ${score} (should be <= 50)` };
  }
  if (rec === 'Strong Avoid' && score >= 35) {
    return { valid: false, message: `Recommendation "${rec}" is inconsistent with Overall Score ${score} (should be < 35)` };
  }

  return { valid: true };
}
