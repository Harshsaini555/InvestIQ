# Phase 05 — Backend API Layer

**Status:** Complete

---

## Objective

Create a secure, validated, and timing-monitored API layer that acts as the bridge between the Next.js frontend and the LangGraph execution engine.

---

## What Was Built

- `withApiMiddleware` higher-order wrapper for timing, request ID generation, and global error boundaries
- `parseJsonBody` safe request parser preventing crashes on empty or malformed JSON
- Centralized status codes and response messages in `src/lib/api/config/`
- `sendSuccess` and `formatApiError` response envelope formatters
- `POST /api/research` route controller

---

## Key Engineering Decisions

**Higher-Order Middleware Wrapper**
Next.js global `middleware.ts` runs on the Edge runtime before routing and cannot read request bodies without consuming the stream. A functional decorator pattern (`withApiMiddleware`) wraps the route controller instead, giving full access to the request lifecycle within the Node.js runtime.

**Safe Body Parsing**
Standard `req.json()` throws a generic unhandled crash on empty or malformed JSON. `parseJsonBody` reads the raw text stream first and catches parse exceptions, returning a structured `400 Bad Request` instead of a runtime crash.

**Internal State Isolation**
The full `GraphState` (node statuses, execution durations, internal errors) is never returned to the client. Only the finalized `ResearchBundle` is included in the success response. This prevents information disclosure and decouples the frontend from internal graph structure.

---

## Lessons Learned

- Centralizing HTTP status codes and messages in `config/` makes API responses consistent and easy to audit.
- Thin API controllers that delegate directly to the graph are significantly easier to test and maintain than controllers with embedded business logic.
- Standardizing error envelopes at the middleware level means individual route handlers never need to handle error formatting.
