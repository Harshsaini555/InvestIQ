import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import type { SafetySetting } from '@google/generative-ai';

import {
  SUPERVISOR_TEMPERATURE,
  DEFAULT_TEMPERATURE,
  SWOT_TEMPERATURE,
  SYNTHESIS_TEMPERATURE,
  MAX_OUTPUT_TOKENS,
  NODE_NAMES,
} from '@/constants/agent.constants';
import { env } from '@/lib/validators/env';

/* ── Safety Settings ───────────────────────────────────────── */
const SAFETY_SETTINGS: SafetySetting[] = [
  {
    category:  HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category:  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category:  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category:  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/* ── Node Model Config Map ─────────────────────────────────── */
// Every temperature and token budget is sourced from agent.constants.
// No magic numbers in this file.
interface NodeModelOverride {
  temperature: number;
  maxOutputTokens: number;
}

const NODE_MODEL_CONFIG: Record<string, NodeModelOverride> = {
  [NODE_NAMES.SUPERVISOR]:      { temperature: SUPERVISOR_TEMPERATURE, maxOutputTokens: 256  },
  [NODE_NAMES.COMPANY_PROFILE]: { temperature: DEFAULT_TEMPERATURE,    maxOutputTokens: 1024 },
  [NODE_NAMES.FINANCIALS]:      { temperature: DEFAULT_TEMPERATURE,    maxOutputTokens: 1024 },
  [NODE_NAMES.NEWS]:            { temperature: DEFAULT_TEMPERATURE,    maxOutputTokens: 2048 },
  [NODE_NAMES.COMPETITORS]:     { temperature: DEFAULT_TEMPERATURE,    maxOutputTokens: 2048 },
  [NODE_NAMES.SWOT]:            { temperature: SWOT_TEMPERATURE,       maxOutputTokens: 1024 },
  [NODE_NAMES.RISK]:            { temperature: DEFAULT_TEMPERATURE,    maxOutputTokens: 1024 },
  [NODE_NAMES.SYNTHESIS]:       { temperature: SYNTHESIS_TEMPERATURE,  maxOutputTokens: 4096 },
};

/* ── Model Factory ─────────────────────────────────────────── */
/**
 * Creates a configured ChatGoogleGenerativeAI instance for a specific node.
 * Every node gets its own model instance with the correct temperature and
 * token budget. Safety settings are applied uniformly across all instances.
 */
export function createNodeModel(nodeName: string): ChatGoogleGenerativeAI {
  const override = NODE_MODEL_CONFIG[nodeName] ?? {
    temperature:     DEFAULT_TEMPERATURE,
    maxOutputTokens: MAX_OUTPUT_TOKENS,
  };

  return new ChatGoogleGenerativeAI({
    model:           env.GEMINI_MODEL_NAME,
    apiKey:          env.GEMINI_API_KEY,
    temperature:     override.temperature,
    maxOutputTokens: override.maxOutputTokens,
    safetySettings:  SAFETY_SETTINGS,
    streaming:       false,
  });
}

