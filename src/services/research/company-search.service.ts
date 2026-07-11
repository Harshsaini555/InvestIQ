import YahooFinance from 'yahoo-finance2';
import { type CompanySuggestion, type CompanySearchResponse } from '@/types/research.types';
import { logger } from '@/utils/logger';

const yahooFinance = new YahooFinance();

/**
 * Resolves country name based on Yahoo Finance exchange codes.
 */
export function resolveCountry(exchange: string): string {
  const code = exchange.toUpperCase();
  if (['NMS', 'NYQ', 'ASE', 'OBB', 'PNK', 'BATS', 'NCM', 'NGM'].includes(code)) return 'United States';
  if (['NSI', 'BOM'].includes(code)) return 'India';
  if (['LSE', 'LSE.L'].includes(code)) return 'United Kingdom';
  if (['TOR', 'VAN'].includes(code)) return 'Canada';
  if (['ASX'].includes(code)) return 'Australia';
  if (['HKG'].includes(code)) return 'Hong Kong';
  if (['GER', 'FRA', 'STU', 'MUN', 'HAM', 'DUS', 'BER'].includes(code)) return 'Germany';
  if (['PAR'].includes(code)) return 'France';
  if (['AMS'].includes(code)) return 'Netherlands';
  if (['SWX'].includes(code)) return 'Switzerland';
  if (['STO'].includes(code)) return 'Sweden';
  if (['OSL'].includes(code)) return 'Norway';
  if (['CPH'].includes(code)) return 'Denmark';
  if (['HEL'].includes(code)) return 'Finland';
  if (['MIL'].includes(code)) return 'Italy';
  if (['MAD'].includes(code)) return 'Spain';
  if (['BRU'].includes(code)) return 'Belgium';
  if (['LIS'].includes(code)) return 'Portugal';
  if (['VIE'].includes(code)) return 'Austria';
  if (['TYO', 'OSA'].includes(code)) return 'Japan';
  if (['SES', 'SGX'].includes(code)) return 'Singapore';
  if (['KRX', 'KSC'].includes(code)) return 'South Korea';
  if (['TPE', 'TWO'].includes(code)) return 'Taiwan';
  if (['SHH', 'SHZ'].includes(code)) return 'China';
  if (['JSE'].includes(code)) return 'South Africa';
  if (['TASE'].includes(code)) return 'Israel';
  if (['SAO'].includes(code)) return 'Brazil';
  if (['MEX'].includes(code)) return 'Mexico';
  if (['BUE'].includes(code)) return 'Argentina';
  return 'United States';
}

/**
 * Resolves standard currency based on country name.
 */
export function resolveCurrency(country: string): string {
  switch (country) {
    case 'United States': return 'USD';
    case 'India': return 'INR';
    case 'United Kingdom': return 'GBP';
    case 'Canada': return 'CAD';
    case 'Australia': return 'AUD';
    case 'Hong Kong': return 'HKD';
    case 'Germany':
    case 'France':
    case 'Netherlands':
    case 'Italy':
    case 'Spain':
    case 'Belgium':
    case 'Portugal':
    case 'Austria':
    case 'Finland': return 'EUR';
    case 'Switzerland': return 'CHF';
    case 'Sweden': return 'SEK';
    case 'Norway': return 'NOK';
    case 'Denmark': return 'DKK';
    case 'Japan': return 'JPY';
    case 'Singapore': return 'SGD';
    case 'South Korea': return 'KRW';
    case 'Taiwan': return 'TWD';
    case 'China': return 'CNY';
    case 'South Africa': return 'ZAR';
    case 'Israel': return 'ILS';
    case 'Brazil': return 'BRL';
    case 'Mexico': return 'MXN';
    case 'Argentina': return 'ARS';
    default: return 'USD';
  }
}

