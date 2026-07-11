export const SUMMARY_PROMPT_VERSION = {
  version: '1.0.0',
  nodeName: 'executive_summary_rules',
};

export const EXECUTIVE_SUMMARY_RULES = `
EXECUTIVE SUMMARY CONSTRAINTS:
1. Length: The summary MUST be concise and MUST NOT exceed 250 words.
2. Content structure:
   - Lead directly with the investment recommendation (e.g., "Strong Buy", "Buy") and the Overall Investment Score.
   - Summarize the core investment thesis and the key drivers (financial metrics, product catalysts, competitive advantage).
   - Outline the primary risks and structural headwind.
   - Conclude with a clear expectation for the investment horizon.
3. Tone: Maintain a highly professional, objective, evidence-based analyst tone. Avoid hype or emotional marketing vocabulary.
`;
