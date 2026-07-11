import { type ServiceResult, type CompetitorData } from '@/types/research.types';
import { fetchCompanyProfile } from './company.service';
import { fetchFinancialData } from './financial.service';
import { competitorResponseSchema } from './schemas';
import { parseOrNull } from '@/lib/validators/zod-helpers';
import { logger } from '@/utils/logger';

const API_NAME = 'YahooFinance/competitors';

// Predefined competitor tickers mapping for major US tech stocks
const COMPETITORS_MAP: Record<string, string[]> = {
  AAPL: ['MSFT', 'GOOGL', 'NVDA'],
  MSFT: ['AAPL', 'GOOGL', 'ORCL'],
  GOOGL: ['MSFT', 'META', 'AAPL'],
  AMZN: ['WMT', 'EBAY', 'MSFT'],
  TSLA: ['TM', 'GM', 'F'],
  NVDA: ['AMD', 'INTC', 'AVGO'],
  META: ['GOOGL', 'SNAP', 'PINS'],
  NFLX: ['DIS', 'CMCSA', 'NFLX'], // Dis and Comcast
};

/**
 * Fetches real stock data for competitors of a target ticker.
 * Maps competitors, queries their profiles/financials, and validates the response.
 */
export async function fetchCompetitors(ticker: string): Promise<ServiceResult<CompetitorData[]>> {
  const normTicker = ticker.toUpperCase();
  const competitorTickers = COMPETITORS_MAP[normTicker] ?? ['MSFT', 'AAPL', 'GOOGL'];

  logger.info(`Fetching competitor details`, { ticker: normTicker, competitors: competitorTickers });

  try {
    const competitorPromises = competitorTickers
      .filter((t) => t !== normTicker) // ensure we don't include target as competitor
      .map(async (compTicker): Promise<CompetitorData | null> => {
        try {
          const [profileResult, finResult] = await Promise.all([
            fetchCompanyProfile(compTicker),
            fetchFinancialData(compTicker),
          ]);

          if (profileResult.success && finResult.success) {
            const profile = profileResult.data;
            const fin = finResult.data;

            return {
              name: profile.name,
              ticker: compTicker,
              industry: profile.industry || 'Technology',
              marketCap: fin.marketCap,
              currentPrice: fin.currentPrice,
              description: profile.description || `${profile.name} is a leading competitor in the industry.`,
            };
          }
        } catch (e) {
          logger.warn(`Failed to fetch details for competitor ticker ${compTicker}`, { error: String(e) });
        }
        return null;
      });

    const results = await Promise.all(competitorPromises);
    const validCompetitors = results.filter((c): c is CompetitorData => c !== null);

    // Validate the array using the competitorResponseSchema
    const validated = parseOrNull(competitorResponseSchema, validCompetitors);

    if (!validated) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Competitor data failed validation schema',
          api: API_NAME,
        },
      };
    }

    return { success: true, data: validated };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: `Failed to compile competitor metrics: ${error instanceof Error ? error.message : String(error)}`,
        api: API_NAME,
      },
    };
  }
}
