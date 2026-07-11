import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';

import { REQUEST_TIMEOUT_MS } from '@/constants/api.constants';
import { logger } from '@/utils/logger';
import { type ServiceResult, type ServiceErrorCode } from '@/types/research.types';

/* ── HTTP Client ───────────────────────────────────────────── */
const httpClient = axios.create({ timeout: REQUEST_TIMEOUT_MS });

/* ── Error Classifier ──────────────────────────────────────── */
function classifyError(error: unknown): { code: ServiceErrorCode; message: string } {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === 404) return { code: 'NOT_FOUND',    message: 'Resource not found'         };
    if (status === 429) return { code: 'RATE_LIMITED', message: 'API rate limit exceeded'     };
    if (error.code === 'ECONNABORTED') return { code: 'TIMEOUT', message: 'Request timed out' };
    return { code: 'API_ERROR', message: error.message };
  }
  return { code: 'API_ERROR', message: String(error) };
}

/* ── Timed GET ─────────────────────────────────────────────── */
/**
 * Performs a GET request, logs duration and outcome, and returns a
 * ServiceResult. All services use this — never call axios directly.
 */
export async function timedGet<T>(
  url:     string,
  apiName: string,
  config?: AxiosRequestConfig
): Promise<ServiceResult<T>> {
  const start = Date.now();

  try {
    const response = await httpClient.get<T>(url, config);
    const duration = Date.now() - start;

    logger.info('API request succeeded', { api: apiName, url, duration });
    return { success: true, data: response.data };
  } catch (error) {
    const duration = Date.now() - start;
    const { code, message } = classifyError(error);

    logger.error('API request failed', { api: apiName, url, duration, code, message });
    return { success: false, error: { code, message, api: apiName } };
  }
}
