# AI Development Journal — Master Index

> This journal records the engineering decisions, iterations, and lessons learned across all phases of the InvestIQ project. Each phase entry covers objectives, deliverables, AI assistance, human decisions, and lessons learned.

---

## Phase Index

| Phase | Title | Status | Journal Entry |
|---|---|---|---|
| 01 | Project Foundation | ✅ Complete | [journal-phase-01-project-foundation.md](./journal-phase-01-project-foundation.md) |
| 02 | AI Foundation (Schemas, Prompts, LLM Config) | ✅ Complete | *(covered in phase-01 entry)* |
| 03 | Research Engine (Services & Tools) | 🔄 In Progress | *(in progress)* |
| 04 | LangGraph Orchestration Layer | ✅ Complete | [journal-phase-04-langgraph-pipeline.md](./journal-phase-04-langgraph-pipeline.md) |
| 05 | Backend API Layer | ✅ Complete | [journal-phase-05-backend-api-layer.md](./journal-phase-05-backend-api-layer.md) |
| 06 | AI Investment Intelligence Engine | ✅ Complete | [journal-phase-06-investment-engine.md](./journal-phase-06-investment-engine.md) |
| 07 | UI Layer & Interactive Dashboard | ✅ Complete | [journal-phase-07-ui-dashboard.md](./journal-phase-07-ui-dashboard.md) |

---

## Phase Summaries

### Phase 01 & 02 — Foundation & AI Schemas
Set up Next.js 15, TypeScript strict mode, and all foundational tooling (LangChain, LangGraph, Radix, Zod). Defined all Zod schemas, LLM configuration, prompt files, and the `ServiceResult<T>` discriminated union pattern. Key lesson: environment variable validation at startup prevents silent production failures.

### Phase 03 — Research Engine
Built the service layer that queries Yahoo Finance and News API and returns typed, validated data. Established the `timedGet<T>` HTTP client pattern and `ServiceResult<T>` error handling. Key lesson: Yahoo Finance returns null/empty arrays for micro-cap stocks — `z.nullable()` and `z.optional()` are essential.

### Phase 04 — LangGraph Orchestration
Implemented the 8-node sequential research pipeline. Custom merge reducers prevent state loss on dictionary fields. The `createGraphNode` wrapper centralizes timing, logging, and error boundaries across all nodes. Key lesson: LangGraph overrides parent fields on partial returns — custom reducers are required.

### Phase 05 — Backend API Layer
Created the `withApiMiddleware` higher-order wrapper for timing, request IDs, and error boundaries. Implemented safe JSON body parsing to prevent crashes on malformed payloads. Key lesson: Next.js global `middleware.ts` runs on the Edge runtime and cannot read request bodies — functional decorators solve this.

### Phase 06 — AI Investment Intelligence Engine
Built the Gemini synthesis engine with a custom LangChain output parser, corrective retry loops, and six modular guardrail checkers. Key lesson: feeding the exact Zod error messages back to the model as a correction prompt dramatically improves first-retry accuracy.

### Phase 07 — UI Layer
Built the glassmorphic dashboard with Framer Motion animations, SVG circular score meters, Recharts area/bar charts, and the streaming AI co-pilot chat drawer. Key lesson: Windows is case-insensitive but Vercel/Linux builds are case-sensitive — all imports must use exact file system casing.
