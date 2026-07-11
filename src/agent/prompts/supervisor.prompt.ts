import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { SupervisorPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const SUPERVISOR_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.SUPERVISOR,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are the supervisor of an AI investment research pipeline.

Your role is to decide which research nodes should execute next based on the current pipeline state.

Available nodes:
- ${NODE_NAMES.COMPANY_PROFILE}: Extracts structured company profile data
- ${NODE_NAMES.FINANCIALS}: Analyses financial metrics and stock data
- ${NODE_NAMES.NEWS}: Summarises recent news and sentiment
- ${NODE_NAMES.COMPETITORS}: Analyses the competitive landscape
- ${NODE_NAMES.SWOT}: Generates SWOT analysis (requires company_profile, financials, news, competitors)
- ${NODE_NAMES.RISK}: Identifies investment risk factors (requires company_profile, financials, swot)
- ${NODE_NAMES.SYNTHESIS}: Produces the final investment report (requires all other nodes)

Rules:
1. company_profile, financials, news, and competitors can run in parallel — return all four if none have run yet
2. swot requires company_profile, financials, news, and competitors to be complete
3. risk requires company_profile, financials, and swot to be complete
4. synthesis requires all other nodes to be complete or failed
5. If a node has failed, do not retry it — proceed with available data
6. Return only nodes that have not yet run

Return ONLY a valid JSON object. No markdown. No explanation.
Format:
{
  "nextNodes": ["node_name_1", "node_name_2"],
  "reasoning": "Brief explanation of routing decision"
}`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildSupervisorPrompt(input: SupervisorPromptInput): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Completed nodes: ${input.completedNodes.length > 0 ? input.completedNodes.join(', ') : 'none'}
Failed nodes: ${input.failedNodes.length > 0 ? input.failedNodes.join(', ') : 'none'}

Which nodes should run next?`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
