# Prompt Engineering & AI Guardrails

> This document describes how Gemini is prompted, how its outputs are parsed, and how the guardrail layer prevents analytical errors from reaching the dashboard.

---

## Prompt Structure

Prompts use structured XML blocks to separate instruction parameters, rules, and source data. This prevents the model from confusing data with instructions.

| XML Block | Contents |
|---|---|
| `<context>` | Role definition (Principal Equity Research Analyst), target company, analysis date |
| `<data_bundle>` | The complete compiled `ResearchBundle` — profile stats, financial metrics, news, competitor data |
| `<instruction>` | Scoring scales, SWOT requirements, risk category definitions, formatting rules |
| `<format_rules>` | Explicit instruction to output **only** valid JSON matching the schema keys — no markdown, no prose |

**Core system instruction:**
```
You are a Principal Equity Research Analyst.
Analyze the company metrics in the <data_bundle> below.
Return a structured JSON report matching the schema keys exactly.
Never speculate or invent statistics not present in the data bundle.
If a metric is missing, write "Insufficient Data" — do not estimate.
```

---

## Structured Output Strategy

The expected output shape is defined in `src/agent/schemas/report.schema.ts` using Zod. Key constraints enforced at the schema level:

| Field | Constraint |
|---|---|
| All scores | Integer, `0–100` inclusive |
| SWOT arrays | Minimum 3 items per quadrant |
| Risk ratings | Enum: `"Low"` \| `"Medium"` \| `"High"` |
| Risk categories | All 8 standard categories must be present |
| Executive summary | String (word limit enforced post-parse by guardrail) |
| Recommendation | Enum: `"Strong Buy"` \| `"Buy"` \| `"Hold"` \| `"Avoid"` \| `"Strong Avoid"` |

---

## Corrective Feedback Retry Loop

If the raw model output fails Zod validation, the engine executes an automated retry loop (maximum 2 retries, 3 total attempts):

```
Model Output
      │
      ▼
[Zod Schema Validator]
      │
      ├── Pass ──► Proceed to Guardrail Checks
      │
      └── Fail ──► Catch Zod Error Messages
                        │
                        ▼
              [Correction Prompt]
              "Your previous output failed validation:
               <ZOD_ERROR_DETAILS>
               Re-generate the JSON fixing only these fields."
                        │
                        ▼
              [Re-invoke Gemini with full message history]
```

Passing the actual bad output and the exact Zod error messages back to the model significantly improves correction accuracy on the first retry.

---

## Analytical Guardrail Checks

After schema validation passes, a second layer of business-rule checks runs against the parsed JSON. Each check lives in its own file under `src/agent/analysis/`.

| Guardrail | File | Rule |
|---|---|---|
| Score alignment | `scoring.ts` | Sub-scores must not drift wildly from the overall score |
| Recommendation consistency | `recommendation.ts` | `"Strong Buy"` requires overall score ≥ 85; `"Avoid"` requires ≤ 44 |
| Summary word limit | `summary.ts` | Executive summary must be ≤ 250 words |
| SWOT completeness | `swot.ts` | Each quadrant must have ≥ 3 distinct items |
| Risk completeness | `risk.ts` | All 8 risk categories must be rated and explained |
| Confidence penalty | `confidence.ts` | Deducts points if competitor data, news, or financials are missing from the bundle |

Any guardrail failure feeds back into the same retry loop as a Zod failure, with the specific rule violation appended to the correction message.
