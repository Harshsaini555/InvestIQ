import { type InvestmentAnalysis } from '../types/investment.types';

/**
 * Validates that all critical risk factors are fully analyzed and rated.
 */
export function validateRisks(analysis: InvestmentAnalysis): { valid: boolean; message?: string } {
  const risks = analysis.keyRisks;

  const fields: Array<keyof typeof risks> = [
    'financialRisk',
    'marketRisk',
    'competitionRisk',
    'macroeconomicRisk',
    'executionRisk',
    'regulatoryRisk',
    'technologyRisk',
    'supplyChainRisk',
  ];

  for (const f of fields) {
    const r = risks[f];
    if (!r) {
      return { valid: false, message: `Risk factor "${f}" is missing entirely` };
    }
    if (!['Low', 'Medium', 'High'].includes(r.rating)) {
      return { valid: false, message: `Risk factor "${f}" contains invalid rating "${r.rating}"` };
    }
    if (!r.explanation || r.explanation.length < 5) {
      return { valid: false, message: `Risk factor "${f}" is missing a thorough explanation` };
    }
  }

  return { valid: true };
}
