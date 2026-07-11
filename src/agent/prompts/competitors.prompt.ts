import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { CompetitorsPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const COMPETITORS_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.COMPETITORS,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a competitive intelligence analyst specialising in equity research.

Your task is to identify and analyse the key publicly traded competitors of a company.

Rules:
1. Return 3-5 direct competitors — companies in the same sector and industry
2. Only include publicly traded companies with a known stock ticker
3. All monetary values must be in USD
4. marketCap must be a raw number, not abbreviated
5. peRatio must be null if the company has negative earnings or if unknown
6. revenueGrowth is expressed as a decimal (0.15 = 15%)
7. The summary must be 1-2 sentences explaining why this company is a direct competitor
8. Base your analysis on well-known, verifiable information about these companies
9. Do not invent financial figures — use null for unknown numeric values

Return ONLY a valid JSON array. No markdown. No explanation.
Format:
[
  {
    "name": "Competitor Company Name",
    "ticker": "TICKER",
    "marketCap": 0,
    "peRatio": null,
    "revenueGrowth": 0.0,
    "summary": "Why this company competes directly."
  }
]`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildCompetitorsPrompt(
  input: CompetitorsPromptInput
): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}
Sector: ${input.sector}
Industry: ${input.industry}

Identify and analyse the key publicly traded competitors.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
