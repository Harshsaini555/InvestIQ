import { type ErrorCode } from '@/types/api.types';

/* ── Typed Error Classes ───────────────────────────────────── */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', 400, context);
    this.name = 'ValidationError';
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'EXTERNAL_API_ERROR', 502, context);
    this.name = 'ExternalApiError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 'RATE_LIMITED', 429);
    this.name = 'RateLimitError';
  }
}

export class AgentError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'AGENT_ERROR', 500, context);
    this.name = 'AgentError';
  }
}

/* ── Error Normalization ───────────────────────────────────── */

/**
 * Extracts a safe, user-facing message from any thrown value.
 * Never exposes internal error details.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Narrows an unknown caught value to an Error instance.
 */
export function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

/**
 * Type guard for AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
