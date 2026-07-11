# Chat Transcripts — Phase 01 to Final

> A chronological log of key prompts, AI recommendations, and engineering decisions made during development. This is not a verbatim transcript — it captures the intent, recommendation, and outcome of each significant session.

---

## Phase 01 & 02 — Project Bootstrap & AI Foundation

**Prompt:** Set up Next.js 15 App Router with TypeScript strict mode, configure TailwindCSS with HSL variables, and scaffold the complete folder structure.

**AI Recommendation:** Establish HSL CSS variables in `globals.css` mapped directly to Tailwind classes. Implement a singleton TanStack Query client provider. Define all domain types via `z.infer` from Zod schemas — no separate type files.

**Outcome:** Installed Radix UI primitives, created `providers.tsx`, defined all Zod schemas in `agent/schemas/`, deleted `src/types/report.types.ts` to eliminate duplication.

---

## Phase 04 — LangGraph Orchestration

**Prompt:** Implement a multi-node sequential research pipeline. The graph should run: Validate Input → Company Profile → Financials → News → Competitors → Market Intelligence → Aggregate → Verify → END.

**AI Recommendation:** Use custom merge reducers on dictionary state channels to prevent state loss. Design a modular structure partitioning nodes, state annotations, helpers, and workflow builders into separate directories.

**Outcome:** Grouped collection nodes under `src/agent/graph/nodes/`, created `node-wrapper.ts` with `createGraphNode`, implemented `GraphState` with custom reducers for all dictionary fields.

---

## Phase 05 — API Layer

**Prompt:** Create `POST /api/research` to receive the company name, validate it, execute the research pipeline, and return a formatted `ResearchBundle` while hiding internal graph state.

**AI Recommendation:** Implement a functional decorator pattern (`withApiMiddleware`) to encapsulate timing, request ID generation, and global exception boundaries. Use `parseJsonBody` to safely read raw request text before parsing.

**Outcome:** Created `withApiMiddleware`, centralized status codes and messages in `config/`, implemented `sendSuccess` and `formatApiError` envelope formatters.

---

## Phase 06 — AI Synthesis Engine

**Prompt:** Build the AI Investment Intelligence Engine. Takes a `ResearchBundle`, outputs a typed `InvestmentAnalysis` via Gemini. Implement Zod validation, scoring methodology, SWOT validation, risk analysis, and up to 2 correction retries on schema failures.

**AI Recommendation:** Create modular guardrail files inside `analysis/` for each check (scoring, risk, swot, recommendation, summary, confidence). Design a custom LangChain output parser with regex-based JSON extraction.

**Outcome:** Implemented `output-parser.ts`, `investment-engine.ts`, and six guardrail modules. Corrective retry loop feeds exact Zod errors back to the model.

---

## Phase 07 — UI Dashboard & Streaming Chat

**Prompt:** Create a premium dark-theme dashboard and a streaming follow-up co-pilot. Inspired by Perplexity AI, Arc, and Linear.

**AI Recommendation:** Use Framer Motion for entrance animations and circular SVG score meters. Wrap Recharts in `ResponsiveContainer` to prevent SSR hydration errors. Route chat prompts through `/api/chat` with a streaming Gemini response.

**Outcome:** Built glassmorphic dashboard with all components. Resolved Windows casing conflicts. TypeScript compile check passed with 0 errors. 19/19 Vitest tests passing.
