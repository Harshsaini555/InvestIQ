# Master AI Development Journal (Phases 1 - 7)

This journal records the engineering decisions, iterations, implementations, and verification notes for each phase of the AI Investment Research Agent project.

---

## Phase 1 & 2: Environment Setup, Services & Adapters
- **Objective**: Set up Next.js 15, TypeScript, and install foundational tools (LangChain, LangGraph, Radix primitives).
- **Deliverables**: Formulated custom API adapters to query Yahoo Finance and NewsAPI. Structured the `ServiceResult<T>` wrapper to standardise responses and handle rate limits.
- **Lessons Learned**: Avoid passing raw API errors to the client; normalising API outputs inside adapter layers keeps routes clean and decoupled.

---

## Phase 3: Zod Schemas & Initial Mock Parsers
- **Objective**: Establish typescript validation boundaries for the financial datasets.
- **Deliverables**: Coded Zod schemas for company profiles, financials, quotes, news articles, and competitor peers.
- **Lessons Learned**: Yahoo Finance can return empty arrays or null values when querying micro-cap stocks. Using `z.nullable()` and `z.optional()` prevents parsing crashes.

---

## Phase 4: LangGraph Orchestration Layer
- **Objective**: Implement the backend Sequential Multi-Node Data Collection Pipeline.
- **Deliverables**: Created `GraphState` with custom merge reducers to prevent concurrent data loss during node execution. Coded the company profile, financials, news, competitor, market intelligence, aggregation, and research validation nodes.
- **Lessons Learned**: LangGraph overrides parent fields on partial returns. Custom reducers are required to merge dictionary keys instead of replacing them.

---

## Phase 5: Backend API Layer
- **Objective**: Create a secure bridge between Next.js App Router and the LangGraph orchestrator.
- **Deliverables**: Created status configs and response normalizers. Implemented a higher-order handler middleware `withApiMiddleware` to generate unique request IDs, track latency, write log lines, and isolate route execution within an error boundary. Created `POST /api/research`.
- **Lessons Learned**: Next.js global middleware operates on the Edge runtime, preventing request body reads without consuming the request stream. Standardizing route handler decorators solves this.

---

## Phase 6: AI Investment Intelligence Engine
- **Objective**: Build the Gemini-powered synthesis parser and guardrails analyzer.
- **Deliverables**: Coded the structured output parser, dynamic retries loop with error feedback, and guardrail modules checking score consistency, SWOT minimums, word limit rules, and completeness penalties.
- **Lessons Learned**: Feeding compiler/parsing errors back to the model as context prompts (corrective feedback) drastically improves JSON generation accuracy.

---

## Phase 7: UI Layer & Interactive Dashboard
- **Objective**: Build the Vercel-grade glassmorphic search dashboard and streaming co-pilot chat.
- **Deliverables**: Next.js landing page with animated gradients, Cursor-like terminal progress loaders, circular SVG meters, Recharts area/bar comparisons, and the streaming AI chat drawer co-pilot.
- **Lessons Learned**: Casing conflicts between files (`Footer.tsx` vs `footer.tsx`) cause type-check errors in strict environments (tsc). Standardizing import paths to capital case resolves this.
