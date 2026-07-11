# Phase 05 — Backend API Layer

> The API layer is a thin, structured bridge between the Next.js frontend and the LangGraph execution engine. It validates inputs, executes the pipeline, and returns clean response envelopes — nothing more.

---

## Folder Structure

```
src/lib/api/
├── config/
│   ├── status-codes.ts     # Centralized HTTP status codes
│   ├── messages.ts         # Centralized response messages
│   └── limits.ts           # Rate limiting configuration
├── errors.ts               # ApiError class and error normalization
├── response.ts             # sendSuccess() and formatApiError()
├── request.ts              # parseJsonBody() and Zod schema validators
└── middleware.ts           # withApiMiddleware higher-order wrapper

src/app/api/
├── research/
│   └── route.ts            # POST /api/research
└── chat/
    └── route.ts            # POST /api/chat (streaming)
```

---

## Response Envelopes

**Success (200)**
```json
{
  "success": true,
  "message": "Research bundle generated successfully",
  "timestamp": "2026-07-11T01:30:00.000Z",
  "executionTime": 2450,
  "data": { "company": "AAPL", "companyProfile": {}, "financialData": {}, "news": [], "competitors": [], "marketIntelligence": {} }
}
```

**Failure (400 / 429 / 500)**
```json
{
  "success": false,
  "error": "Request validation failed",
  "errorCode": "VALIDATION_ERROR",
  "timestamp": "2026-07-11T01:30:00.000Z",
  "details": [{ "field": "companyName", "message": "Company name is required" }]
}
```

---

## Request Validation

| Rule | Detail |
|---|---|
| `companyName` | Required, string, length 1–100 |
| Special characters | Rejects `<`, `>`, `{`, `}`, `[`, `]` |
| Body format | `parseJsonBody` reads raw text first — prevents crashes on empty or malformed JSON |

---

## Error Normalization

| Error Type | HTTP Status |
|---|---|
| `ZodError` / `ValidationError` | `400 Bad Request` |
| `RateLimitError` | `429 Too Many Requests` |
| Pipeline failure / uncaught exception | `500 Internal Server Error` |

Stack traces are never exposed in production responses.

---

## `withApiMiddleware` Responsibilities

- Generates a unique `X-Request-ID` for each request
- Records start time and calculates total execution duration
- Writes structured log lines (method, path, status, duration, request ID)
- Provides a global error boundary — uncaught exceptions never reach the client as unformatted crashes
- Returns only the `researchBundle` field — internal `GraphState` is never exposed
