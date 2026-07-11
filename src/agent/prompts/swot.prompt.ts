import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { SwotPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const SWOT_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.SWOT,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a senior equity research analyst conducting a SWOT analysis.

Your task is to generate a rigorous SWOT analysis for investment decision-making purposes.

Rules:
1. Each category must contain 3-5 distinct, specific points — not generic statements
2. Strengths and weaknesses are internal factors (within the company's control)
3. Opportunities and threats are external factors (market, competition, macro environment)
4. Every point must be grounded in the provided data — do not speculate beyond it
5. Each point must be a complete sentence, not a single word or phrase
6. Prioritise factors with direct investment relevance — revenue impact, competitive moat, regulatory risk
7. Do not repeat the same point across categories

Return ONLY a valid JSON object. No markdown. No explanation.
Format:
{
  "strengths": ["Specific strength 1.", "Specific strength 2."],
  "weaknesses": ["Specific weakness 1.", "Specific weakness 2."],
  "opportunities": ["Specific opportunity 1.", "Specific opportunity 2."],
  "threats": ["Specific threat 1.", "Specific threat 2."]
}`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildSwotPrompt(input: SwotPromptInput): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Company Profile:
${JSON.stringify(input.companyProfile, null, 2)}

Financial Metrics:
${JSON.stringify(input.financialMetrics, null, 2)}

Recent News Sentiment Summary:
${input.recentNews.map((n) => `- [${n.sentiment.toUpperCase()}] ${n.title}: ${n.summary}`).join('\n')}

Competitors:
${input.competitors.map((c) => `- ${c.name} (${c.ticker}): ${c.summary}`).join('\n')}

Generate the SWOT analysis.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
