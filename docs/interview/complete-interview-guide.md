# Complete Technical Interview Guide

This guide prepares you for technical interviews, covering architecture, design patterns, and 30+ likely questions about the AI Investment Research Agent.

---

## 1. Project Explanation & Pitch

**The Pitch:**
> "I built an autonomous Equity Research platform that generates institutional-grade investment reports. The core challenge in automated research is data integrity and LLM hallucinations. I solved this by orchestrating a multi-stage sequential collection graph in LangGraph that queries real-time financial APIs, validates schemas via Zod, and aggregates the data into a structured ResearchBundle. This bundle is then parsed by a Gemini Reasoning Engine that runs Zod validation checks, dynamic retry self-correction loops, and analytical guardrail checks (like score consistency and completeness penalties) to deliver structured, verified reports. The frontend features a premium glassmorphic dashboard and a streaming AI co-pilot chat."

---

## 2. Architecture & Data Flow Walkthrough

1. **API Middleware Boundary**: Receives request ticker, sanitizes inputs, generates a unique Request ID, and initiates the Graph.
2. **LangGraph Pipeline**: Runs validation, summary fetch, financials, news, competitor peer comparisons, macro market indicators, and aggregation nodes.
3. **Synthesis Engine**: Prompt compiler passes the data bundle to Gemini 1.5 Pro, parses outputs using a custom LangChain JSON parser, executes up to 2 self-correction retries if validation errors occur, and runs scoring guardrails.
4. **Dashboard View**: Displays SVG circular meters, responsive Recharts area/bar graphs, SWOT quadrants, risk indices, and mounts a streaming AI chat drawer co-pilot.

---

## 3. 30+ Technical Interview Questions & Answers

### LangGraph & Pipeline Orchestration
#### Q1: Why did you use LangGraph instead of a standard sequential API controller?
- **Answer**: Standard controllers struggle with error recovery and complex state tracking. LangGraph allows state-driven cyclic loops, unified state annotations, step-by-step logging, and retry states.

#### Q2: How does state management work in LangGraph, and how did you prevent state override?
- **Answer**: State is maintained in a central `Annotation.Root`. To prevent overwriting state variables (like lists of errors, warnings, or timestamps) during parallel node updates, we defined custom merge reducers that append values or merge keys.

#### Q3: What is the purpose of the node wrapper helper?
- **Answer**: The node wrapper (`node-wrapper.ts`) encapsulates each graph node execution in a try-catch timing loop, logs execution metadata, captures errors, and updates the node status in state.

#### Q4: How does input validation work in the graph?
- **Answer**: The validation node normalizes ticker symbols to uppercase, checks for invalid characters using regex, and errors out early if inputs are empty or malformed.

#### Q5: How did you implement competitor peer research?
- **Answer**: Since Yahoo Finance doesn't offer a direct peer stock endpoint, we implemented a custom peer service lookup mapper that takes the target sector/industry, maps corresponding major tickers, and runs queries to retrieve profiles and financial details for each competitor.

#### Q6: How does news deduplication work?
- **Answer**: During news aggregation, articles are indexed by URL. Duplicate URLs are filtered out, and warnings are logged.

#### Q7: How does the pipeline handle API failures?
- **Answer**: Nodes are isolated by our wrapper. If an external service fails, the error is caught, added to the graph's `errors` map in state, and a warning is logged, allowing the rest of the collection to succeed.

#### Q8: What recursion limit did you set for the graph, and why?
- **Answer**: We set a recursion limit of 25. This prevents infinite loops in cyclic flows while giving nodes plenty of room to execute and retry.

---

### AI Engine, Parsing & Guardrails
#### Q9: How did you force the LLM to output structured JSON?
- **Answer**: We configured the prompt system to request JSON output, passed raw schema keys, and parsed results through a custom LangChain `BaseOutputParser` (`output-parser.ts`) that strips markdown fences.

#### Q10: Explain the self-correction retry loop.
- **Answer**: If Zod schema validation fails, the engine catches the validation error messages and resends a corrective prompt to Gemini containing the invalid JSON and the compiler errors. It allows up to 2 retry attempts.

