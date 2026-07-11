# Complete Technical Interview Guide

> A comprehensive reference for technical interviews and project presentation defense. Covers architecture, design decisions, and 30+ anticipated questions with detailed answers.

---

## Project Pitch

> "I built an autonomous Equity Research platform that generates institutional-grade investment reports. The core challenge in automated research is data integrity and LLM hallucinations. I solved this by orchestrating a multi-stage sequential collection graph in LangGraph that queries real-time financial APIs, validates schemas via Zod, and aggregates the data into a structured `ResearchBundle`. This bundle is then processed by a Gemini Reasoning Engine that runs Zod validation, dynamic self-correction retry loops, and analytical guardrail checks — like score consistency and completeness penalties — to deliver structured, verified reports. The frontend features a premium glassmorphic dashboard and a streaming AI co-pilot chat."

---

## Architecture Walkthrough

1. **API Middleware** — Receives the ticker, sanitizes inputs, generates a unique Request ID, and initiates the graph.
2. **LangGraph Pipeline** — Runs 8 sequential nodes: validation, company profile, financials, news, competitors, market intelligence, aggregation, and bundle verification.
3. **Synthesis Engine** — Compiles the `ResearchBundle` into a Gemini prompt, parses the output with a custom LangChain JSON parser, runs up to 2 self-correction retries on validation failures, and applies analytical guardrails.
4. **Dashboard** — Displays SVG circular score meters, Recharts area/bar charts, SWOT quadrants, risk matrix, and a streaming AI chat co-pilot drawer.

---

## LangGraph & Pipeline

**Q1: Why LangGraph instead of a standard sequential API controller?**
Standard controllers struggle with error recovery, partial state, and step-by-step progress tracking. LangGraph provides a `StateGraph` model with typed shared state, custom merge reducers, cyclic transition support, and built-in execution tracking. It makes the pipeline explainable and maintainable as complexity grows.

**Q2: How does state management work, and how did you prevent state override?**
State is maintained in a central `Annotation.Root`. Dictionary fields (`nodeStatus`, `errors`, `warnings`, `timestamps`) use custom merge reducers that append or merge keys rather than replacing the entire object on partial node returns.

**Q3: What is the purpose of the node wrapper helper?**
`createGraphNode` wraps every node in a try-catch timing loop, logs execution metadata, captures errors into `state.errors[nodeName]`, and updates node status. Individual node files contain only their data-fetching logic.

**Q4: How does input validation work in the graph?**
The `validate_input` node normalizes the ticker to uppercase, checks for invalid characters using regex, and errors out early if the input is empty or malformed.

**Q5: How did you implement competitor peer research?**
Yahoo Finance does not offer a direct peer endpoint. A custom peer mapper takes the target sector/industry, maps corresponding major tickers, and runs profile and financial queries for each competitor.

**Q6: How does news deduplication work?**
During `validate_bundle`, articles are indexed by URL. Duplicate URLs are filtered out and a warning is logged to `state.warnings`.

**Q7: How does the pipeline handle API failures?**
Nodes are isolated by `createGraphNode`. If an external service fails, the error is caught, logged to `state.errors[nodeName]`, and the pipeline continues. The synthesis engine processes partial bundles gracefully.

**Q8: What recursion limit did you set, and why?**
25. This prevents infinite loops in cyclic flows while giving nodes sufficient room to execute and retry.

---

## AI Engine, Parsing & Guardrails

**Q9: How did you force the LLM to output structured JSON?**
The system prompt requests JSON output and passes raw schema keys. Results are parsed through a custom LangChain `BaseOutputParser` that strips markdown fences and extracts the outermost `{ ... }` block before running Zod validation.

**Q10: Explain the self-correction retry loop.**
If Zod validation fails, the engine catches the error messages and resends a correction prompt to Gemini containing the invalid JSON and the specific Zod errors. Maximum 2 retries (3 total attempts).

**Q11: What is the confidence score calculation?**
The `confidence.ts` guardrail starts at 100 and deducts points for missing data: −20 if competitor data is absent, −10 if news is empty, −15 if financial metrics are missing.

