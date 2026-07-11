'use client';

import { useCallback, useRef, useState } from 'react';

import { API_ROUTES } from '@/constants/api.constants';
import { type InvestmentReport } from '@/types/report.types';
import { type NodeProgress } from '@/types/agent.types';
import { type SseEvent } from '@/types/api.types';
import { getErrorMessage } from '@/utils/error';

type StreamStatus = 'idle' | 'streaming' | 'complete' | 'error';

type UseResearchStreamReturn = {
  status: StreamStatus;
  nodeProgress: NodeProgress[];
  report: InvestmentReport | null;
  error: string | null;
  startResearch: (company: string) => void;
  reset: () => void;
};

export function useResearchStream(): UseResearchStreamReturn {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [nodeProgress, setNodeProgress] = useState<NodeProgress[]>([]);
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setStatus('idle');
    setNodeProgress([]);
    setReport(null);
    setError(null);
  }, []);

  const startResearch = useCallback((company: string) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('streaming');
    setNodeProgress([]);
    setReport(null);
    setError(null);

    void (async () => {
      try {
        const response = await fetch(API_ROUTES.RESEARCH, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ company }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() ?? '';

          for (const chunk of lines) {
            if (!chunk.startsWith('data: ')) continue;
            const raw = chunk.slice(6).trim();
            if (!raw) continue;

            const event = JSON.parse(raw) as SseEvent;

            if (event.event === 'node_start' || event.event === 'node_complete' || event.event === 'node_error') {
              setNodeProgress((prev) => {
                const existing = prev.findIndex(
                  (n) => n.node === (event.data as NodeProgress).node
                );
                if (existing >= 0) {
                  const updated = [...prev];
                  updated[existing] = event.data as NodeProgress;
                  return updated;
                }
                return [...prev, event.data as NodeProgress];
              });
            }

            if (event.event === 'stream_end') {
              setReport(event.data as InvestmentReport);
              setStatus('complete');
            }

            if (event.event === 'error') {
              throw new Error(String(event.data));
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setError(getErrorMessage(err));
        setStatus('error');
      }
    })();
  }, []);

  return { status, nodeProgress, report, error, startResearch, reset };
}
