import { type NextRequest } from 'next/server';
import { withApiMiddleware } from '@/lib/api/middleware';
import { sendSuccess } from '@/lib/api/response';
import { searchCompanies } from '@/services/research/company-search.service';
import { HTTP_STATUS } from '@/lib/api/config/status-codes';
import { logger } from '@/utils/logger';

/**
 * GET /api/company/search
 * Exposes a live company query suggestion API.
 */
async function handleCompanySearch(req: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  logger.info(`API request for company suggestions`, { query });

  const searchResponse = await searchCompanies(query);
  const duration = Date.now() - startTime;

  return sendSuccess(
    searchResponse,
    'Suggestions retrieved successfully',
    HTTP_STATUS.OK,
    duration
  );
}

export const GET = withApiMiddleware(handleCompanySearch);
