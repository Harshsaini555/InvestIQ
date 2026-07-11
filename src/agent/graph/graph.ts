import { StateGraph, START, END } from '@langchain/langgraph';
import { GraphStateAnnotation } from './state/GraphState';
import {
  validationNode,
  companyProfileNode,
  financialsNode,
  newsNode,
  competitorsNode,
  marketIntelligenceNode,
  aggregationNode,
  researchValidationNode,
} from './nodes';

// Construct the LangGraph workflow builder using our custom state schema annotations
const builder = new StateGraph(GraphStateAnnotation)
  // Register research pipeline nodes
  .addNode('validate_input', validationNode)
  .addNode('company_profile', companyProfileNode)
  .addNode('financials', financialsNode)
  .addNode('fetch_news', newsNode)
  .addNode('fetch_competitors', competitorsNode)
  .addNode('market_intelligence', marketIntelligenceNode)
  .addNode('aggregate', aggregationNode)
  .addNode('validate_bundle', researchValidationNode)

  // Map transition edges sequentially
  .addEdge(START, 'validate_input')
  .addEdge('validate_input', 'company_profile')
  .addEdge('company_profile', 'financials')
  .addEdge('financials', 'fetch_news')
  .addEdge('fetch_news', 'fetch_competitors')
  .addEdge('fetch_competitors', 'market_intelligence')
  .addEdge('market_intelligence', 'aggregate')
  .addEdge('aggregate', 'validate_bundle')
  .addEdge('validate_bundle', END);

// Compile the LangGraph research manager
export const graph = builder.compile();