/**
 * Computes Levenshtein distance between two strings.
 */
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = [];
  for (let i = 0; i <= a.length; i++) matrix[i] = [i];
  for (let j = 0; j <= b.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

/**
 * Returns matching score for ranking.
 */
function getMatchScore(query: string, suggestion: CompanySuggestion): number {
  const q = query.toLowerCase().trim();
  const ticker = suggestion.ticker.toLowerCase();
  const name = suggestion.name.toLowerCase();

  if (q === ticker) return 0;
  if (q === name) return 0.05;

  if (ticker.includes(q)) return 0.1 + (ticker.length - q.length) * 0.05;
  if (name.includes(q)) return 0.2 + (name.length - q.length) * 0.01;

  const nameWords = name.split(/\s+/).filter(Boolean);
  let minWordDistance = Infinity;
  for (const word of nameWords) {
    const dist = getLevenshteinDistance(q, word);
    if (dist < minWordDistance) minWordDistance = dist;
  }

  const distTicker = getLevenshteinDistance(q, ticker);
  const distName = getLevenshteinDistance(q, name);
  const bestDistance = Math.min(distTicker, distName, minWordDistance);

  if (bestDistance > Math.max(2, Math.floor(q.length / 2))) {
    return 100 + bestDistance;
  }
  return 1.0 + bestDistance;
}

/**
 * Generates alternative suggestions for private company topics.
 */
export function getTopicAlternatives(query: string): CompanySuggestion[] {
  const q = query.toLowerCase();

  const aiAlternatives: CompanySuggestion[] = [
    {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      exchange: 'NASDAQ',
      country: 'United States',
      industry: 'Software—Infrastructure',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/MSFT.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    },
    {
      name: 'Alphabet Inc.',
      ticker: 'GOOGL',
      exchange: 'NASDAQ',
      country: 'United States',
      industry: 'Internet Content & Information',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/GOOGL.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    },
    {
      name: 'NVIDIA Corporation',
      ticker: 'NVDA',
      exchange: 'NASDAQ',
      country: 'United States',
      industry: 'Semiconductors',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/NVDA.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    }
  ];

  const aerospaceAlternatives: CompanySuggestion[] = [
    {
      name: 'Tesla, Inc.',
      ticker: 'TSLA',
      exchange: 'NASDAQ',
      country: 'United States',
      industry: 'Auto Manufacturers',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/TSLA.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    },
    {
      name: 'Lockheed Martin Corporation',
      ticker: 'LMT',
      exchange: 'NYSE',
      country: 'United States',
      industry: 'Aerospace & Defense',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/LMT.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    },
    {
      name: 'The Boeing Company',
      ticker: 'BA',
      exchange: 'NYSE',
      country: 'United States',
      industry: 'Aerospace & Defense',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/BA.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    }
  ];

  const fintechAlternatives: CompanySuggestion[] = [
    {
      name: 'PayPal Holdings, Inc.',
      ticker: 'PYPL',
      exchange: 'NASDAQ',
      country: 'United States',
      industry: 'Credit Services',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/PYPL.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    },
    {
      name: 'Block, Inc.',
      ticker: 'SQ',
      exchange: 'NYSE',
      country: 'United States',
      industry: 'Software—Infrastructure',
      logoUrl: 'https://images.financialmodelingprep.com/symbol/SQ.png',
      marketCap: null,
      currency: 'USD',
      quoteType: 'EQUITY',
      isTradable: true
    }
  ];

  if (q.includes('openai') || q.includes('chatgpt') || q.includes('ai') || q.includes('anthropic') || q.includes('midjourney')) {
    return aiAlternatives;
  }
  if (q.includes('spacex') || q.includes('space') || q.includes('rocket') || q.includes('satellite') || q.includes('mars')) {
    return aerospaceAlternatives;
  }
  if (q.includes('stripe') || q.includes('payments') || q.includes('fintech') || q.includes('billing')) {
    return fintechAlternatives;
  }

  return aiAlternatives; // tech fallback
}

/* ── 4-Stage Search Pipeline ───────────────────────────────── */

/**
 * Stage 1: Fetch Yahoo Results
 */
export async function fetchYahooResults(query: string): Promise<any[]> {
  try {
    const response = await yahooFinance.search(query, {
      quotesCount: 15,
      newsCount: 0,
    });
    return response.quotes || [];
  } catch (error) {
    logger.error('Yahoo Finance search execution failed', {
      query,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

/**
 * Stage 2: Filter Results
 */
export function filterResults(rawQuotes: any[]): any[] {
  const privateOrDelistedRegex = /(\.PVT|\.PRIVATE|[_.]OLD|[_.]DELISTED|[_.]PTE)/i;
  const nameFilterRegex = /(Pre-IPO|Private Held|Privately Held|Delisted|Acquired|Liquidated|Suspended|Private Placement)/i;

  return rawQuotes.filter((q: any) => {
    // 1. Only return quoteType === 'EQUITY'
    if (q.quoteType !== 'EQUITY') return false;

    // 2. Reject private placement or delisted suffixes
    if (q.symbol && privateOrDelistedRegex.test(q.symbol)) return false;

    // 3. Reject non-tradable assets
    if (q.isYahooFinance === false) return false;

    // 4. Reject names matching private/delisted keywords
    const name = q.longname || q.shortname || '';
    if (nameFilterRegex.test(name)) return false;

    return true;
  });
}

/**
 * Stage 3: Normalize Results
 */
export function normalizeResults(filtered: any[]): CompanySuggestion[] {
  return filtered.map((q: any) => {
    const country = resolveCountry(q.exchange || '');
    const currency = resolveCurrency(country);
    const name = q.longname || q.shortname || q.symbol;
    const logoUrl = q.symbol ? `https://images.financialmodelingprep.com/symbol/${q.symbol.toUpperCase()}.png` : null;

    return {
      name,
      ticker: q.symbol.toUpperCase(),
      exchange: q.exchDisp || q.exchange || 'Unknown',
      country,
      industry: q.industry || q.sector || 'Unknown',
      logoUrl,
      marketCap: null,
      currency,
      quoteType: q.quoteType || 'EQUITY',
      isTradable: q.isYahooFinance !== false,
    };
  });
}

/**
 * Stage 4: Rank Results
 */
export function rankResults(normalized: CompanySuggestion[], query: string): CompanySuggestion[] {
  const scored = normalized.map(s => ({
    suggestion: s,
    score: getMatchScore(query, s)
  }));

  scored.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    const primaryExchanges = ['NASDAQ', 'NYSE', 'NSE', 'BSE'];
    const aIsPrimary = primaryExchanges.some(ex => a.suggestion.exchange.includes(ex)) ? 1 : 0;
    const bIsPrimary = primaryExchanges.some(ex => b.suggestion.exchange.includes(ex)) ? 1 : 0;
    return bIsPrimary - aIsPrimary;
  });

  return scored.map(s => s.suggestion);
}

/**
 * Primary company search service orchestrator.
 */
export async function searchCompanies(query: string): Promise<CompanySearchResponse> {
  const start = Date.now();
  const trimmed = query.trim();

  if (!trimmed) {
    return {
      status: 'not_found',
      message: 'No query provided',
      suggestions: []
    };
  }

  try {
    const rawQuotes = await fetchYahooResults(trimmed);

    // 1. Not Found Check
    if (rawQuotes.length === 0) {
      return {
        status: 'not_found',
        message: `No companies found matching "${trimmed}".`,
        suggestions: []
      };
    }

    const filtered = filterResults(rawQuotes);

    // 2. Private Company Check (Matching results found but none are active public equities)
    if (filtered.length === 0) {
      const alternatives = getTopicAlternatives(trimmed);
      return {
        status: 'private',
        message: 'This company is privately held and is not listed on a public stock exchange.',
        suggestions: alternatives
      };
    }

    const normalized = normalizeResults(filtered);
    const ranked = rankResults(normalized, trimmed);

    // 3. Ambiguous check: top matches are close but represent different tickers
    let status: 'success' | 'ambiguous' = 'success';
    let message: string | null = null;

    if (ranked.length > 1) {
      const score0 = getMatchScore(trimmed, ranked[0]!);
      const score1 = getMatchScore(trimmed, ranked[1]!);
      const name0 = ranked[0]!.name.toLowerCase();
      const name1 = ranked[1]!.name.toLowerCase();

      // Only flag ambiguous if both:
      // 1. Similarity score is extremely close
      // 2. The top score is not a perfect match (score0 > 0)
      // 3. They represent genuinely different entities (names don't include or overlap each other)
      const isCloseScore = Math.abs(score0 - score1) < 0.2;
      const isNotExactMatch = score0 > 0.05; // exact symbol/name matches are not ambiguous
      const isDifferentEntity = name0 !== name1 && !name0.includes(name1) && !name1.includes(name0);

      if (isCloseScore && isNotExactMatch && isDifferentEntity) {
        status = 'ambiguous';
        message = 'Multiple matching companies found. Please select one of the following suggestions:';
      }
    }

    const duration = Date.now() - start;
    logger.info('Company search pipeline executed successfully', {
      query: trimmed,
      status,
      durationMs: duration,
      resultsCount: ranked.length
    });

    return {
      status,
      message,
      suggestions: ranked
    };
  } catch (error) {
    logger.error('Company search service orchestrator failed', {
      query: trimmed,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      status: 'not_found',
      message: 'Failed to search for companies.',
      suggestions: []
    };
  }
}
