import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { ApiError } from './errors';
import { HTTP_STATUS } from './config/status-codes';

/**
 * Safely parses the JSON body of a request.
 * Throws a BAD_REQUEST ApiError on malformed payloads.
 */
export async function parseJsonBody<T>(req: NextRequest): Promise<T> {
  try {
    const text = await req.text();
    if (!text.trim()) {
      throw new Error('Request body is empty');
    }
    return JSON.parse(text) as T;
  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      `Malformed JSON payload: ${error instanceof Error ? error.message : String(error)}`,
      'MALFORMED_JSON'
    );
  }
}

/**
 * Validates request data against a Zod schema.
 * Throws an ApiError enclosing Zod validation detail arrays on error.
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Request validation failed',
      'VALIDATION_ERROR',
      details
    );
  }
  return result.data;
}
