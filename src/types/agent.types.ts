import { type NODE_STATUS, type NODE_NAMES } from '@/constants/agent.constants';

/* ── Node Identifiers ──────────────────────────────────────── */
export type NodeName = (typeof NODE_NAMES)[keyof typeof NODE_NAMES];

/* ── Node Status ───────────────────────────────────────────── */
export type NodeStatusValue = (typeof NODE_STATUS)[keyof typeof NODE_STATUS];

export type NodeProgress = {
  node: NodeName;
  status: NodeStatusValue;
  startedAt?: string;
  completedAt?: string;
  error?: string;
};

/* ── Recommendation ────────────────────────────────────────── */
export type Recommendation = 'INVEST' | 'HOLD' | 'PASS';

/* ── Research Request ──────────────────────────────────────── */
export type ResearchRequest = {
  company: string;
};

/* ── Chat Message ──────────────────────────────────────────── */
export type MessageRole = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
};

/* ── Chat Request ──────────────────────────────────────────── */
export type ChatRequest = {
  reportId: string;
  message: string;
  history: ChatMessage[];
};
