import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { withApiMiddleware } from '@/lib/api/middleware';
import { parseJsonBody, validateRequest } from '@/lib/api/request';
import { sendSuccess } from '@/lib/api/response';
import { ApiError } from '@/lib/api/errors';
import { HTTP_STATUS } from '@/lib/api/config/status-codes';
import { graph } from '@/agent/graph/graph';
import { createInitialGraphState } from '@/agent/graph/state/GraphState';
import { logger } from '@/utils/logger';

import { resolveCompany } from '@/services/research/company-resolver.service';

// Request validation schema
const researchRequestSchema = z.object({
  companyName: z.string()
    .min(1, 'Company name is required')
    .max(100, 'Company name is too long')
    .refine((val) => !/[<>{}[\]]/.test(val), {
      message: 'Company name contains invalid characters',
    }),
  ticker: z.string().optional(),
  depth: z.enum(['shallow', 'deep']).optional().default('shallow'),
  language: z.string().optional().default('en'),
});

/**
 * POST /api/research
 * Executes the LangGraph orchestration pipeline to gather structured company metrics.
 */
async function handleResearch(req: NextRequest) {
  const startTime = Date.now();
  const body = await parseJsonBody<unknown>(req);
  const validated = validateRequest(researchRequestSchema, body);

  logger.info(`Starting research pipeline invocation`, { company: validated.companyName });

  // Resolve companyName to a valid ticker (e.g. "tata" -> "TATAMOTORS.NS")
  let targetTicker = validated.companyName;
  try {
    const resolved = await resolveCompany(validated.companyName);
    if (resolved) {
      targetTicker = resolved.ticker;
      logger.info(`Resolved company name to ticker symbol`, { original: validated.companyName, resolved: targetTicker });
    }
  } catch (err) {
    logger.warn(`Failed to resolve company name, proceeding with original value`, {
      company: validated.companyName,
      error: err instanceof Error ? err.message : String(err)
    });
  }

  // Initialize graph state using state factory
  const initialState = createInitialGraphState(targetTicker);

  // Invoke compiled LangGraph
  const finalState = await graph.invoke(initialState, {
    recursionLimit: 25,
  });

  const duration = Date.now() - startTime;

  // Verify bundle was compiled successfully
  if (!finalState.researchBundle) {
    let friendlyMessage = 'Research pipeline failed to compile bundle.';
    if (finalState.errors) {
      const errorList = Object.entries(finalState.errors)
        .filter(([_, msg]) => msg && !msg.includes('Validation failed') && !msg.includes('Aggregation failed'))
        .map(([_, msg]) => msg);
      if (errorList.length > 0) {
        friendlyMessage = `Could not retrieve data for "${validated.companyName}". Please ensure the ticker symbol is valid and active on Yahoo Finance (e.g., AAPL, TSLA, TATAMOTORS.NS). Details: ${errorList[0]}`;
      }
    }
    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      friendlyMessage,
      'PIPELINE_ERROR',
      finalState.errors
    );
  }

  // Hide internal GraphState metadata and return only the structured ResearchBundle
  return sendSuccess(
    finalState.researchBundle,
    'Research bundle generated successfully',
    HTTP_STATUS.OK,
    duration
  );
}

// Export wrapped POST handler
export const POST = withApiMiddleware(handleResearch);
