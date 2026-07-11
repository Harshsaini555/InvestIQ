# Chat Transcript Summary — Phase 05: Backend API Layer

---

## Session Goal

Establish the API layer. The frontend communicates with API endpoints rather than LangGraph directly. `POST /api/research` receives the company name, validates it, executes the pipeline, and returns a formatted `ResearchBundle` while hiding internal graph state.

---

## Key Decisions

**Functional Decorator Pattern**
`withApiMiddleware` wraps handler functions to ensure a global error boundary is active and timing stats are recorded on every request.

**Safe Body Parsing**
`parseJsonBody` reads raw request text before parsing to prevent uncaught exceptions on empty or malformed JSON payloads.

**Internal State Isolation**
Only the nested `researchBundle` field is returned in successful responses. Raw node metrics, execution states, and internal errors are never exposed to the client.

---

## AI Clarifications

- Advised on standardizing JSON success and error envelopes with a discriminated union on the `success` boolean.
- Proposed the Next.js App Router controller wrapper pattern as an alternative to global `middleware.ts` (which cannot read request bodies on the Edge runtime).
