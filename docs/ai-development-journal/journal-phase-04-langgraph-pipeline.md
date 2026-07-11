# Phase 04 — LangGraph Orchestration Layer

**Status:** Complete

---

## Objective

Implement the backend sequential multi-node data collection pipeline using LangGraph.js. The pipeline runs deterministic, ordered research steps and compiles the final `ResearchBundle` without any LLM reasoning or score generation.

---

## What Was Built

- `GraphState` annotation with custom merge reducers for all dictionary fields
- `createGraphNode` higher-order wrapper centralizing timing, logging, and error boundaries
- Eight sequential nodes: `validate_input`, `company_profile`, `financials`, `news`, `competitors`, `market_intelligence`, `aggregate`, `validate_bundle`
- `graph.ts` compiling and exporting the executable LangGraph workflow

---

## Key Engineering Decisions

**Custom Reducer Pattern**
LangGraph overrides parent fields on partial state returns. Dictionary fields (`nodeStatus`, `errors`, `warnings`, `timestamps`, `executionMetadata`) use custom spread reducers that merge new keys into the existing object rather than replacing it. This prevents subsequent node executions from wiping previously tracked metadata.

**Unified Node Wrapper**
Rather than writing identical try-catch timing structures in all eight nodes, `createGraphNode` abstracts metadata collection, logging, and status transitions. Individual node files contain only their data-fetching logic.

**Linear vs Parallel Execution**
Parallel branching for `company_profile`, `financials`, and `news` was evaluated. The linear path was chosen for the initial release because it simplifies error isolation and produces highly readable log trails. Parallelization is scoped as a future optimization.

---

## Lessons Learned

- `Annotation.Root({ ... })` in LangGraph.js 0.2.x simplifies state configuration and eliminates the need for manual channel mappings.
- Wrapping business logic in pure service modules (`fetchCompanyProfile`, `fetchNews`, etc.) keeps graph nodes thin and independently testable.
- A fail-safe pipeline that logs errors per node and continues execution is more valuable than one that crashes on the first API timeout.
