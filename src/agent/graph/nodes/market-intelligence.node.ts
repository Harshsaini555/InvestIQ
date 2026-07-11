import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { fetchMarketIntelligence } from '@/services/research/market-intelligence.service';

/**
 * Fetches market intelligence details combining macroeconomic indicators and sector trends.
 */
export const marketIntelligenceNode = createGraphNode('market_intelligence', async (state: GraphState): Promise<Partial<GraphState>> => {
  const ticker = state.companyName;
  const profile = state.companyProfile;

  const result = await fetchMarketIntelligence(ticker, profile);

  if (!result.success) {
    throw new Error(`Failed to fetch market intelligence for ${ticker}: ${result.error.message}`);
  }

  return {
    marketIntelligence: result.data,
  };
});
