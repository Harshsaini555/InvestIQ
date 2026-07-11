import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';

/**
 * Validates and normalizes the input ticker symbol.
 */
export const validationNode = createGraphNode('validate_input', async (state: GraphState): Promise<Partial<GraphState>> => {
  const ticker = state.companyName?.trim();

  if (!ticker) {
    throw new Error('Company name or ticker is required');
  }

  // Tickers are usually 1 to 5 characters, alphanumeric, can contain dots or dashes
  const tickerRegex = /^[A-Za-z0-9.-]{1,10}$/;
  if (!tickerRegex.test(ticker)) {
    throw new Error(`Invalid ticker symbol format: "${ticker}"`);
  }

  return {
    companyName: ticker.toUpperCase(),
  };
});
