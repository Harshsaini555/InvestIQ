import { HTTP_STATUS } from './config/status-codes';
import { API_MESSAGES } from './config/messages';
import { ValidationError as AppValidationError } from '@/utils/error';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errorCode: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Normalizes any error object to a structured ApiError.
 */
export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof AppValidationError) {
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      error.message,
      'VALIDATION_ERROR',
      error.context?.issues || null
    );
  }

  if (error instanceof z.ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      API_MESSAGES.VALIDATION_ERROR,
      'VALIDATION_ERROR',
      details
    );
  }

  const message = error instanceof Error ? error.message : String(error);

  // If the error message indicates validation, default to BAD_REQUEST
  if (message.toLowerCase().includes('validation') || message.toLowerCase().includes('invalid')) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, 'VALIDATION_ERROR');
  }

  // Handle generic network or rate limit errors
  if (message.toLowerCase().includes('rate limit')) {
    return new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, API_MESSAGES.RATE_LIMIT_EXCEEDED, 'RATE_LIMITED');
  }

  return new ApiError(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.UNEXPECTED_ERROR,
    'INTERNAL_SERVER_ERROR'
  );
}
