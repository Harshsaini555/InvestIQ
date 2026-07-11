# Prompt Engineering & AI Guardrails

This document describes the prompt designs, structured outputs, validation checks, and retry mechanics implemented in the synthesis engine.

---

## 1. Prompt Design & XML Variables
We use structured XML blocks in our prompts to separate instruction parameters, rules, and source data:

- **`<context>`**: Details on role (senior research analyst), target corporation, and date coordinates.
- **`<data_bundle>`**: Injects the complete compiled `ResearchBundle` (profile stats, income quotes, news feeds, peer metrics).
- **`<instruction>`**: Explicit guidelines detailing scoring scales, SWOT requirements, and formatting.
- **`<format_rules>`**: Instructs the model to output **ONLY** valid JSON matching our expected schema keys.

### Example System Instructions
```
You are a Principal Equity Research Analyst.
Analyze the company metrics in the <data_bundle> below.
Return a structured JSON report matching the schema keys.
Never speculate or invent statistics.
```

---

## 2. Structured Output Strategy (Zod validation)
We define the exact structure of the expected output using Zod in `src/agent/schemas/investment.schema.ts`:
- **Scoring Keys**: Value bounds `0 - 100` and text descriptions explaining the rating.
- **SWOT Elements**: String arrays with a minimum size of 3 items for Strengths, Weaknesses, Opportunities, and Threats.
- **Risk Items**: Rating scales (`Low`, `Medium`, `High`) and explanation strings.
- **News/Competitors**: Arrays containing mapped items.

---

## 3. Corrective Feedback Retry Loops
If the raw model output fails the Zod validation schema, the system executes an automated retry loop (up to 2 times):

```
Model Output
     │
     ▼
[Zod Schema Validator]
     │
     ├─► Success: Generate Report
     │
     └─► Mismatch: Catch Zod Error Messages
           │
           ▼
     [Corrective Prompt]
     "The previous output failed validation with: <ZOD_ERROR>.
      Please re-generate the JSON fixing these specific fields."
           │
           ▼
     [Re-invoke Gemini]
```

---

## 4. Analytical Guardrail Checks
After schema validation, we execute structural guardrails to verify analytical consistency:

1. **Score Alignment**: Validates that sub-scores (Quality, Health, Growth, Moat, Valuation) do not drift wildly from the overall score.
2. **Recommendation Consistency**: Blocks contradictions (e.g. recommendation is "Strong Buy" but Overall Score is under 70).
3. **Word Limits**: Trims the executive summary to under 250 words.
4. **Completeness Penalty**: Deducts confidence score points if data segments (like competitor statistics) are missing from the bundle.
5. **SWOT Length**: Asserts that SWOT items have at least 3 distinct elements per quadrant.
6. **Risk Completeness**: Verifies that all 8 standard risk categories are rated and explained.
