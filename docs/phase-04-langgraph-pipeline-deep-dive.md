# Phase 04 — LangGraph Research Pipeline

> The orchestration layer runs deterministic, sequential data collection steps and compiles the final `ResearchBundle`. No LLM reasoning or score generation happens here — this layer is purely data collection and aggregation.

---

## Architecture

```
src/agent/graph/
├── state/
│   └── GraphState.ts           # Annotation.Root, channel types, merge reducers
├── nodes/
│   ├── validate-input.node.ts
│   ├── company-profile.node.ts
│   ├── financials.node.ts
│   ├── news.node.ts
│   ├── competitors.node.ts
│   ├── market-intelligence.node.ts
│   ├── aggregate.node.ts
│   └── validate-bundle.node.ts
├── helpers/
│   └── node-wrapper.ts         # createGraphNode — timing, logging, error boundaries
└── graph.ts                    # Compiles and exports the executable graph
```

---

## Node Responsibilities

| Node | Service Called | Output Field |
|---|---|---|
| `validate_input` | — | Normalizes `companyName` to uppercase |
| `company_profile` | `fetchCompanyProfile` | `state.companyProfile` |
| `financials` | `fetchFinancialData` | `state.financialMetrics` |
| `news` | `fetchNews` | `state.news` |
| `competitors` | `fetchCompetitors` | `state.competitors` |
| `market_intelligence` | `fetchMarketIntelligence` | `state.marketIntelligence` |
| `aggregate` | — | `state.researchBundle` |
| `validate_bundle` | — | Filters duplicates, raises warnings |

---

## GraphState Schema

```typescript
interface GraphState {
  companyName: string;
  companyProfile: CompanyProfileData | null;
  financialMetrics: FinancialData | null;
  news: NewsArticle[];
  competitors: CompetitorData[];
  marketIntelligence: MarketIntelligenceData | null;
  researchBundle: ResearchBundle | null;
  nodeStatus: Record<string, NodeStatusType>;
  errors: Record<string, string>;
  warnings: Record<string, string[]>;
  timestamps: Record<string, { startedAt: string; completedAt: string | null }>;
  executionMetadata: ExecutionMetadata;
}
```

---

## Design Decisions

**Merge Reducers**
Dictionary state channels use custom spread reducers to prevent concurrent or sequential node updates from wiping previously tracked metadata. A node updating `errors["financials"]` does not overwrite `errors["company_profile"]`.

**Unified Node Wrapper**
`createGraphNode` centralizes time measurement, status transitions (`running → complete | failed`), log output, and catch boundaries. Individual node files contain only their service call and data mapping logic.

**Fail-Safe Pipeline**
API and validation failures on individual nodes are logged to `state.errors[nodeName]` and `state.warnings[nodeName]`. The pipeline completes its run and returns a partial state, which the synthesis engine processes gracefully.

---

## Trade-offs

| Decision | Trade-off |
|---|---|
| Linear execution | Deterministic and debuggable, but total time = sum of all node durations |
| Fail-safe (no crash on node failure) | Pipeline always completes, but synthesis may work with incomplete data |
| Service modules separate from nodes | Nodes are thin and testable, but adds one layer of indirection |

**Future optimization:** Run `company_profile`, `financials`, and `news` in parallel using LangGraph branching, then synchronize before `aggregate`.
