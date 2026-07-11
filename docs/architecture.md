# System Architecture Specification

This document details the software architecture, data flow paths, and structural designs of the InvestIQ Investment platform.

---

## 1. Overall System Architecture
The platform is designed around a three-tier architectural layout:

1. **Frontend Presentation Layer**: Next.js App Router providing interactive landing, progress trackers, charts, and co-pilot panels.
2. **Backend API Layer**: Exposed routes wrapped in telemetry, tracing, and validation middlewares, managing execution boundaries.
3. **Reasoning & Orchestration Layer**: LangGraph workflow coordinator executing data collectors and aggregation schemas, coupled with a Gemini-powered validation and synthesis engine.

---

## 2. Data Flow Architecture

```
User Query (Ticker)
  │
  ▼
[Next.js Client]
  │
  ├─► Start progress UI animations
  │
  └─► POST /api/research { companyName: "AAPL" }
        │
        ▼
   [API Route Controller]
        │
        ├─► validate request parameters (Zod)
        │
        └─► graph.invoke(initialState)
              │
              ├─► Node 1: Normalize & format check
              ├─► Node 2: fetchCompanyProfile summary
              ├─► Node 3: fetchFinancialData quotes & ratios
              ├─► Node 4: fetchNews articles
              ├─► Node 5: fetchCompetitor profiles & financials
              ├─► Node 6: fetchMarketIntelligence sector news
              ├─► Node 7: Aggregation (bundle compilation)
              └─► Node 8: integrity check (duplicate clean-up)
                    │
                    ▼
           Returns: ResearchBundle
              │
              ▼
   [Frontend Workspace Engine]
        │
        ├─► Render metrics charts (Recharts)
        │
        └─► Trigger AI Synthesis (Gemini 1.5 Pro)
              │
              ├─► compile prompts with research data
              ├─► validate JSON layout (output-parser.ts)
              ├─► [Optional] self-correct retry loop on schema fail
              ├─► apply confidence penalties and verdict alignment checks
              │
              ▼
           Returns: InvestmentAnalysis
              │
              ▼
   [Interactive Dashboard] ◄──► [AI Co-Pilot Panel] ──► POST /api/chat
```

---

## 3. Orchestration Layer (LangGraph)
We model our research pipeline as a sequential directed graph in LangGraph.js:
- **GraphState**: An annotation state container containing variables for ticker metadata, research data structures, and errors.
- **Merge Reducers**: Standard dictionaries override keys on partial returns. We implement custom merge reducers to append list warnings, track execution timings, and record error maps concurrently.
- **Node Wrapper Helper**: Prevents failures in individual services (e.g. NewsAPI timeouts) from crashing the entire execution flow. Logs are structured to report performance.

---

## 4. Synthesis Engine (Gemini)
The Synthesis Engine processes the completed data bundle to build reports:
- **Zod Schema Parser**: Enforces structured typing for ratings, SWOT points, and risk descriptions.
- **Self-Correction Retry**: Uses LangChain to feed model outputs back into schema validation loops. If a schema error occurs, the engine passes the compiler diagnostics back to the model as an error prompt, prompting immediate self-correction.
- **Dynamic Scoring Check**: Validates that all scores align (e.g., that Overall Score matches weighted sub-score averages) and that the final recommendation matches score boundaries.
