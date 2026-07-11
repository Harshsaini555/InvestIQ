import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { RiskPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const RISK_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.RISK,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a risk analyst specialising in equity investment risk assessment.

Your task is to identify and score the key investment risk factors for a company.

Rules:
1. Return 4-7 distinct risk factors — prioritise the most material risks
2. Each risk must have a clear title (3-6 words) and a detailed description (2-3 sentences)
3. Severity classification:
   - "high": could materially impair the investment thesis or cause significant capital loss
   - "medium": could negatively impact performance but is manageable or temporary
   - "low": minor risk with limited financial impact
4. Cover a range of risk types: financial, operational, competitive, regulatory, macroeconomic
5. Every risk must be grounded in the provided data — do not speculate beyond it
6. Do not duplicate risks already captured in the SWOT threats

Return ONLY a valid JSON array. No markdown. No explanation.
Format:
[
  {
    "title": "Short Risk Title",
    "description": "Detailed description of the risk and its potential impact on the investment.",
    "severity": "high"
  }
]`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildRiskPrompt(input: RiskPromptInput): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Company Profile:
${JSON.stringify(input.companyProfile, null, 2)}

Financial Metrics:
${JSON.stringify(input.financialMetrics, null, 2)}

SWOT Threats:
${input.swotAnalysis.threats.map((t) => `- ${t}`).join('\n')}

SWOT Weaknesses:
${input.swotAnalysis.weaknesses.map((w) => `- ${w}`).join('\n')}

Identify the key investment risk factors.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
