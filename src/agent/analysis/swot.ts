import { type InvestmentAnalysis } from '../types/investment.types';

/**
 * Validates SWOT analysis arrays.
 * Confirms that Strengths, Weaknesses, Opportunities, and Threats each have at least 3 points.
 */
export function validateSWOT(analysis: InvestmentAnalysis): { valid: boolean; message?: string } {
  const swot = analysis.swot;

  const categories: Array<keyof typeof swot> = ['strengths', 'weaknesses', 'opportunities', 'threats'];

  for (const cat of categories) {
    const list = swot[cat];
    if (!Array.isArray(list)) {
      return { valid: false, message: `SWOT category "${cat}" is not an array` };
    }
    if (list.length < 3) {
      return { valid: false, message: `SWOT category "${cat}" must contain at least 3 points (has: ${list.length})` };
    }
    for (const point of list) {
      if (!point || point.trim().length < 5) {
        return { valid: false, message: `SWOT category "${cat}" contains empty or too brief bullet point: "${point}"` };
      }
    }
  }

  return { valid: true };
}
