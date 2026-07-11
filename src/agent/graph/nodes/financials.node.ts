import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { fetchFinancialData } from '@/services/research/financial.service';

/**
 * Fetches the fundamental financials metrics using the financials service.
 */
export const financialsNode = createGraphNode('financials', async (state: GraphState): Promise<Partial<GraphState>> => {
  const ticker = state.companyName;

  const result = await fetchFinancialData(ticker);

  if (!result.success) {
    throw new Error(`Failed to fetch financials for ${ticker}: ${result.error.message}`);
  }

  return {
    financialMetrics: result.data,
  };
});
