import { z } from 'zod';

const envSchema = z.object({
  /* ── AI / LLM ── */
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  GEMINI_MODEL_NAME: z.string().min(1, 'GEMINI_MODEL_NAME is required'),

  /* ── LangSmith (optional in development) ── */
  LANGCHAIN_TRACING_V2: z.enum(['true', 'false']).optional(),
  LANGCHAIN_API_KEY: z.string().optional(),
  LANGCHAIN_PROJECT: z.string().optional(),

  /* ── External APIs ── */
  YAHOO_FINANCE_API_KEY: z.string().optional().default(''),
  YAHOO_FINANCE_BASE_URL: z.string().url('YAHOO_FINANCE_BASE_URL must be a valid URL').optional().default('https://query1.finance.yahoo.com'),
  NEWS_API_KEY: z.string().min(1, 'NEWS_API_KEY is required'),
  NEWS_API_BASE_URL: z.string().url('NEWS_API_BASE_URL must be a valid URL'),

  /* ── App Config ── */
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1, 'NEXT_PUBLIC_APP_NAME is required'),
  NEXT_PUBLIC_ENABLE_CHAT: z.enum(['true', 'false']).default('false'),

  /* ── Rate Limiting ── */
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().positive().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(60_000),

  /* ── Cache (optional) ── */
  REDIS_URL: z.string().url().optional(),

  /* ── Observability (optional in development) ── */
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

/**
 * Validated and typed environment variables.
 * Import this instead of accessing process.env directly.
 *
 * Throws at startup if any required variable is missing or malformed.
 */
function validateEnv() {
  const sanitizedEnv = Object.fromEntries(
    Object.entries(process.env).map(([key, val]) => [
      key,
      val === '' ? undefined : val,
    ])
  );
  const result = envSchema.safeParse(sanitizedEnv);

  if (!result.success) {
    // During Next.js build compilation phase, bypass throwing validation errors
    // so that static pages build successfully without requiring production keys in the build logs
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return (result.data || sanitizedEnv) as unknown as Env;
    }

    const formatted = result.error.issues
      .map((issue) => `  • ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Environment variable validation failed:\n${formatted}`);
  }

  return result.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
