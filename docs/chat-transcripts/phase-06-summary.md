# Chat Transcript Summary: Phase 6 - AI Investment Intelligence Engine

## Prompts & Inquiries
- **User Prompt**: Build the AI Investment Intelligence Engine. The engine takes a `ResearchBundle` and outputs a typed `InvestmentAnalysis` using Gemini. Implement structured output validation (Zod), scoring methodologies (Business Quality, Financial Health, Growth, etc.), SWOT validations, risk rating analyses, news evaluations, competitor comparisons, and word-count-limited summaries. Ensure invalid outputs trigger up to 2 correction retries.
- **AI Clarifications**: Proposed creating modular files inside `analysis/` for each guardrail check (scoring, risk, swot, recommendation, summary, confidence). Designed custom output parsing methods and correction messages.

## Engineering Choice Summaries
1. **LangChain Custom Output Parser**: Implemented regex and index boundaries to extract JSON and validated it using Zod.
2. **Post-Parse Guardrail Validation**: Added modular scripts to verify score consistency, risk completeness, SWOT count, recommendation alignment, and summary word counts.
3. **Structured Corrective Retries**: Configured the model wrapper to handle verification failures by appending error details and invoking the model again, allowing up to 2 retries.