**Q12: How do you verify score consistency?**
`scoring.ts` validates that sub-scores (Business Quality, Financial Health, Moat, Growth, Valuation) do not drift more than ±20 from the Overall Investment Score.

**Q13: How is the recommendation verdict validated?**
`recommendation.ts` enforces threshold bands: `"Strong Buy"` requires overall score ≥ 85, `"Buy"` requires 70–84, `"Hold"` requires 45–69, `"Avoid"` requires 30–44, `"Strong Avoid"` requires < 30.

**Q14: How did you enforce word count limits on the summary?**
`summary.ts` splits the text by whitespace and flags a guardrail violation if the count exceeds 250 words, triggering the correction retry loop.

**Q15: How are risk ratings structured?**
The schema requires ratings (`"Low"` | `"Medium"` | `"High"`) and explanations for 8 distinct risk categories. `risk.ts` verifies all 8 are present.

**Q16: How does the co-pilot chat work under strict instructions?**
`/api/chat` receives the complete `InvestmentAnalysis` as context. The system prompt restricts the model to answer questions only using details present in that report — it cannot invent metrics or reference external data.

---

## Frontend UI & Visualizations

**Q17: Why Recharts for visualizations?**
Recharts renders components directly as SVG nodes inside React, allowing responsive layouts and custom CSS styling without canvas overhead or external DOM trackers.

**Q18: How does the pipeline progress tracker work?**
`progress.tsx` lists the sequential LangGraph nodes and animates each row with Framer Motion micro-delays while the API fetch runs in the background. Once the response arrives, the loader transitions into the dashboard.

**Q19: How does streaming work in the chat panel?**
The client sends a POST to `/api/chat` and reads the `ReadableStream` response using a `TextDecoder`, appending chunks to the message state as they arrive.

**Q20: How do copy, clear, and export work in the chat UI?**
Copy writes text to the clipboard API. Clear calls `clearHistory` on the chat hook. Export compiles the chat array into a downloadable `.txt` file using a Blob URL.

**Q21: How does the markdown parser format tables in chat responses?**
A custom client-side formatter parses table blocks (`| col 1 | col 2 |`) and renders them as HTML `<table>` elements.

**Q22: How is the circular score meter animated?**
An SVG `<circle>` uses `strokeDasharray` set to the circumference and `strokeDashoffset` bound to a Framer Motion value. On viewport entry, the offset animates from full (empty) to the target value (filled).

---

## Systems & Deployment

**Q23: Why Next.js App Router?**
It separates pages, loading skeletons, and API routes cleanly, leverages native layout hydration, and supports SSE streaming for real-time progress delivery without a separate WebSocket server.

**Q24: How did you address case-sensitivity issues?**
Windows is case-insensitive; Vercel/Linux builds are case-sensitive. All imports were explicitly aligned to use exact file system casing (`@/components/layout/Footer`).

**Q25: How did you configure SEO metadata?**
Native Next.js metadata configurations (`robots.ts`, `sitemap.ts`, `manifest.ts`) automate search engine indexing without additional libraries.

**Q26: How did you prepare for rate limiting?**
Rate limit configuration lives in `lib/api/config/limits.ts` with a `RateLimitError` class and `429 Too Many Requests` response mapping, ready for middleware integration.

**Q27: How are system exceptions normalized at the API boundary?**
`withApiMiddleware` catches all uncaught exceptions and maps them to typed JSON error envelopes. Stack traces are never exposed in production responses.

**Q28: Why Vitest instead of Jest?**
Vitest is faster, supports TypeScript and ESM natively, and resolves path aliases through the shared Vite configuration. The API is Jest-compatible, so migration cost is low.

**Q29: How are secrets managed?**
All environment variables are validated at startup via a Zod schema in `src/lib/validators/env.ts`. If any required variable is missing, the application throws immediately with a formatted list of every failing variable. No `process.env` access outside this module.

**Q30: What bundle optimizations were applied?**
Lazy loading and dynamic imports for heavy chart components, memoized callbacks in the chat hook to prevent unnecessary renders, and exclusively vector icons to minimize asset weight.
