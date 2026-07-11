# Interview Notes — Phase 06: AI Investment Intelligence Engine

---

## Q1: Why LangChain.js instead of calling the raw Google Gen AI API directly?

LangChain provides a unified interface for prompt templates, message types, output parsers, and streaming buffers. It abstracts model-specific differences, so swapping Gemini for another provider (e.g. GPT-4o) requires changing only the model configuration — not the prompt or parsing logic. It also integrates with LangSmith for tracing and monitoring.

---

## Q2: How does the structured output parser prevent malformed JSON?

The parser operates in three stages:

1. **Extraction** — Regex finds the outermost `{ ... }` block and strips markdown fences (` ```json `).
2. **Parsing** — `JSON.parse` converts the extracted string to a JavaScript object.
3. **Validation** — The object is validated against the `investmentReportSchema` Zod schema, checking data types, enum bounds, and array minimums.

If any stage fails, the parser throws a detailed error that triggers the retry loop.

---

## Q3: Why 2 retries, and how does the model know what to correct?

The retry loop catches Zod validation failures and guardrail violations. On failure, it appends a correction message to the prompt history containing the specific error details and re-invokes the model. The model sees its previous output and the exact fields that failed — this guides targeted correction rather than a blind retry. 2 retries (3 total attempts) balances latency against success rate; most models correct on the first retry.

---

## Q4: How do you prevent hallucinations in the investment report?

Four layers:

1. **Prompt constraints** — The system prompt explicitly instructs the model to base all analysis strictly on the provided `ResearchBundle`.
2. **Fact integrity rules** — The prompt forbids fabricating numbers, news titles, or competitor profiles.
3. **Insufficient data fallback** — If a metric is missing, the model writes `"Insufficient Data"` rather than estimating.
4. **Confidence penalty** — If the model claims high confidence but the bundle is incomplete, the `confidence.ts` guardrail dynamically penalizes the score server-side.

---

## Q5: Why are guardrail validators in separate files instead of inside the prompt or parser?

Single Responsibility Principle. Each check in its own file is independently unit-testable and independently maintainable. Adjusting scoring weights or word limits requires touching one file. It also separates the generative parsing stage from the business rule validation stage — two distinct concerns that should not be coupled.
