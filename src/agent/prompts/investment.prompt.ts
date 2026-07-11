export const INVESTMENT_PROMPT_VERSION = {
  version: '1.0.0',
  nodeName: 'investment_scoring_rules',
};

export const INVESTMENT_SCORING_RULES = `
SCORING METHODOLOGY GUIDELINES:
1. Business Quality Score (0-100):
   - Assess industry position, growth stability, management effectiveness, and business model strength.
   - High (>75): Leader in industry with robust moat and strong operating leverage.
   - Medium (40-75): Stable player with moderate competition.
   - Low (<40): Struggling business with structural issues.

2. Financial Health Score (0-100):
   - Assess debt-to-equity ratio, profit margin, cash flows, beta, current ratio, and Return on Equity (ROE).
   - High (>75): Minimal debt, high operating margins, strong positive cash flows.
   - Medium (40-75): Manageable leverage, average margins.
   - Low (<40): Over-leveraged, negative cash flows or critical margins.

3. Growth Score (0-100):
   - Assess historical and projected revenue growth, product launches, expansion, and industrial catalysts.

4. Risk Score (0-100):
   - Assess aggregate risks across all segments. High risk value (e.g. >70) means the investment is extremely risky.
   - Note: Map Risk Score to a measure of safety, or maintain it as a pure Risk Level. 0 = No risk, 100 = Catastrophic risk.

5. Competitive Advantage Score (0-100):
   - Assess competitive moats (switching costs, brand power, network effects, cost advantage).

6. Valuation Score (0-100):
   - Assess P/E ratio, PEG ratio, and stock pricing compared to historical metrics.

7. Overall Investment Score (0-100):
   - Represents the weighted attractiveness. Must be consistent with sub-scores.

RECOMMENDATION CRITERIA:
- Strong Buy: Overall Score >= 85, high confidence, solid fundamentals, clear catalysts.
- Buy: Overall Score 70-84, good fundamentals with minor risks.
- Hold: Overall Score 45-69, balanced pros and cons or high valuation.
- Avoid: Overall Score 30-44, deteriorating fundamentals, high risks, or extreme valuation.
- Strong Avoid: Overall Score < 30, high bankruptcy risk, severe structural decline, or major regulatory challenges.
`;
