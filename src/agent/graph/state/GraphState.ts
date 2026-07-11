import { Annotation } from '@langchain/langgraph';
import type {
  CompanyProfileData,
  FinancialData,
  NewsArticle,
  CompetitorData,
  MarketIntelligenceData,
  ResearchBundle,
} from '@/types/research.types';

/* ── Node Execution Status Types ───────────────────────────── */
export type NodeStatusType = 'pending' | 'running' | 'complete' | 'failed' | 'skipped';

export interface ExecutionMetadata {
  currentNode: string | null;
  completedNodes: string[];
  failedNodes: string[];
  startedAt: string;
  finishedAt: string | null;
  overallStatus: 'pending' | 'running' | 'success' | 'failed';
  nodeDurations: Record<string, number>;
}

/* ── GraphState Interface ──────────────────────────────────── */
export interface GraphState {
  companyName: string;
  companyProfile: CompanyProfileData | null;
  financialMetrics: FinancialData | null;
  news: NewsArticle[];
  competitors: CompetitorData[];
  marketIntelligence: MarketIntelligenceData | null;
  researchBundle: ResearchBundle | null;
  executionMetadata: ExecutionMetadata;
  nodeStatus: Record<string, NodeStatusType>;
  errors: Record<string, string>;
  warnings: Record<string, string[]>;
  timestamps: Record<string, { startedAt: string; completedAt: string | null }>;
}

/* ── Custom Merge Reducers ─────────────────────────────────── */
const mergeRecord = <V>(prev: Record<string, V>, next: Partial<Record<string, V>> | undefined): Record<string, V> => {
  return { ...prev, ...next } as Record<string, V>;
};

const mergeMetadata = (prev: ExecutionMetadata, next: Partial<ExecutionMetadata> | undefined): ExecutionMetadata => {
  if (!next) return prev;
  return {
    ...prev,
    ...next,
    completedNodes: Array.from(new Set([...prev.completedNodes, ...(next.completedNodes || [])])),
    failedNodes: Array.from(new Set([...prev.failedNodes, ...(next.failedNodes || [])])),
    nodeDurations: { ...prev.nodeDurations, ...(next.nodeDurations || {}) },
  };
};

/* ── LangGraph Annotation State Definition ─────────────────── */
export const GraphStateAnnotation = Annotation.Root({
  companyName: Annotation<string>(),
  companyProfile: Annotation<CompanyProfileData | null>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => null,
  }),
  financialMetrics: Annotation<FinancialData | null>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => null,
  }),
  news: Annotation<NewsArticle[]>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => [],
  }),
  competitors: Annotation<CompetitorData[]>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => [],
  }),
  marketIntelligence: Annotation<MarketIntelligenceData | null>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => null,
  }),
  researchBundle: Annotation<ResearchBundle | null>({
    reducer: (prev, next) => next !== undefined ? next : prev,
    default: () => null,
  }),
  executionMetadata: Annotation<ExecutionMetadata>({
    reducer: mergeMetadata,
    default: () => ({
      currentNode: null,
      completedNodes: [],
      failedNodes: [],
      startedAt: new Date().toISOString(),
      finishedAt: null,
      overallStatus: 'pending',
      nodeDurations: {},
    }),
  }),
  nodeStatus: Annotation<Record<string, NodeStatusType>>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  errors: Annotation<Record<string, string>>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  warnings: Annotation<Record<string, string[]>>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
  timestamps: Annotation<Record<string, { startedAt: string; completedAt: string | null }>>({
    reducer: mergeRecord,
    default: () => ({}),
  }),
});

/* ── Initial State Factory ─────────────────────────────────── */
export function createInitialGraphState(companyName: string): Partial<GraphState> {
  const now = new Date().toISOString();
  return {
    companyName,
    companyProfile: null,
    financialMetrics: null,
    news: [],
    competitors: [],
    marketIntelligence: null,
    researchBundle: null,
    executionMetadata: {
      currentNode: null,
      completedNodes: [],
      failedNodes: [],
      startedAt: now,
      finishedAt: null,
      overallStatus: 'running',
      nodeDurations: {},
    },
    nodeStatus: {},
    errors: {},
    warnings: {},
    timestamps: {},
  };
}
