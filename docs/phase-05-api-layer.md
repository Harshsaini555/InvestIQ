# Phase 5 Documentation: Backend API Layer

## Objective
The Backend API Layer acts as a thin, highly structured bridge between frontend requests and the LangGraph execution engine. Its goal is to validate incoming POST payloads (checking format and preventing injection), handle rate limits, time execution latency, write structured logs, intercept exceptions, and normalize outputs into standard successful or failed JSON structures.

## Folder Layout
- **`src/lib/api/config/`**: Contains centralized status codes, messages, and rate limits.
- **`src/lib/api/errors.ts`**: Implements custom `ApiError` class and normalization logic.
- **`src/lib/api/response.ts`**: Implements standardized success and error envelope response formatters.
- **`src/lib/api/request.ts`**: Contains safe request parsers and Zod schema validators.
- **`src/lib/api/middleware.ts`**: Higher-order API middleware function (`withApiMiddleware`) wrapping Next.js route handlers.
- **`src/app/api/research/route.ts`**: Endpoint route controller handling `POST /api/research`.

## Standardized JSON Formats

### Successful Response Envelope
```json
{
  "success": true,
  "message": "Research bundle generated successfully",
  "timestamp": "2026-07-11T01:30:00.000Z",
  "executionTime": 2450,
  "data": {
    "company": "AAPL",
    "collectedAt": "2026-07-11T01:30:00.000Z",
    "companyProfile": { ... },
    "financialData": { ... },
    "news": [ ... ],
    "competitors": [ ... ],
    "marketIntelligence": { ... }
  }
}
```

### Failed Response Envelope
```json
{
  "success": false,
  "error": "Request validation failed",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2026-07-11T01:30:00.000Z",
  "details": [
    { "field": "companyName", "message": "Company name is required" }
  ]
}
```

## Request Validation Rules
- **Company Name / Ticker**: Required, string length 1 to 100.
- **Validation constraints**: Checks for empty payloads, malformed JSON structures, and rejects invalid special characters (like `<`, `>`, `{`, `}`, `[`, `]`) to prevent script injection.

## Exception Normalization
Uncaught exceptions are intercepted inside `withApiMiddleware`. The error normalization logic maps standard errors, Zod errors, and internal pipeline failures to their respective HTTP status codes:
- **`ZodError` or custom validation failures** -> `400 Bad Request`.
- **Rate-limit hits** -> `429 Too Many Requests`.
- **Pipeline compiler failures / uncaught system issues** -> `500 Internal Server Error`.
Stack traces are never exposed in production responses, preserving API security boundaries.
