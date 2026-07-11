import { SystemMessage, HumanMessage } from '@langchain/core/messages';

import { NODE_NAMES } from '@/constants/agent.constants';
import type { CompanyProfilePromptInput, PromptVersion } from '@/agent/types/agent-internal.types';

/* ── Version ───────────────────────────────────────────────── */
export const COMPANY_PROFILE_PROMPT_VERSION: PromptVersion = {
  version: '1.0.0',
  nodeName: NODE_NAMES.COMPANY_PROFILE,
};

/* ── System Prompt ─────────────────────────────────────────── */
const SYSTEM = `You are a financial data analyst specialising in company research.

Your task is to extract and structure company profile information from raw data.

Rules:
1. Extract only factual information present in the provided data
2. Do not invent, estimate, or assume any values
3. If a field cannot be determined from the data, use an empty string for text fields or 0 for numeric fields
4. The ticker must be the official stock exchange ticker symbol in uppercase
5. The website must be a valid URL including the protocol (https://)
6. employees must be an integer — round to the nearest whole number if given as a range

Return ONLY a valid JSON object. No markdown. No explanation.
Format:
{
  "name": "Full legal company name",
  "ticker": "TICKER",
  "sector": "Sector name",
  "industry": "Industry name",
  "description": "2-3 sentence company description",
  "founded": "Year or date founded",
  "headquarters": "City, Country",
  "employees": 0,
  "website": "https://example.com"
}`;

/* ── Human Prompt Builder ──────────────────────────────────── */
export function buildCompanyProfilePrompt(
  input: CompanyProfilePromptInput
): [SystemMessage, HumanMessage] {
  const human = `Company: ${input.company}

Raw data:
${input.rawData}

Extract the structured company profile.`;

  return [new SystemMessage(SYSTEM), new HumanMessage(human)];
}
