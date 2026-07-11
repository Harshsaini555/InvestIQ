/* ── LangGraph Node Names ──────────────────────────────────── */
export const NODE_NAMES = {
  SUPERVISOR:      'supervisor',
  COMPANY_PROFILE: 'company_profile',
  FINANCIALS:      'financials',
  NEWS:            'news',
  COMPETITORS:     'competitors',
  SWOT:            'swot',
  RISK:            'risk',
  SYNTHESIS:       'synthesis',
} as const;

/* ── Graph Config ──────────────────────────────────────────── */
export const MAX_NODE_RETRIES      = 2;
export const NODE_TIMEOUT_MS       = 30_000;
export const GRAPH_RECURSION_LIMIT = 25;

/* ── LLM Temperature ───────────────────────────────────────── */
export const SUPERVISOR_TEMPERATURE = 0.0;
export const DEFAULT_TEMPERATURE    = 0.2;
export const SWOT_TEMPERATURE       = 0.3;
export const SYNTHESIS_TEMPERATURE  = 0.1;

/* ── LLM Token Limits ──────────────────────────────────────── */
export const MAX_OUTPUT_TOKENS = 8192;

/* ── Investment Score Thresholds ───────────────────────────── */
export const SCORE_THRESHOLDS = {
  INVEST_MIN: 70,
  HOLD_MIN:   40,
  PASS_MAX:   39,
} as const;

/* ── Confidence Score ──────────────────────────────────────── */
export const MIN_CONFIDENCE_SCORE = 0;
export const MAX_CONFIDENCE_SCORE = 100;

/* ── Node Status ───────────────────────────────────────────── */
export const NODE_STATUS = {
  PENDING:  'pending',
  RUNNING:  'running',
  COMPLETE: 'complete',
  FAILED:   'failed',
  SKIPPED:  'skipped',
} as const;
