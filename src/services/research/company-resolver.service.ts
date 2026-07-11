import { searchCompanies } from './company-search.service';
import { type CompanySuggestion } from '@/types/research.types';
import { logger } from '@/utils/logger';

/**
 * Computes the Levenshtein distance between two strings.
 * Lower distance means higher similarity.
 */
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0]![j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1, // deletion
        matrix[i]![j - 1]! + 1, // insertion
        matrix[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
      );
    }
  }

  return matrix[a.length]![b.length]!;
}

/**
 * Ranks and scores a suggestion against a query string.
 * Lower score represents a better match.
 */
function getMatchScore(query: string, suggestion: CompanySuggestion, rawYahooScore: number = 0): number {
  const q = query.toLowerCase().trim();
  const ticker = suggestion.ticker.toLowerCase();
  const name = suggestion.name.toLowerCase();

  // Rule 1: Exact symbol match (Highest priority)
  if (q === ticker) return 0;

  // Rule 2: Exact name match
  if (q === name) return 0.05;

  // Rule 3: Substring matches
  if (ticker.includes(q)) {
    return 0.1 + (ticker.length - q.length) * 0.05;
  }
  if (name.includes(q)) {
    return 0.2 + (name.length - q.length) * 0.01;
  }

  // Rule 4: Word-level matching (split name by spaces)
  const nameWords = name.split(/\s+/).filter(Boolean);
  let minWordDistance = Infinity;
  for (const word of nameWords) {
    const dist = getLevenshteinDistance(q, word);
    if (dist < minWordDistance) {
      minWordDistance = dist;
    }
  }

  // Rule 5: Fuzzy / Typo matching
  const distTicker = getLevenshteinDistance(q, ticker);
  const distName = getLevenshteinDistance(q, name);

  const bestDistance = Math.min(distTicker, distName, minWordDistance);

  // If distance is too large relative to query length, it's not a match
  if (bestDistance > Math.max(2, Math.floor(q.length / 2))) {
    return 100 + bestDistance; // low priority
  }

  // Score is calculated from Levenshtein distance, offset by a popularity factor from Yahoo Finance
  const yahooPopularityBonus = Math.min(0.09, rawYahooScore / 1000000);
  return 1.0 + bestDistance - yahooPopularityBonus;
}

/**
 * Resolves a free-form query to a single best matching company suggestion.
 */
export async function resolveCompany(query: string): Promise<CompanySuggestion | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  try {
    const response = await searchCompanies(trimmed);
    const suggestions = response.suggestions;
    if (suggestions.length === 0) return null;

    // Rank results based on match score
    const rankedSuggestions = suggestions.map((s) => {
      // Re-query raw score or fallback to default
      const score = getMatchScore(trimmed, s);
      return { suggestion: s, score };
    });

    // Sort by match score ascending
    rankedSuggestions.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      // Secondary sort: prefer primary exchanges (NSE, NASDAQ, NYSE)
      const primaryExchanges = ['NASDAQ', 'NYSE', 'NSE', 'BSE'];
      const aIsPrimary = primaryExchanges.some(ex => a.suggestion.exchange.includes(ex)) ? 1 : 0;
      const bIsPrimary = primaryExchanges.some(ex => b.suggestion.exchange.includes(ex)) ? 1 : 0;
      return bIsPrimary - aIsPrimary;
    });

    const best = rankedSuggestions[0];
    if (best && best.score < 10) {
      logger.info('Resolved company query successfully', {
        query: trimmed,
        resolved: best.suggestion.ticker,
        score: best.score,
      });
      return best.suggestion;
    }

    return null;
  } catch (error) {
    logger.error('Failed to resolve company query', {
      query: trimmed,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}
