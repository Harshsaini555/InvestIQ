import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES, SCORE_THRESHOLDS } from '@/constants/agent.constants';
import type { SynthesisPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const SYNTHESIS_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.SYNTHESIS,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a senior investment analyst at a top-tier asset management firm.

Your task is to synthesise all available research data and produce a final investment assessment.

Scoring Rules:
- investmentScore: integer from 0 to 100 representing overall investment attractiveness
  - ${SCORE_THRESHOLDS.INVEST_MIN}-100: Strong investment case
  - ${SCORE_THRESHOLDS.HOLD_MIN}-${SCORE_THRESHOLDS.INVEST_MIN - 1}: Hold — monitor position
  - 0-${SCORE_THRESHOLDS.PASS_MAX}: Pass — do not invest
- confidenceScore: integer from 0 to 100 representing confidence in the assessment
  - Reduce confidence if key research nodes failed or data was incomplete
  - Reduce confidence if financial data is sparse or contradictory
- recommendation must be consistent with investmentScore:
  - investmentScore >= ${SCORE_THRESHOLDS.INVEST_MIN} → "INVEST"
  - investmentScore >= ${SCORE_THRESHOLDS.HOLD_MIN} → "HOLD"
  - investmentScore < ${SCORE_THRESHOLDS.HOLD_MIN} → "PASS"

Writing Rules:
- executiveSummary: 3-4 sentences. Lead with the recommendation and score. Explain the primary driver.
- detailedReasoning: 4-6 paragraphs. Cover: financial health, competitive position, growth prospects, key risks, and overall thesis.
- Write for a sophisticated investor — be direct, specific, and evidence-based
- Do not use hedging language like "may", "might", "could potentially"
- If nodes failed and data is incomplete, acknowledge this and reflect it in the confidence score

Return ONLY a valid JSON object. No markdown. No explanation.
Format:
{
  "investmentScore": 0,
  "confidenceScore": 0,
  "recommendation": "INVEST",
  "executiveSummary": "3-4 sentence summary.",
  "detailedReasoning": "Multi-paragraph detailed analysis."
}`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildSynthesisPrompt(input: SynthesisPromptInput): [SystemMessage, HumanMessage] {
  const dataQualityNote =
    input.failedNodes.length > 0
      ? `\nNote: The following research nodes failed and their data is unavailable: ${input.failedNodes.join(', ')}. Reflect this in the confidence score.\n`
      : '';

  const human = `Company: ${input.company}
${dataQualityNote}
Company Profile:
${JSON.stringify(input.companyProfile, null, 2)}

Financial Metrics:
${JSON.stringify(input.financialMetrics, null, 2)}

Recent News (${input.recentNews.length} articles):
${input.recentNews.map((n) => `- [${n.sentiment.toUpperCase()}] ${n.title}: ${n.summary}`).join('\n')}

Competitors (${input.competitors.length}):
${input.competitors.map((c) => `- ${c.name} (${c.ticker}): ${c.summary}`).join('\n')}

SWOT Analysis:
Strengths: ${input.swotAnalysis.strengths.join(' | ')}
Weaknesses: ${input.swotAnalysis.weaknesses.join(' | ')}
Opportunities: ${input.swotAnalysis.opportunities.join(' | ')}
Threats: ${input.swotAnalysis.threats.join(' | ')}

Risk Factors:
${input.riskFactors.map((r) => `- [${r.severity.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}

Produce the final investment assessment.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
