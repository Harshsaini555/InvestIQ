import { createGraphNode } from '../helpers/node-wrapper';
import { type GraphState } from '../state/GraphState';

/**
 * Performs structural and integrity checks on the finalized ResearchBundle.
 * Validates completeness, filters duplicate news articles, checks competitor tickers, and reports errors.
 */
export const researchValidationNode = createGraphNode('validate_bundle', async (state: GraphState): Promise<Partial<GraphState>> => {
  const bundle = state.researchBundle;

  if (!bundle) {
    throw new Error('Validation failed: Research bundle is missing or null');
  }

  // 1. Check company name / identifier presence
  if (!bundle.company) {
    throw new Error('Validation failed: Bundle company name is missing');
  }

  // 2. Validate completeness of critical sub-objects
  if (!bundle.companyProfile || Object.keys(bundle.companyProfile).length === 0) {
    throw new Error('Validation failed: Company profile is incomplete or empty');
  }
  if (!bundle.financialData || Object.keys(bundle.financialData).length === 0) {
    throw new Error('Validation failed: Financial data is incomplete or empty');
  }
  if (!bundle.marketIntelligence || Object.keys(bundle.marketIntelligence).length === 0) {
    throw new Error('Validation failed: Market intelligence is incomplete or empty');
  }

  // 3. Check for duplicate articles (by URL)
  const urls = new Set<string>();
  const duplicates = bundle.news.filter((item) => {
    if (urls.has(item.url)) {
      return true;
    }
    urls.add(item.url);
    return false;
  });

  if (duplicates.length > 0) {
    // If duplicates are found, log a warning and filter them out
    const cleanNews = bundle.news.filter((item, index, self) => 
      self.findIndex((t) => t.url === item.url) === index
    );

    const warnings = state.warnings.validate_bundle || [];
    warnings.push(`Filtered out ${duplicates.length} duplicate news articles.`);
    
    // Update news lists in the bundle
    bundle.news = cleanNews;
  }

  // 4. Check for invalid competitors (competitor ticker same as target ticker)
  const targetTicker = bundle.company.toUpperCase();
  const invalidCompetitor = bundle.competitors.find((c) => c.ticker.toUpperCase() === targetTicker);

  if (invalidCompetitor) {
    throw new Error(`Validation failed: Competitor contains target ticker symbol "${targetTicker}"`);
  }

  // 5. Ensure competitors contain valid names and tickers
  for (const comp of bundle.competitors) {
    if (!comp.name || !comp.ticker) {
      throw new Error(`Validation failed: Competitor listing is malformed (name: "${comp.name}", ticker: "${comp.ticker}")`);
    }
  }

  return {
    researchBundle: bundle,
  };
});
