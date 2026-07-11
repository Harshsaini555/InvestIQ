import type { z } from 'zod';
import { HumanMessage } from '@langchain/core/messages';
import type { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import type { BaseMessage } from '@langchain/core/messages';

import { MAX_NODE_RETRIES } from '@/constants/agent.constants';
import { parseOrThrow } from '@/lib/validators/zod-helpers';
import { logger } from '@/utils/logger';
import { ValidationError } from '@/utils/error';
import type { LLMInvocationMeta } from '@/agent/types/agent-internal.types';

/* ── JSON Extraction ───────────────────────────────────────── */
/**
 * Strips markdown code fences and extracts raw JSON from LLM output.
 * Handles ```json ... ```, ``` ... ```, and plain JSON responses.
 */
function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch?.[1]) return fenceMatch[1].trim();

  const firstBrace   = raw.indexOf('{');
  const firstBracket = raw.indexOf('[');
  const start =
    firstBrace === -1   ? firstBracket
    : firstBracket === -1 ? firstBrace
    : Math.min(firstBrace, firstBracket);

  if (start === -1) return raw.trim();

  const isObject = raw[start] === '{';
  const end = isObject ? raw.lastIndexOf('}') : raw.lastIndexOf(']');

  if (end === -1) return raw.trim();
  return raw.slice(start, end + 1).trim();
}

/* ── Correction Prompt ─────────────────────────────────────── */
// rawOutput is the model's actual bad response — included so the model
// can see exactly what it produced and why it was rejected.
function buildCorrectionMessage(rawOutput: string, errorMessage: string): HumanMessage {
  return new HumanMessage(
    `Your previous response was invalid.\n\nError: ${errorMessage}\n\nYour response was:\n${rawOutput}\n\nReturn ONLY a valid JSON object or array. No markdown. No explanation.`
  );
}

/* ── Core Parser ───────────────────────────────────────────── */
/**
 * Invokes the model with the given messages, extracts JSON from the response,
 * validates it against the provided Zod schema, and retries with a correction
 * prompt on validation failure.
 *
 * This is the single function all research nodes use to call the LLM.
 * It encapsulates: invocation → extraction → validation → retry logic.
 */
export async function invokeLLMWithSchema<T>(
  model: ChatGoogleGenerativeAI,
  messages: BaseMessage[],
  schema: z.ZodSchema<T>,
  meta: LLMInvocationMeta
): Promise<T> {
  let currentMessages = [...messages];
  let lastError       = '';
  let lastRawContent  = '';

  for (let attempt = 0; attempt <= MAX_NODE_RETRIES; attempt++) {
    if (attempt > 0) {
      logger.warn('LLM output validation failed, retrying with correction prompt', {
        nodeName:      meta.nodeName,
        promptVersion: meta.promptVersion,
        runId:         meta.runId,
        attempt,
        error:         lastError,
      });
      // Pass the actual bad output so the model knows what to fix
      currentMessages = [
        ...currentMessages,
        buildCorrectionMessage(lastRawContent, lastError),
      ];
    }

    const response = await model.invoke(currentMessages, {
      metadata: {
        nodeName:      meta.nodeName,
        promptVersion: meta.promptVersion,
        runId:         meta.runId,
        attempt,
      },
    });

    lastRawContent =
      typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

    logger.debug('LLM raw response received', {
      nodeName:      meta.nodeName,
      attempt,
      contentLength: lastRawContent.length,
    });

    try {
      const extracted = extractJson(lastRawContent);
      const parsed    = JSON.parse(extracted) as unknown;
      const validated = parseOrThrow(schema, parsed);

      logger.info('LLM output validated successfully', {
        nodeName:      meta.nodeName,
        promptVersion: meta.promptVersion,
        runId:         meta.runId,
        attempt,
      });

      return validated;
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);

      if (attempt === MAX_NODE_RETRIES) {
        throw new ValidationError(
          `LLM output validation failed after ${MAX_NODE_RETRIES + 1} attempts for node "${meta.nodeName}": ${lastError}`,
          { nodeName: meta.nodeName, runId: meta.runId }
        );
      }
    }
  }

  throw new ValidationError(
    `Unexpected exit from retry loop for node "${meta.nodeName}"`
  );
}
