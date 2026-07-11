import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { BaseMessage } from '@langchain/core/messages';

import type { ChatPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const CHAT_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: 'chat',
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are an AI investment analyst assistant. You have just completed a full investment research report on a company and are now answering follow-up questions from the user.

Your behaviour:
1. Answer questions based strictly on the investment report provided — do not introduce external information
2. If the user asks about something not covered in the report, say so clearly and explain what the report does cover
3. Be direct and specific — reference actual figures, scores, and findings from the report
4. Do not repeat the entire report — answer the specific question asked
5. Do not provide personalised financial advice — you are providing research analysis, not recommendations for individual portfolios
6. If asked to compare with other companies not in the report, decline and explain you can only speak to the researched company

Tone: Professional, concise, and evidence-based.`;

/* ── Human Prompt Builder ──────────────────────────────────── */
/**
 * Builds the full message array for the chat endpoint.
 * Returns a BaseMessage array ready for direct use with model.stream().
 * The report is injected as a system-level context block, not as a user message.
 */
export function buildChatPrompt(input: ChatPromptInput): BaseMessage[] {
  const reportContext = `
INVESTMENT REPORT CONTEXT:
Company: ${input.report.company}
Recommendation: ${input.report.recommendation}
Investment Score: ${input.report.investmentScore}/100
Confidence Score: ${input.report.confidenceScore}/100

Executive Summary:
${input.report.executiveSummary}

Key Financial Metrics:
- Market Cap: ${input.report.financialMetrics.marketCap}
- P/E Ratio: ${input.report.financialMetrics.peRatio ?? 'N/A'}
- Revenue Growth: ${input.report.financialMetrics.revenueGrowth}
- Profit Margin: ${input.report.financialMetrics.profitMargin}
- Current Price: ${input.report.financialMetrics.currentPrice}

Risk Factors:
${input.report.riskFactors.map((r) => `- [${r.severity.toUpperCase()}] ${r.title}`).join('\n')}

Detailed Reasoning:
${input.report.detailedReasoning}
`.trim();

  const systemWithContext = new SystemMessage(`${SYSTEM}\n\n${reportContext}`);

  const historyMessages: BaseMessage[] = input.history.map((turn) =>
    turn.role === 'user'
      ? new HumanMessage(turn.content)
      : new AIMessage(turn.content)
  );

  const currentMessage = new HumanMessage(input.userMessage);

  return [systemWithContext, ...historyMessages, currentMessage];
}
