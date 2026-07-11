import YahooFinance from 'yahoo-finance2';
import { type ServiceResult, type FinancialData } from '@/types/research.types';
import { financialDataResponseSchema } from '@/services/research/schemas';
import { logger } from '@/utils/logger';

const yahooFinance = new YahooFinance();
const API_NAME = 'YahooFinance/financials';

/**
 * Fetches comprehensive financial metrics for a given ticker
 * using the yahoo-finance2 package (no API key required).
 */
export async function fetchFinancialData(
  ticker: string
): Promise<ServiceResult<FinancialData>> {
  const start = Date.now();

  try {

    const [quoteSummary, quote] = await Promise.all([
      yahooFinance
        .quoteSummary(ticker, { modules: ['financialData', 'defaultKeyStatistics', 'summaryDetail'] })
        .catch(() => null),
      yahooFinance
        .quote(ticker)
        .catch(() => null),
    ]);

    const duration = Date.now() - start;

    if (!quoteSummary && !quote) {
      logger.error('API request failed', { api: API_NAME, ticker, duration, code: 'INVALID_RESPONSE' });
      return {
        success: false,
        error: { code: 'INVALID_RESPONSE', message: 'Could not fetch Yahoo Finance financial data', api: API_NAME },
      };
    }

    logger.info('API request succeeded', { api: API_NAME, ticker, duration });

    const fin = quoteSummary?.financialData;
    const stats = quoteSummary?.defaultKeyStatistics;

    const mapped = {
      ticker:            ticker.toUpperCase(),
      currency:          quote?.currency ?? 'USD',
      currentPrice:      quote?.regularMarketPrice ?? 0,
      fiftyTwoWeekHigh:  quote?.fiftyTwoWeekHigh ?? 0,
      fiftyTwoWeekLow:   quote?.fiftyTwoWeekLow ?? 0,
      marketCap:         quote?.marketCap ?? 0,
      beta:              stats?.beta ?? null,
      peRatio:           quote?.trailingPE ?? null,
      pegRatio:          fin?.pegRatio ?? null,
      eps:               stats?.trailingEps ?? null,
      dividendYield:     quote?.dividendYield ?? null,
      revenue:           fin?.totalRevenue ?? null,
      netIncome:         fin?.netIncomeToCommon ?? null,
      operatingIncome:   fin?.operatingIncome ?? null,
      revenueGrowth:     fin?.revenueGrowth ?? null,
      profitMargin:      fin?.profitMargins ?? null,
      debtToEquity:      fin?.debtToEquity ?? null,
      freeCashFlow:      fin?.freeCashflow ?? null,
      operatingCashFlow: fin?.operatingCashflow ?? null,
    };

    const validationResult = financialDataResponseSchema.safeParse(mapped);

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Financial data failed schema validation: ${errorMsg}`,
          api: API_NAME,
        },
      };
    }

    return { success: true, data: validationResult.data };
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('API request failed', {
      api: API_NAME,
      ticker,
      duration,
      error: error instanceof Error ? error.message : String(error),
    });
    return {
      success: false,
      error: {
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : String(error),
        api: API_NAME,
      },
    };
  }
}
