# AI Development Journal: Phase 4 - LangGraph Research Pipeline

## Objective
Establish the LangGraph research orchestration pipeline to run deterministic, sequential data collection steps and compile the final `ResearchBundle`.

## AI Assistance & Engineering Decisions
- **Custom Reducer Pattern**: The AI suggested using custom reducers for dictionary fields (`nodeStatus`, `errors`, `warnings`, `timestamps`, `executionMetadata`) in the `GraphState` Annotation configuration. Since Next.js and LangGraph manage asynchronous state updates, standard object overrides can overwrite metadata. Custom spread reducers ensure updates are merged.
- **Node Execution Wrapper**: To avoid writing identical try-catch timing structures in all eight nodes, the AI designed `createGraphNode`, which abstracts metadata collection, logging, and status transitions, ensuring clean, DRY node code.

## Human Alignment & Design Reviews
- **LINEAR FLOW VS PARALLEL BRANCHING**: Evaluated parallel branching for profile, financials, and news fetching. While parallel execution is faster, the linear path simplifies error isolation and makes log trails highly readable. The linear path was selected for the initial release, with parallelization planned for a future optimization.

## Lessons Learned
- LangGraph.js 0.2.x annotations simplify state configuration. Utilizing `Annotation.Root({ ... })` prevents the need for manual channel mappings.
- Wrapping business processes in pure service modules (like `fetchCompanyProfile` or `fetchNews`) keeps graph nodes extremely thin and independently testable.
