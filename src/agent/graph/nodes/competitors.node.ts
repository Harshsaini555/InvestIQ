import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { fetchCompetitors } from '@/services/research/competitor.service';

/**
 * Fetches data for competitor stocks using the competitors service.
 */
export const competitorsNode = createGraphNode('competitors', async (state: GraphState): Promise<Partial<GraphState>> => {
  const ticker = state.companyName;

  const result = await fetchCompetitors(ticker);

  if (!result.success) {
    throw new Error(`Failed to fetch competitors for ${ticker}: ${result.error.message}`);
  }

  return {
    competitors: result.data,
  };
});
