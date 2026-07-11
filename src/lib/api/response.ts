import { NextResponse } from 'next/server';
import { type HttpStatus } from './config/status-codes';

interface SuccessEnvelope<T> {
  success: true;
  message: string;
  timestamp: string;
  executionTime: number;
  data: T;
}

interface ErrorEnvelope {
  success: false;
  error: string;
  errorCode: string;
  timestamp: string;
  details?: unknown;
}

/**
 * Sends a standardized success API response.
 */
export function sendSuccess<T>(
  data: T,
  message: string,
  statusCode: HttpStatus = 200,
  executionTime = 0
): NextResponse<SuccessEnvelope<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      executionTime,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Sends a standardized error API response.
 */
export function sendError(
  message: string,
  errorCode: string,
  statusCode: HttpStatus = 500,
  details?: unknown
): NextResponse<ErrorEnvelope> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errorCode,
      timestamp: new Date().toISOString(),
      details: details ?? null,
    },
    { status: statusCode }
  );
}
