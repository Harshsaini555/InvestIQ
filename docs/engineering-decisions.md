# Engineering Decisions & Trade-offs

This document outlines the design decisions, component choices, and architectural trade-offs made during the development of the InvestIQ Investment platform.

---

## 1. Core Technology Selection

### Why Next.js (App Router)?
- **Unified Stack**: Hosts both our client-side dashboard layouts and serverless API endpoints under a single framework, simplifying local development and deployment.
- **Serverless API Routes**: Next.js API endpoints compile into serverless functions, aligning with scalable hosting providers (Vercel, Railway).
- **Metadata Routing**: App router features like `robots.ts`, `sitemap.ts`, and `manifest.ts` make search engine indexing native and maintainable.

### Why LangGraph?
- **Cyclic & State-Driven Flows**: Traditional DAG agents struggle with recovery loops and validation steps. LangGraph allows cyclical transitions, custom state annotations, and step-by-step progress tracking.
- **Unified State**: Retains context variables (timestamps, logs, errors, data metrics) in a central state annotation.

### Why LangChain?
- **Model Agnostic**: Standardizes prompt message types, streaming buffers, and client configurations, making it simple to swap model providers if needed.
- **Structured Output Parsers**: Provides out-of-the-box templates to parse outputs, extract markdown codes, and catch compiler anomalies.

### Why Google Gemini?
- **Massive Context Window**: Gemini 1.5 Pro easily hosts the aggregated financial metrics, news histories, and competitor profiles in its context window.
- **Low Latency & Cost**: Gemini 1.5 Flash yields fast streaming replies for the co-pilot chat routes.

### Why Yahoo Finance & News API?
- **Data Veracity**: Yahoo Finance is a reliable public source for metrics like trailing PE ratios, target prices, and margins.
- **Real-Time Coverage**: News API provides live macro headlines and sentiment indicators.

### Why Zod?
- **Dual Verification**: Serves as both runtime validation (throwing descriptive errors on format mismatches) and type safety (inferring TS interfaces directly from schema definitions).

### Why Recharts?
- **Declarative React Node Structure**: Avoids complex canvas nodes or external DOM trackers. Rendered directly in React, allowing clean SVG styling and responsive sizing.

---

## 2. Trade-offs & Design Choices

### Client-Side Analysis Synthesis
- **Choice**: The frontend fetches the `ResearchBundle` from the backend `/api/research` endpoint and coordinates the prompt compilation/Gemini analysis client-side, while `/api/chat` streams follow-up questions.
- **Trade-off**: This reduces server load and execution timeouts on serverless functions (which often limit execution times to 10-15 seconds on free tiers). Client-side synthesis provides a more responsive user experience during the 3-5 second LLM processing phase.

### Local Memory Cache
- **Choice**: Instead of a vector database or active database (Postgres/Redis), data is cached in temporary memory and passed directly in API payloads.
- **Trade-off**: Simplifies deployment and reduces cost for assignment reviews, but requires client sessions to remain active. This trade-off is appropriate given the static, single-session nature of equity research reports.
