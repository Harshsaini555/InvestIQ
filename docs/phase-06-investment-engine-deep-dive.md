# Phase 06 — AI Investment Intelligence Engine

> The engine takes a structured `ResearchBundle` and produces a validated `InvestmentAnalysis`. It handles prompt compilation, JSON parsing, self-correction retries, and six modular analytical guardrail checks.

---

## Architecture

```
src/agent/analysis/
├── investment-engine.ts    # Prompt compilation, model invocation, retry loop
├── output-parser.ts        # Markdown stripping, JSON extraction, Zod validation
├── scoring.ts              # Score boundary and consistency checks
├── recommendation.ts       # Score-to-recommendation alignment
├── swot.ts                 # SWOT minimum item count (≥ 3 per quadrant)
├── risk.ts                 # Risk category completeness (all 8 required)
├── summary.ts              # Executive summary word count (≤ 250 words)
└── confidence.ts           # Data completeness confidence penalty
```

---

## Scoring Methodology

| Score | What It Measures | Range |
|---|---|---|
| Business Quality | Market position, moat strength, operating efficiency | 0–100 |
| Financial Health | Margins, debt-to-equity, liquidity, ROE | 0–100 |
| Growth | Revenue trends, sector expansion, product pipeline | 0–100 |
| Risk | Inverse safety indicator — higher = more risk | 0–100 |
| Competitive Advantage | Switching costs, network effects, cost advantages | 0–100 |
| Valuation | P/E, PEG, relative pricing models | 0–100 |
| Overall Investment Score | Weighted composite — must align with recommendation | 0–100 |

---

## Recommendation Thresholds

| Recommendation | Overall Score |
|---|---|
| Strong Buy | ≥ 85 |
| Buy | 70–84 |
| Hold | 45–69 |
| Avoid | 30–44 |
| Strong Avoid | < 30 |

---

## Guardrail Checks

| File | Rule |
|---|---|
| `scoring.ts` | Sub-scores must not drift > ±20 from overall score |
| `recommendation.ts` | Recommendation enum must match the score threshold band |
| `summary.ts` | Executive summary must be ≤ 250 words |
| `swot.ts` | Each SWOT quadrant must have ≥ 3 items |
| `risk.ts` | All 8 risk categories must be rated and explained |
| `confidence.ts` | Deducts −20 (no competitors), −15 (no financials), −10 (no news) |

---

## Retry Loop

```
Model Output
      │
      ▼
[output-parser.ts]
  Strip markdown → JSON.parse → Zod validate
      │
      ├── Pass → Guardrail Checks
      │               │
      │               ├── Pass → Apply Confidence Penalty → Return InvestmentAnalysis
      │               │
      │               └── Fail ──┐
      │                          │
      └── Fail ──────────────────┤
                                 ▼
                    retries < 2?
                         │
                    Yes  │  No
                         │   └── Throw ValidationError (500)
                         ▼
              Build Correction Message
              (invalid JSON + exact error details)
                         │
                         ▼
              Re-invoke Gemini with full message history
```

Maximum **2 retries** (3 total attempts). Most models self-correct on the first retry when given the exact Zod error messages.
