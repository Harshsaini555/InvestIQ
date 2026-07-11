# AI Development Journal: Phase 5 - Backend API Layer

## Objective
Establish a secure, validated, and timing-monitored backend API layer interfacing with the LangGraph pipeline.

## AI Suggestions & Engineering Decisions
- **Higher-Order Middleware Wrapper**: Since Next.js App Router does not support Express-like global route middlewares natively (except via `middleware.ts` which has limited access to request bodies), the AI recommended a functional decorator pattern: wrapping the controller with `withApiMiddleware`. This encapsulates timing, Request ID generation, and global exception boundaries.
- **Request Safety Parser**: The AI created `parseJsonBody` to intercept raw request text. Standard Next.js `req.json()` throws a generic unhandled crash error if the request body is empty or contains malformed JSON. Safely reading raw text first and catching exceptions prevents runtime crashes.

## Human Alignment & Design Reviews
- **DATA MINIMIZATION IN RESPONSES**: Reviewed whether to return the entire `GraphState` (with durations, execution lists, node states) to the client. We aligned on returning only the finalized `ResearchBundle` and hiding internal node status structures. This keeps responses clean and keeps internal state secure.

## Lessons Learned
- Writing thin API controllers that delegate logic directly to the graph keeps the code highly modular and simple to read.
- Centralizing status codes and messages in `config/` makes testing and auditing API interfaces direct.
