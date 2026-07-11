import { type NextRequest, type NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { sendError } from './response';
import { normalizeApiError } from './errors';

export type RouteHandler = (
  req: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Higher-order middleware wrapper for Next.js App Router API Route Controllers.
 * Attaches a unique request ID, handles rate-limit preparation, times latency,
 * and intercepts all uncaught errors in a standardized boundary.
 */
export function withApiMiddleware(handler: RouteHandler): RouteHandler {
  return async (req: NextRequest, context) => {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    const { method, nextUrl } = req;
    const path = nextUrl.pathname;

    logger.info(`API Request Received`, {
      requestId,
      method,
      path,
      query: Object.fromEntries(nextUrl.searchParams),
    });

    try {
      // Execute original handler
      const response = await handler(req, context);
      const duration = Date.now() - startTime;
      const responseSize = response.headers.get('content-length') || 'unknown';

      logger.info(`API Request Completed`, {
        requestId,
        method,
        path,
        status: response.status,
        durationMs: duration,
        responseSize,
      });

      // Inject Request ID into response headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time-MS', String(duration));
      return response;
    } catch (err) {
      const duration = Date.now() - startTime;
      const apiError = normalizeApiError(err);

      logger.error(`API Request Failed`, {
        requestId,
        method,
        path,
        status: apiError.statusCode,
        durationMs: duration,
        errorCode: apiError.errorCode,
        errorMessage: apiError.message,
        details: apiError.details,
        stack: err instanceof Error ? err.stack : undefined,
      });

      return sendError(
        apiError.message,
        apiError.errorCode,
        apiError.statusCode as any,
        apiError.details
      );
    }
  };
}
