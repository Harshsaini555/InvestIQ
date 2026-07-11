import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { type ResearchBundle } from '@/types/research.types';

/**
 * Combines all individual research fields into a single validated ResearchBundle object.
 */
export const aggregationNode = createGraphNode('aggregate', async (state: GraphState): Promise<Partial<GraphState>> => {
  if (!state.companyProfile) {
    throw new Error('Aggregation failed: companyProfile is missing');
  }
  if (!state.financialMetrics) {
    throw new Error('Aggregation failed: financialMetrics is missing');
  }
  if (!state.marketIntelligence) {
    throw new Error('Aggregation failed: marketIntelligence is missing');
  }

  const bundle: ResearchBundle = {
    company: state.companyName,
    collectedAt: new Date().toISOString(),
    companyProfile: state.companyProfile,
    financialData: state.financialMetrics,
    news: state.news,
    competitors: state.competitors,
    marketIntelligence: state.marketIntelligence,
  };

  return {
    researchBundle: bundle,
  };
});
