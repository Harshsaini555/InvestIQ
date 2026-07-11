import { createNodeModel } from '../config/llm.config';
import { buildAnalysisPrompt, ANALYSIS_PROMPT_VERSION } from '../prompts/analysis.prompt';
import { InvestmentAnalysisParser } from './output-parser';
import { validateScores } from './scoring';
import { validateRisks } from './risk';
import { validateSWOT } from './swot';
import { validateRecommendation } from './recommendation';
import { validateSummary } from './summary';
import { calculateCompletenessPenalty } from './confidence';
import { logger } from '@/utils/logger';
import { ValidationError } from '@/utils/error';
import { type ResearchBundle } from '@/types/research.types';
import { type InvestmentAnalysis } from '../types/investment.types';
import { HumanMessage, type BaseMessage } from '@langchain/core/messages';

/**
 * Builds a correction prompt message containing error details so the LLM can adjust its output.
 */
function buildCorrectionMessage(errorMsg: string): HumanMessage {
  return new HumanMessage(
    `Your previous response failed validation.\n\nError: ${errorMsg}\n\nReview the instructions, correct the mistakes, and output the entire corrected JSON object. No explanation. No markdown.`
  );
}

/**
 * Executes Gemini analysis on the ResearchBundle.
 * Handles LangChain prompting, LLM invocation, custom parsing, guardrail verification, and retry loops.
 */
export async function analyzeResearch(bundle: ResearchBundle): Promise<InvestmentAnalysis> {
  const startTime = Date.now();
  const company = bundle.company;
  
  logger.info(`Starting AI investment intelligence analysis`, { company });

  // Instantiate the model using the synthesis node config
  const model = createNodeModel('synthesis');
  const parser = new InvestmentAnalysisParser();

  // Create initial prompt messages
  const initialMessages = buildAnalysisPrompt(bundle);
  let messages: BaseMessage[] = [...initialMessages];

  // Perform completeness limit checks
  const { confidenceLimit, warnings } = calculateCompletenessPenalty(bundle);
  if (warnings.length > 0) {
    logger.warn(`Research bundle has data gaps; capping recommended confidence score`, {
      company,
      confidenceLimit,
      warnings,
    });
  }

  const maxAttempts = 3; // 1 initial attempt + 2 retries
  let lastError = '';

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const attemptStart = Date.now();
    logger.info(`LLM Invocation attempt ${attempt}/${maxAttempts}`, { company });

    try {
      const response = await model.invoke(messages, {
        metadata: {
          nodeName: 'investment_analysis',
          promptVersion: ANALYSIS_PROMPT_VERSION.version,
          company,
          attempt,
        },
      });

      const responseText = typeof response.content === 'string'
        ? response.content
        : JSON.stringify(response.content);

      // 1. Parse JSON and validate Zod schema
      const analysis = await parser.parse(responseText);

      // 2. Perform guardrails validations
      const scoreCheck = validateScores(analysis);
      if (!scoreCheck.valid) {
        throw new ValidationError(`Scoring consistency failure: ${scoreCheck.message}`);
      }

      const riskCheck = validateRisks(analysis);
      if (!riskCheck.valid) {
        throw new ValidationError(`Risk profiling failure: ${riskCheck.message}`);
      }

      const swotCheck = validateSWOT(analysis);
      if (!swotCheck.valid) {
        throw new ValidationError(`SWOT point-count failure: ${swotCheck.message}`);
      }

      const recCheck = validateRecommendation(analysis);
      if (!recCheck.valid) {
        throw new ValidationError(`Recommendation alignment failure: ${recCheck.message}`);
      }

      const sumCheck = validateSummary(analysis);
      if (!sumCheck.valid) {
        throw new ValidationError(`Executive summary length failure: ${sumCheck.message}`);
      }

      // Check if LLM confidence exceeds data completeness capacity
      if (analysis.confidence.value > confidenceLimit) {
        logger.warn(
          `LLM confidence (${analysis.confidence.value}) exceeded structural cap (${confidenceLimit}) due to missing metrics; adjusting confidence score.`,
          { company }
        );
        analysis.confidence.value = confidenceLimit;
        analysis.confidence.reason = `${analysis.confidence.reason} (Note: Confidence adjusted down to reflect data gaps: ${warnings.join('; ')})`;
      }

      const duration = Date.now() - startTime;
      logger.info(`AI analysis successfully compiled and verified`, {
        company,
        totalDurationMs: duration,
        attempts: attempt,
      });

      // Log execution metadata
      const tokensInfo = (response.additional_kwargs as any)?.tokenUsage || {};
      logger.info(`LLM Token metrics`, {
        company,
        promptTokens: tokensInfo.promptTokens || 'unknown',
        completionTokens: tokensInfo.completionTokens || 'unknown',
        totalTokens: tokensInfo.totalTokens || 'unknown',
      });

      return analysis;
    } catch (error) {
      const attemptDuration = Date.now() - attemptStart;
      lastError = error instanceof Error ? error.message : String(error);

      logger.warn(`Analysis attempt ${attempt} failed verification`, {
        company,
        durationMs: attemptDuration,
        error: lastError,
      });

      if (attempt < maxAttempts) {
        // Build correction context and retry
        messages = [
          ...messages,
          buildCorrectionMessage(lastError),
        ];
      }
    }
  }

  throw new ValidationError(
    `AI Investment Engine failed to compile verified InvestmentAnalysis after ${maxAttempts} attempts. Last error: ${lastError}`,
    { company }
  );
}
