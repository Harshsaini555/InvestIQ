import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { fetchCompanyProfile } from '@/services/research/company.service';

/**
 * Fetches the company profile details using the company service.
 */
export const companyProfileNode = createGraphNode('company_profile', async (state: GraphState): Promise<Partial<GraphState>> => {
  const ticker = state.companyName;

  const result = await fetchCompanyProfile(ticker);

  if (!result.success) {
    throw new Error(`Failed to fetch company profile for ${ticker}: ${result.error.message}`);
  }

  return {
    companyProfile: result.data,
  };
});
