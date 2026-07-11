# System Architecture

> InvestIQ is built on a three-tier architecture: a Next.js presentation layer, a serverless API layer, and a LangGraph + Gemini reasoning layer. Each tier has a single responsibility and communicates through typed contracts.

---

## Tiers at a Glance

| Tier | Technology | Responsibility |
|---|---|---|
| Presentation | Next.js 15 App Router | UI, streaming progress, dashboard |
| API | Next.js Route Handlers | Request validation, middleware, response enveloping |
| Reasoning | LangGraph + Gemini 2.0 Flash | Data collection, synthesis, guardrail validation |

---

## End-to-End Data Flow

```
User Query (Ticker Symbol)
        │
        ▼
  [Next.js Client]
        │
        ├── Starts progress UI animations
        │
        └── POST /api/research { companyName: "AAPL" }
                │
                ▼
        [API Route Controller]
                │
                ├── Validate request parameters (Zod)
                │
                └── graph.invoke(initialState)
                        │
                        ├── Node 1: Normalize & format check
                        ├── Node 2: fetchCompanyProfile
                        ├── Node 3: fetchFinancialData
                        ├── Node 4: fetchNews
                        ├── Node 5: fetchCompetitors
                        ├── Node 6: fetchMarketIntelligence
                        ├── Node 7: Aggregate → ResearchBundle
                        └── Node 8: Integrity check & deduplication
                                │
                                ▼
                        ResearchBundle (typed JSON)
                                │
                                ▼
        [Gemini Synthesis Engine]
                │
                ├── Compile prompts with ResearchBundle
                ├── Validate JSON output (Zod)
                ├── Self-correct retry loop (max 2 retries)
                ├── Apply analytical guardrails
                │
                ▼
        InvestmentAnalysis (typed JSON)
                │
                ▼
  [Interactive Dashboard]
```

---

## LangGraph Orchestration Layer

The research pipeline is modelled as a sequential directed graph in LangGraph.js.

**Key design decisions:**

- **GraphState** — A central `Annotation.Root` container holds all variables: ticker metadata, research data, node statuses, execution timings, errors, and warnings.
- **Custom Merge Reducers** — Dictionary fields (`nodeStatus`, `errors`, `warnings`, `timestamps`) use custom spread reducers so partial node returns merge keys rather than overwrite the entire object.
- **Node Wrapper** — `createGraphNode` wraps every node in a try-catch timing loop. A single API failure (e.g. NewsAPI timeout) logs the error to `state.errors[nodeName]` and allows the rest of the pipeline to continue.

---

## Synthesis Engine (Gemini)

The engine processes the completed `ResearchBundle` to produce a structured `InvestmentAnalysis`.

**Processing stages:**

1. **Prompt Compilation** — Injects the full `ResearchBundle` into structured XML blocks (`<context>`, `<data_bundle>`, `<instruction>`, `<format_rules>`).
2. **Zod Schema Parser** — Strips markdown fences, extracts the outermost JSON object, and validates against the `investmentReportSchema`.
3. **Self-Correction Retry** — On schema failure, the exact Zod error messages are appended to the message history and the model is re-invoked (up to 2 retries).
4. **Analytical Guardrails** — Post-parse checks verify score consistency, recommendation alignment, SWOT minimums, risk completeness, and summary word limits.
5. **Confidence Penalty** — If the `ResearchBundle` is missing critical fields, the confidence score is dynamically reduced to prevent overconfidence on incomplete data.
