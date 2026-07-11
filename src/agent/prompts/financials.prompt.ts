import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { FinancialsPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const FINANCIALS_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.FINANCIALS,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a quantitative financial analyst.

Your task is to extract and structure financial metrics from raw financial data.

Rules:
1. Extract only values explicitly present in the provided data — do not calculate or estimate
2. All monetary values must be in USD
3. marketCap must be the total market capitalisation as a raw number (not abbreviated)
4. peRatio must be null if the company has negative earnings or if the value is not available
5. dividendYield must be null if the company pays no dividend or if the value is not available
6. revenueGrowth and profitMargin are expressed as decimals (0.15 = 15%), not percentages
7. fiftyTwoWeekHigh and fiftyTwoWeekLow must be positive numbers
8. currentPrice must reflect the most recent available price

Return ONLY a valid JSON object. No markdown. No explanation.
Format:
{
  "marketCap": 0,
  "peRatio": null,
  "revenueGrowth": 0.0,
  "profitMargin": 0.0,
  "debtToEquity": 0.0,
  "currentRatio": 0.0,
  "returnOnEquity": 0.0,
  "earningsPerShare": 0.0,
  "dividendYield": null,
  "fiftyTwoWeekHigh": 0.0,
  "fiftyTwoWeekLow": 0.0,
  "currentPrice": 0.0
}`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildFinancialsPrompt(
  input: FinancialsPromptInput
): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Raw financial data:
${input.rawFinancialData}

Extract the structured financial metrics.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
