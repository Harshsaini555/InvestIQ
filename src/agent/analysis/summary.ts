import { type InvestmentAnalysis } from '../types/investment.types';

/**
 * Validates executive summary word count constraints.
 */
export function validateSummary(analysis: InvestmentAnalysis): { valid: boolean; wordCount: number; message?: string } {
  const summary = analysis.executiveSummary?.trim();

  if (!summary) {
    return { valid: false, wordCount: 0, message: 'Executive summary is empty' };
  }

  // Count words by splitting on spaces
  const wordCount = summary.split(/\s+/).length;

  if (wordCount > 250) {
    return {
      valid: false,
      wordCount,
      message: `Executive summary exceeds the 250-word constraint (has ${wordCount} words)`,
    };
  }

  return { valid: true, wordCount };
}
