'use client';

import { useCallback, useRef, useState } from 'react';

import { API_ROUTES } from '@/constants/api.constants';
import { type ChatMessage } from '@/types/agent.types';
import { getErrorMessage } from '@/utils/error';

type ChatStatus = 'idle' | 'streaming' | 'error';

type UseChatReturn = {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  sendMessage: (reportId: string, content: string, reportContext?: any) => void;
  clearHistory: () => void;
};

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearHistory = useCallback(() => {
    abortControllerRef.current?.abort();
    setMessages([]);
    setStatus('idle');
    setError(null);
  }, []);

  const sendMessage = useCallback((reportId: string, content: string, reportContext?: any) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const userMessage = createMessage('user', content);
    const assistantMessage = createMessage('assistant', '');

    setMessages((prev) => {
      const historySnapshot = prev;

      void (async () => {
        try {
          const response = await fetch(API_ROUTES.CHAT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reportId,
              message: content,
              history: historySnapshot,
              reportContext,
            }),
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            throw new Error(`Request failed with status ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            setMessages((prevHistory) => {
              const updated = [...prevHistory];
              const last = updated[updated.length - 1];
              if (last?.role === 'assistant') {
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + chunk,
                };
              }
              return updated;
            });
          }

          setStatus('idle');
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          setError(getErrorMessage(err));
          setStatus('error');
        }
      })();

      return [...prev, userMessage, assistantMessage];
    });

    setStatus('streaming');
    setError(null);
  }, []);

  return { messages, status, error, sendMessage, clearHistory };
}
