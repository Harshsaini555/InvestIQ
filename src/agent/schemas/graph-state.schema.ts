import { z } from 'zod';

import { NODE_STATUS } from '@/constants/agent.constants';
import {
  companyProfileSchema,
  financialMetricsSchema,
  newsItemSchema,
  competitorSchema,
  swotAnalysisSchema,
  riskFactorSchema,
  investmentReportSchema,
} from '@/agent/schemas/report.schema';

/* ── Node Status Values ────────────────────────────────────── */
const nodeStatusValues = Object.values(NODE_STATUS) as [string, ...string[]];
const nodeStatusSchema = z.enum(nodeStatusValues);

/* ── Node State ────────────────────────────────────────────── */
// Tracks the execution state of a single node within the graph.
const nodeStateSchema = z.object({
  status:      nodeStatusSchema,
  startedAt:   z.string().datetime({ offset: true }).optional(),
  completedAt: z.string().datetime({ offset: true }).optional(),
  error:       z.string().optional(),
  retryCount:  z.number().int().nonnegative().default(0),
});

/* ── Supervisor Decision ───────────────────────────────────── */
const supervisorDecisionSchema = z.object({
  nextNodes:  z.array(z.string()).min(1),
  reasoning:  z.string(),
});

/* ── Graph State ───────────────────────────────────────────── */
// This is the single source of truth for all data flowing through the graph.
// Every node reads from and writes to this state.
// Fields are nullable so partial state is always valid — the synthesis node
// handles missing data gracefully rather than failing.
export const graphStateSchema = z.object({
  /* ── Identity ── */
  runId:   z.string().uuid(),
  company: z.string().min(1),

  /* ── Supervisor ── */
  supervisorDecision: supervisorDecisionSchema.nullable().default(null),

  /* ── Node Execution States ── */
  nodeStates: z.record(z.string(), nodeStateSchema).default({}),

  /* ── Research Data ── */
  companyProfile:   companyProfileSchema.nullable().default(null),
  financialMetrics: financialMetricsSchema.nullable().default(null),
  recentNews:       z.array(newsItemSchema).default([]),
  competitors:      z.array(competitorSchema).default([]),
  swotAnalysis:     swotAnalysisSchema.nullable().default(null),
  riskFactors:      z.array(riskFactorSchema).default([]),

  /* ── Raw Tool Outputs ── */
  // Stored separately from parsed data so nodes can re-parse if needed.
  rawFinancialData:  z.string().nullable().default(null),
  rawNewsData:       z.string().nullable().default(null),

  /* ── Final Output ── */
  report: investmentReportSchema.nullable().default(null),

  /* ── Graph Metadata ── */
  startedAt:   z.string().datetime({ offset: true }),
  completedAt: z.string().datetime({ offset: true }).nullable().default(null),
  totalErrors: z.number().int().nonnegative().default(0),
});

/* ── Inferred Types ────────────────────────────────────────── */
export type GraphState          = z.infer<typeof graphStateSchema>;
export type NodeState           = z.infer<typeof nodeStateSchema>;
export type SupervisorDecision  = z.infer<typeof supervisorDecisionSchema>;

/* ── Initial State Factory ─────────────────────────────────── */
/**
 * Creates a fresh, validated initial GraphState for a new research run.
 * Every graph execution starts from this factory — never from a partial object.
 */
export function createInitialState(runId: string, company: string): GraphState {
  return graphStateSchema.parse({
    runId,
    company,
    startedAt: new Date().toISOString(),
  });
}
