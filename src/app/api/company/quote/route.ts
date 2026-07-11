import { type NextRequest } from 'next/server';
import { withApiMiddleware } from '@/lib/api/middleware';
import { sendSuccess } from '@/lib/api/response';
import { HTTP_STATUS } from '@/lib/api/config/status-codes';
import { logger } from '@/utils/logger';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

/**
 * GET /api/company/quote
 * Retrieves a lightweight, live quote metadata payload for the selected ticker.
 */
async function handleCompanyQuote(req: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker') || '';

  if (!ticker) {
    return sendSuccess(null, 'No ticker provided', HTTP_STATUS.BAD_REQUEST);
  }

  logger.info(`Fetching live quote for preview`, { ticker });

  try {
    const [quote, summary] = await Promise.all([
      yahooFinance.quote(ticker).catch(() => null),
      yahooFinance.quoteSummary(ticker, { modules: ['assetProfile', 'summaryDetail'] }).catch(() => null),
    ]);

    const profile = summary?.assetProfile;
    const details = summary?.summaryDetail;

    const data = {
      ticker: ticker.toUpperCase(),
      name: quote?.longName || quote?.shortName || ticker,
      price: quote?.regularMarketPrice || 0,
      change: quote?.regularMarketChange || 0,
      changePercent: quote?.regularMarketChangePercent || 0,
      marketCap: quote?.marketCap || details?.marketCap || 0,
      currency: quote?.currency || details?.currency || 'USD',
      exchange: quote?.fullExchangeName || quote?.exchange || 'Unknown',
      sector: profile?.sector || 'Unknown',
      industry: profile?.industry || 'Unknown',
      description: profile?.longBusinessSummary || '',
      fiftyTwoWeekHigh: quote?.fiftyTwoWeekHigh || details?.fiftyTwoWeekHigh || 0,
      fiftyTwoWeekLow: quote?.fiftyTwoWeekLow || details?.fiftyTwoWeekLow || 0,
      quoteType: quote?.quoteType || 'EQUITY',
      isTradable: quote?.tradeable || false,
    };

    const duration = Date.now() - startTime;
    return sendSuccess(data, 'Quote retrieved successfully', HTTP_STATUS.OK, duration);
  } catch (error) {
    logger.error('Failed to retrieve quote for preview', {
      ticker,
      error: error instanceof Error ? error.message : String(error),
    });
    return sendSuccess(null, 'Failed to retrieve quote details', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export const GET = withApiMiddleware(handleCompanyQuote);
