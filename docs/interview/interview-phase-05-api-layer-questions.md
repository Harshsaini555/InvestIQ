# Interview Notes — Phase 05: Backend API Layer

---

## Q1: Why wrap controllers in a custom middleware instead of using Next.js global middleware?

Next.js global `middleware.ts` runs on the Edge runtime before routing. It cannot read the parsed request body without consuming the stream, which blocks the controller from reading it. `withApiMiddleware` wraps the route controller as a functional decorator within the Node.js runtime, giving full access to the request lifecycle — safe payload parsing, error interception, latency measurement, and tracking header injection.

---

## Q2: How does input validation prevent malicious payloads or crashes?

Two layers of defense:

1. `parseJsonBody` reads the raw request text stream and catches parse exceptions, preventing runtime crashes on empty or malformed JSON.
2. The parsed object is validated against a Zod schema (`researchRequestSchema`) that enforces string length constraints and rejects invalid characters (`<`, `>`, `{`, `}`, `[`, `]`) to prevent script injection.

Any failure immediately returns a `400 Bad Request` with structured validation feedback.

---

## Q3: Why hide the internal GraphState from the API response?

The `GraphState` contains execution details (node statuses, duration metrics, internal errors) that are implementation details. Exposing them creates information disclosure risks, increases payload size, and tightly couples the frontend to the internal graph structure. Returning only the clean `ResearchBundle` enforces separation of concerns.

---

## Q4: What is the value of centralizing HTTP status codes and messages?

Centralization eliminates magic numbers (200, 400, 500) and hardcoded message strings scattered across routes. Defining them in `config/status-codes.ts` and `config/messages.ts` ensures consistency across all API responses and makes updates a single-file change.