#### Q11: What is the confidence score calculation?
- **Answer**: The confidence calculator evaluates data completeness. It starts at 100% and deducts points for missing data (e.g. -20 if competitor matrices are absent, -10 if news timeline is empty).

#### Q12: How do you verify score consistency?
- **Answer**: A custom guardrail validates that sub-scores (Business Quality, Financial Health, Moat, Growth, Valuation) average out close to the Overall Investment Score.

#### Q13: How is the recommendation verdict validated?
- **Answer**: We enforce consistency limits: a "Strong Buy" recommendation requires an Overall Score >= 80, while an "Avoid" recommendation requires a score <= 40.

#### Q14: How did you enforce word count limits on the summary?
- **Answer**: A summary check parses the text, splits it by whitespace, and flags a warning or triggers self-correction if the count exceeds 250 words.

#### Q15: How are risk ratings structured?
- **Answer**: The schema requires the model to return ratings (`Low`, `Medium`, `High`) and explanations for 8 distinct risk categories.

#### Q16: How does the co-pilot chat endpoint work under strict instructions?
- **Answer**: The chat route `/api/chat` receives the complete analysis report context. System prompts restrict the model to answer questions *only* using details present in that report context.

---

### Frontend UI & Data Visualizations
#### Q17: Why did you choose Recharts for visualizations?
- **Answer**: Recharts renders components directly as SVG nodes, allowing responsive layouts and custom CSS class styling without canvas overhead.

#### Q18: How did you configure progress tracking on the client?
- **Answer**: We created a stage checker component that displays checkmarks, loading spins, and streams terminal logs by tracking active flags in state.

#### Q19: How did you implement streaming in the chat panel?
- **Answer**: We used a client-side text decoder reading chunks from a `ReadableStream` returned by the `/api/chat` endpoint, updating messages dynamically.

#### Q20: Explain how copy, clear, and export actions work in the chat UI.
- **Answer**: Copy writes text to the clipboard. Clear triggers `clearHistory` on the hook. Export compiles the chat array into a downloadable text file.

#### Q21: How does the markdown parser format tables in the chat response?
- **Answer**: The chat panel includes a custom client-side markdown formatter that parses table blocks (e.g., `| col 1 | col 2 |`) and renders them using HTML table tags.

#### Q22: How is the circular rating score animated?
- **Answer**: We used an SVG circle with `strokeDasharray` and `strokeDashoffset` bound to Framer Motion values, animating the circle border based on the score.

---

### Systems & Deployment
#### Q23: Why did you place Next.js routes under the App Router?
- **Answer**: Next.js App Router separates pages, loading skeletons, and API routers cleanly, leveraging native layout hydration.

#### Q24: How did you address case-sensitivity issues during deployment?
- **Answer**: Windows is case-insensitive, while Vercel/Linux builds are case-sensitive. We resolved casing issues by ensuring all imports use exact file system capital cases.

#### Q25: How did you configure SEO metadata routes?
- **Answer**: We implemented native Next.js metadata configurations (`robots.ts`, `sitemap.ts`, `manifest.ts`), automating search engine indexing.

#### Q26: How did you prepare the application for rate limiting?
- **Answer**: We created configuration limits in `lib/api/config/limits.ts` and standard errors (`TOO_MANY_REQUESTS`), preparing the API layer for middleware rate-limiters.

#### Q27: How are system exceptions normalized at the API boundary?
- **Answer**: A global error normalizer catches timeouts, schema issues, and graph failures, converting them into typed, structured JSON error envelopes.

#### Q28: Why did you select Vite/Vitest for unit testing?
- **Answer**: Vitest is faster than Jest, supports TypeScript natively, and integrates with Vite configurations to resolve path aliases.

#### Q29: How did you manage secrets securely?
- **Answer**: Environment variables are validated on start, ensuring API keys are present without leaking them in frontend builds.

#### Q30: What bundle optimizations did you apply?
- **Answer**: We used lazy loading, dynamic imports for heavy charts, and memoized callbacks in our chat hook to prevent unnecessary renders.
