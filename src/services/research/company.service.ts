import YahooFinance from 'yahoo-finance2';
import { type ServiceResult, type CompanyProfileData } from '@/types/research.types';
import { companyProfileResponseSchema } from '@/services/research/schemas';
import { logger } from '@/utils/logger';

const yahooFinance = new YahooFinance();
const API_NAME = 'YahooFinance/company';

/**
 * Fetches structured company profile data for a given ticker
 * using the yahoo-finance2 package (no API key required).
 */
export async function fetchCompanyProfile(
  ticker: string
): Promise<ServiceResult<CompanyProfileData>> {
  const start = Date.now();

  try {

    const [quoteSummary, quote] = await Promise.all([
      yahooFinance
        .quoteSummary(ticker, { modules: ['assetProfile', 'defaultKeyStatistics', 'summaryDetail'] })
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
        error: { code: 'INVALID_RESPONSE', message: 'Could not fetch Yahoo Finance data', api: API_NAME },
      };
    }

    logger.info('API request succeeded', { api: API_NAME, ticker, duration });

    const profile = quoteSummary?.assetProfile;
    const city = profile?.city ?? '';
    const country = profile?.country ?? '';

    const ceo = (profile?.companyOfficers ?? []).find((o: any) =>
      o?.title?.toLowerCase()?.includes('chief executive')
    );

    const mapped = {
      name:         quote?.longName ?? quote?.shortName ?? ticker,
      ticker:       ticker.toUpperCase(),
      exchange:     quote?.fullExchangeName ?? '',
      sector:       profile?.sector ?? '',
      industry:     profile?.industry ?? '',
      description:  profile?.longBusinessSummary ?? '',
      ceo:          ceo?.name ?? '',
      founded:      '',
      employees:    profile?.fullTimeEmployees ?? 0,
      country,
      headquarters: [city, country].filter(Boolean).join(', '),
      website:      profile?.website ?? `https://finance.yahoo.com/quote/${ticker}`,
      marketCap:    quote?.marketCap ?? 0,
      logoUrl:      null,
    };

    const validationResult = companyProfileResponseSchema.safeParse(mapped);

    if (!validationResult.success) {
      const errorMsg = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Company profile failed schema validation: ${errorMsg}`,
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
