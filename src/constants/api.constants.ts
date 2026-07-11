/* ── HTTP Status Codes ─────────────────────────────────────── */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/* ── Internal API Routes ───────────────────────────────────── */
export const API_ROUTES = {
  RESEARCH: '/api/research',
  CHAT: '/api/chat',
  STREAM: '/api/stream',
} as const;

/* ── External API Base URLs ────────────────────────────────── */
export const YAHOO_FINANCE_BASE_URL =
  process.env.YAHOO_FINANCE_BASE_URL ?? 'https://query1.finance.yahoo.com';

export const NEWS_API_BASE_URL =
  process.env.NEWS_API_BASE_URL ?? 'https://newsapi.org/v2';

/* ── Request Config ────────────────────────────────────────── */
export const REQUEST_TIMEOUT_MS = 15_000;
export const MAX_RETRIES = 2;
export const RETRY_DELAY_MS = 1_000;

/* ── Rate Limiting ─────────────────────────────────────────── */
export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 10);
export const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);

/* ── Error Codes ───────────────────────────────────────────── */
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  EXTERNAL_API_ERROR: 'EXTERNAL_API_ERROR',
  AGENT_ERROR: 'AGENT_ERROR',
  STREAM_ERROR: 'STREAM_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
