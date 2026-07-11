import { type ERROR_CODES } from '@/constants/api.constants';

/* ── Error Codes ───────────────────────────────────────────── */
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/* ── API Response Envelope ─────────────────────────────────── */
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: string;
  code: ErrorCode;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/* ── Pagination ────────────────────────────────────────────── */
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
};

/* ── SSE Event Types ───────────────────────────────────────── */
export type SseEventType = 'node_start' | 'node_complete' | 'node_error' | 'stream_end' | 'error';

export type SseEvent<T = unknown> = {
  event: SseEventType;
  data: T;
};
