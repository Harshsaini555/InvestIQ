# Phase 4 Documentation: LangGraph Research Pipeline

## Objective
The orchestration layer of the AI Investment Research Agent is built using LangGraph.js. Its goal is to act as a structured research manager, sequentially invoking independent data collectors, tracking execution metadata (latency, success/failure, node statuses, logs), and assembling the outputs into a validated `ResearchBundle` structure without LLM reasoning or score generation.

## Architecture
The orchestration pipeline follows a modular architecture where the state channel configuration, node operations, helper utilities, and graph assembly are isolated into separate directories.
- **State**: `GraphState.ts` declares the channels and types.
- **Nodes**: One file per node inside `nodes/`, wrapped by `node-wrapper.ts`.
- **Helpers**: Node wrapper manages timings, logs, and error boundaries.
- **Workflow**: `graph.ts` compiles the sequential nodes.

## Node Responsibilities
1. **validate_input**: Confirms and normalizes the ticker format (converting to uppercase).
2. **company_profile**: Fetches structured company profile data using the `fetchCompanyProfile` service.
3. **financials**: Fetches fundamental financial metrics using the `fetchFinancialData` service.
4. **news**: Queries recent stock headlines using the `fetchNews` service.
5. **competitors**: Fetches profile and financials for peer competitor stocks.
6. **market_intelligence**: Gathers macro trends and sector news using the `fetchMarketIntelligence` service.
7. **aggregate**: Consolidates profile, financials, news, competitors, and macro news into a `ResearchBundle`.
8. **validate_bundle**: Performs final integrity checks (filters duplicate URLs, verifies competitor tickers).

## GraphState Channel Schema
```typescript
export interface GraphState {
  companyName: string;
  companyProfile: CompanyProfileData | null;
  financialMetrics: FinancialData | null;
  news: NewsArticle[];
  competitors: CompetitorData[];
  marketIntelligence: MarketIntelligenceData | null;
  researchBundle: ResearchBundle | null;
  executionMetadata: ExecutionMetadata;
  nodeStatus: Record<string, NodeStatusType>;
  errors: Record<string, string>;
  warnings: Record<string, string[]>;
  timestamps: Record<string, { startedAt: string; completedAt: string | null }>;
}
```

## Design Decisions
- **Merge Reducers**: Custom reducers are used on shared dictionary state channels (like `nodeStatus`, `errors`, `warnings`, `timestamps`, and `executionMetadata`) to prevent concurrent nodes or subsequent executions from wiping out previously tracked state.
- **Unified Node Wrapper**: The `createGraphNode` wrapper implements DRY principles by centralizing time measurement, state transition status tracking (`running` -> `complete` or `failed`), log outputs, and catch boundaries.

## Trade-offs and Future Improvements
- **Sequential Execution**: The current graph transitions linearly. This is highly deterministic but slow. A future optimization would run `company_profile`, `financials`, and `news` concurrently using LangGraph's parallel state branching, and then synchronize them before `aggregate`.
- **Fail-Safe Pipeline**: Rather than crashing the process, API and validation failures on single nodes are logged and added to `failedNodes` and `errors` lists inside the state. This allows subsequent synthesis steps to process partial bundles gracefully.
