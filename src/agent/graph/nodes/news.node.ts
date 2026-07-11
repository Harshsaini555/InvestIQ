import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';
import { fetchNews } from '@/services/research/news.service';

/**
 * Fetches recent news articles for the company using the news service.
 */
export const newsNode = createGraphNode('news', async (state: GraphState): Promise<Partial<GraphState>> => {
  // Use the full company name if available, otherwise fallback to the ticker symbol
  const query = state.companyProfile?.name || state.companyName;

  const result = await fetchNews(query);

  if (!result.success) {
    throw new Error(`Failed to fetch news for ${query}: ${result.error.message}`);
  }

  return {
    news: result.data,
  };
});
