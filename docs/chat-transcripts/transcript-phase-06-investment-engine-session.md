# Chat Transcript Summary — Phase 06: AI Investment Intelligence Engine

---

## Session Goal

Build the AI Investment Intelligence Engine. The engine takes a `ResearchBundle` and outputs a typed `InvestmentAnalysis` using Gemini. Implement structured output validation (Zod), scoring methodology, SWOT validation, risk rating analysis, and up to 2 correction retries on schema failures.

---

## Key Decisions

**LangChain Custom Output Parser**
Implemented regex and index boundaries to extract JSON from raw model output and validated it using Zod. This handles markdown fences and conversational noise that standard `JSON.parse` cannot.

**Post-Parse Guardrail Validation**
Six modular scripts verify score consistency, risk completeness, SWOT count, recommendation alignment, summary word counts, and confidence penalties — each in its own file for independent testability.

**Structured Corrective Retries**
On validation failure, the model wrapper appends the exact error details to the message history and re-invokes the model. Maximum 2 retries (3 total attempts).

---

## AI Clarifications

- Proposed creating modular files inside `analysis/` for each guardrail check rather than a single monolithic validator.
- Designed the correction message format to include both the invalid JSON and the specific Zod error messages, giving the model maximum context for self-correction.
