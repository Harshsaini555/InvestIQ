import { type ResearchBundle } from '@/types/research.types';

/**
 * Checks the completeness of a ResearchBundle.
 * Returns a recommended confidence score based on available indicators.
 */
export function calculateCompletenessPenalty(bundle: ResearchBundle): { confidenceLimit: number; warnings: string[] } {
  let score = 100;
  const warnings: string[] = [];

  // Check critical metrics
  if (!bundle.companyProfile.sector || !bundle.companyProfile.industry) {
    score -= 15;
    warnings.push('Sector/Industry profile data is missing.');
  }

  const fin = bundle.financialData;
  if (!fin.marketCap || !fin.currentPrice) {
    score -= 20;
    warnings.push('Critical valuation indicators (MarketCap/CurrentPrice) are missing.');
  }

  if (fin.peRatio === null && fin.pegRatio === null) {
    score -= 10;
    warnings.push('PE and PEG ratios are missing; valuation modeling is constrained.');
  }

  if (bundle.news.length === 0) {
    score -= 15;
    warnings.push('No recent news articles were fetched.');
  } else if (bundle.news.length < 3) {
    score -= 5;
    warnings.push('Recent news is sparse (fewer than 3 articles).');
  }

  if (bundle.competitors.length === 0) {
    score -= 20;
    warnings.push('No competitor listings are available.');
  }

  return {
    confidenceLimit: Math.max(score, 10),
    warnings,
  };
}
