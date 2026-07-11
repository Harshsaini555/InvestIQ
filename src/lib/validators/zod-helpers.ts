import { z } from 'zod';

import { ValidationError } from '@/utils/error';

/**
 * Parses data with a Zod schema and throws a typed ValidationError on failure.
 * Use at API boundaries and LLM output validation.
 */
export function parseOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(', ');

    throw new ValidationError(`Schema validation failed: ${message}`, {
      issues: result.error.issues,
    });
  }

  return result.data;
}

/**
 * Parses data with a Zod schema and returns null on failure instead of throwing.
 * Use when partial data is acceptable.
 */
export function parseOrNull<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
  const result = schema.safeParse(data);
  return result.success ? result.data : null;
}
