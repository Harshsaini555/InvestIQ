# Interview Notes — Phase 04: LangGraph Research Pipeline

---

## Q1: Why LangGraph instead of a simple `Promise.all` or linear script?

Standard Promise chains become difficult to debug, track execution timing, retry specific failing steps, or manage conditional branching at scale. LangGraph provides a structured state machine with built-in checkpointing, typed shared state, and execution tracking. It makes the pipeline explainable, trace-ready (via LangSmith), and maintainable as complexity grows.

---

## Q2: How does GraphState avoid data race issues or state loss?

LangGraph overrides parent fields on partial state returns. To prevent this, dictionary channels (`nodeStatus`, `errors`, `warnings`, `timestamps`, `executionMetadata`) are declared with custom merge reducers. The reducer intercepts updates and merges new keys into the existing object rather than replacing it — so a node updating `errors["financials"]` does not wipe `errors["company_profile"]`.

---

## Q3: How does a single API failure not crash the entire pipeline?

All node logic is wrapped in `createGraphNode`. If an error occurs (timeout, rate limit, malformed response), the wrapper catches it, sets `nodeStatus[nodeName] = 'failed'`, and logs the error in `state.errors[nodeName]` rather than rethrowing. The graph completes its run and returns a partial state, which the synthesis engine can process gracefully.

---

## Q4: What are the trade-offs of the linear graph path?

The main trade-off is latency — total execution time is the sum of all node durations. In a production system, `company_profile`, `financials`, and `news` could run in parallel using LangGraph branching, then synchronize before `aggregate`. The linear flow was chosen for the initial version to guarantee deterministic execution trails and simple error isolation.

---

## Q5: How does news deduplication work?

During the `validate_bundle` node, articles are indexed by URL. Duplicate URLs are filtered out and a warning is logged to `state.warnings["validate_bundle"]`. This prevents the same article from appearing multiple times in the final `ResearchBundle`.
