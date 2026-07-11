# Engineering Decisions

> This document records the technology choices, architectural trade-offs, and design rationale behind InvestIQ. Every decision here was made deliberately — this is the reasoning.

---

## Technology Selection

### Next.js 15 (App Router)
Chosen because it unifies the client dashboard and serverless API endpoints under a single framework. The App Router's native support for Server-Sent Events (SSE) streaming is essential for delivering real-time LangGraph node progress to the client without a separate WebSocket server. Metadata routing (`robots.ts`, `sitemap.ts`, `manifest.ts`) is also native.

### LangGraph.js
Standard sequential API controllers struggle with error recovery, partial state, and step-by-step progress tracking. LangGraph provides a `StateGraph` model with typed shared state, custom merge reducers, and cyclic transition support — all of which are required by the research pipeline.

### LangChain.js
Provides a unified interface for prompt templates, message types, output parsers, and streaming buffers. If the model provider needs to change (e.g. Gemini → GPT-4o), only the model configuration changes — the prompt and parsing logic stays the same.

### Google Gemini 1.5 Pro / Flash
- **Pro** — Used for synthesis. Its large context window comfortably holds the full `ResearchBundle` (profile, financials, news, competitors).
- **Flash** — Used for the co-pilot chat route. Faster and cheaper for short, context-bound follow-up answers.

### Yahoo Finance + News API
Yahoo Finance provides reliable public financial metrics (trailing P/E, target prices, margins, debt ratios). News API provides live macro headlines. Together they cover both fundamental and sentiment data without requiring a paid Bloomberg or Refinitiv subscription.

### Zod
Serves a dual purpose: runtime validation at every external boundary (env vars, API request bodies, LLM outputs) and TypeScript type inference from a single schema definition. This eliminates the common drift between a TypeScript type and a separate validation schema.

### TanStack Query v5
Handles caching of completed investment reports so navigating back to a report does not trigger a new AI research run. Also provides loading/error state management out of the box.

### Zustand
Holds the current report in memory for the follow-up chat feature. Minimal, no provider wrapper required, and avoids Redux boilerplate for a narrow client state use case.

### Recharts
Renders chart components directly as SVG nodes inside React, allowing responsive layouts and custom CSS styling without canvas overhead or external DOM trackers.

### Vitest
Faster than Jest, supports TypeScript and ESM natively, and shares Vite's configuration for path alias resolution. The API is Jest-compatible, so migration cost is low if needed.

---

## Architectural Trade-offs

### Client-Side Synthesis vs Server-Side
The frontend fetches the `ResearchBundle` from `/api/research` and coordinates Gemini synthesis client-side. This reduces server execution time, which matters on serverless platforms with 10–15 second function limits. The 3–5 second LLM processing phase runs in the browser, keeping the experience responsive.

### Linear Graph vs Parallel Branching
The LangGraph pipeline runs nodes sequentially. Parallel execution of `company_profile`, `financials`, and `news` would be faster, but the linear path simplifies error isolation and produces highly readable log trails. Parallelization is scoped as a future optimization.

### In-Memory Cache vs Database
Report data is cached in temporary memory and passed directly in API payloads. This eliminates migration tooling, connection management, and schema design from the current scope. The trade-off is that reports do not persist across sessions — acceptable for a single-session equity research tool.

### Custom Logger vs Pino
A thin custom logger wrapping `console.*` was chosen over `pino` to avoid adding a dependency in the foundation phase. The interface is identical to what `pino` would expose, so swapping the implementation requires changing only the internals of `logger.ts`. The replacement point is explicitly marked with a comment.

### Thirteen Path Aliases vs Single `@/*`
Each major directory has its own alias (`@/agent`, `@/features`, `@/services`, etc.). This makes import statements self-documenting and makes it easier to enforce architectural boundaries at the linting level. The trade-off is additional configuration surface area in both `tsconfig.json` and `next.config.ts`.
