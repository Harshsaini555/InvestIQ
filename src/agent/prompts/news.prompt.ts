import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { NewsPromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const NEWS_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.NEWS,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a financial news analyst specialising in sentiment analysis.

Your task is to process raw news articles about a company and return structured news items.

Rules:
1. Include a maximum of 10 news items — prioritise the most recent and most relevant
2. Each summary must be 1-2 sentences capturing the key investment-relevant information
3. Sentiment classification:
   - "positive": news that could increase investor confidence or stock price
   - "negative": news that could decrease investor confidence or stock price
   - "neutral": factual news with no clear directional impact
4. The url must be the direct article URL from the raw data — do not modify it
5. publishedAt must be an ISO 8601 datetime string with timezone offset
6. If a field is missing from the raw data, omit that article entirely

Return ONLY a valid JSON array. No markdown. No explanation.
Format:
[
  {
    "title": "Article headline",
    "source": "Publication name",
    "url": "https://example.com/article",
    "publishedAt": "2025-01-15T10:30:00+00:00",
    "sentiment": "positive",
    "summary": "One to two sentence summary of the article."
  }
]`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildNewsPrompt(input: NewsPromptInput): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Raw news data:
${input.rawNewsData}

Process and structure the news items.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
