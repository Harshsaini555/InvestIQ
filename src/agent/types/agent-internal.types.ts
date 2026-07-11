import type { GraphState } from '@/agent/schemas/graph-state.schema';
import type {
  CompanyProfile,
  FinancialMetrics,
  NewsItem,
  Competitor,
  SwotAnalysis,
  RiskFactor,
  InvestmentReport,
  Recommendation,
} from '@/agent/schemas/report.schema';

/* ── Node Function Contract ────────────────────────────────── */
/**
 * Every LangGraph node must conform to this signature.
 * Nodes receive the full GraphState, return a partial update.
 * Partial updates are merged into GraphState by the graph runner.
 */
export type NodeFunction = (state: GraphState) => Promise<Partial<GraphState>>;

/* ── Prompt Input Types ────────────────────────────────────── */
// Each prompt file accepts a typed input. These types define exactly
// what data each prompt needs — no more, no less.

export type SupervisorPromptInput = {
  company: string;
  completedNodes: string[];
  failedNodes: string[];
};

export type CompanyProfilePromptInput = {
  company: string;
  rawData: string;
};

export type FinancialsPromptInput = {
  company: string;
  rawFinancialData: string;
};

export type NewsPromptInput = {
  company: string;
  rawNewsData: string;
};

export type CompetitorsPromptInput = {
  company: string;
  sector: string;
  industry: string;
};

export type SwotPromptInput = {
  company: string;
  companyProfile: CompanyProfile;
  financialMetrics: FinancialMetrics;
  recentNews: NewsItem[];
  competitors: Competitor[];
};

export type RiskPromptInput = {
  company: string;
  companyProfile: CompanyProfile;
  financialMetrics: FinancialMetrics;
  swotAnalysis: SwotAnalysis;
};

export type SynthesisPromptInput = {
  company: string;
  companyProfile: CompanyProfile;
  financialMetrics: FinancialMetrics;
  recentNews: NewsItem[];
  competitors: Competitor[];
  swotAnalysis: SwotAnalysis;
  riskFactors: RiskFactor[];
  failedNodes: string[];
};

export type ChatPromptInput = {
  report: InvestmentReport;
  history: ChatTurn[];
  userMessage: string;
};

/* ── Chat Turn ─────────────────────────────────────────────── */
export type ChatTurn = {
  role: 'user' | 'assistant';
  content: string;
};

/* ── LLM Output Shapes ─────────────────────────────────────── */
// Raw shapes expected from the LLM before Zod validation.
// These are the exact JSON objects each node's prompt instructs the model to return.

export type SupervisorLLMOutput = {
  nextNodes: string[];
  reasoning: string;
};

export type SynthesisLLMOutput = {
  investmentScore: number;
  confidenceScore: number;
  recommendation: Recommendation;
  executiveSummary: string;
  detailedReasoning: string;
};

/* ── Prompt Version ────────────────────────────────────────── */
export type PromptVersion = {
  version: string;
  nodeName: string;
};

/* ── LLM Invocation Metadata ───────────────────────────────── */
// Attached to every LLM call for logging and LangSmith tracing.
export type LLMInvocationMeta = {
  nodeName: string;
  promptVersion: string;
  runId: string;
  retryAttempt: number;
};
