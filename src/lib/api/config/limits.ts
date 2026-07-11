export const API_LIMITS = {
  TIMEOUT_MS: 45_000, // 45 seconds timeout for complete pipeline execution
  RATE_LIMIT_WINDOW_MS: 60_000, // 1 minute window
  RATE_LIMIT_MAX_REQUESTS: 10,
} as const;
