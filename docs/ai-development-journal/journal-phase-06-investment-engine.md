# Phase 06 — AI Investment Intelligence Engine

**Status:** Complete

---

## Objective

Build the Gemini-powered synthesis engine that takes a `ResearchBundle` and produces a structured, validated `InvestmentAnalysis` report with self-correcting retry loops and analytical guardrail checks.

---

## What Was Built

- `output-parser.ts` — custom LangChain `BaseOutputParser` subclass for markdown stripping and Zod validation
- `investment-engine.ts` — prompt compilation, model invocation, and retry loop orchestration
- Six modular guardrail files: `scoring.ts`, `recommendation.ts`, `swot.ts`, `risk.ts`, `summary.ts`, `confidence.ts`
- Corrective feedback retry loop (max 2 retries) feeding exact Zod errors back to the model

---

## Key Engineering Decisions

**Custom Output Parser**
Subclassing `BaseOutputParser` from LangChain to strip markdown code fences and search for the outermost `{ ... }` braces before parsing JSON makes the parsing logic resilient to conversational noise. Standard JSON parsing on raw model output fails frequently.

**Modular Guardrail Files**
Each analytical check lives in its own file following the Single Responsibility Principle. This makes each check independently unit-testable and means adjusting scoring weights or word limits requires touching only one file.

**Completeness Confidence Penalty**
If the model claims 90% confidence on a company that lacks critical financial metrics or competitor profiles, a completeness checker dynamically penalizes the score. This creates an analytical guardrail against overconfidence on incomplete data.

**Retry Loop Strategy**
Rather than retrying the entire LangChain pipeline, the correction loop appends the validation error to the message history and re-invokes the model. The model sees its previous output and the specific fields that failed — this maintains context and guides targeted correction.

---

## Lessons Learned

- Feeding the exact Zod error messages back to the model as a correction prompt dramatically improves first-retry accuracy compared to a generic "try again" message.
- Decoupling analytical check scripts from the main engine keeps the code clean and makes each guardrail independently testable.
- Gemini is highly effective at structured outputs, but post-parse Zod validation is still necessary for production reliability — the model occasionally produces valid-looking JSON with wrong enum values or missing required fields.
