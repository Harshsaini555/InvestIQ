import { BaseOutputParser } from '@langchain/core/output_parsers';
import { investmentAnalysisSchema } from '../schemas/investment.schema';
import { type InvestmentAnalysis } from '../types/investment.types';
import { parseOrThrow } from '@/lib/validators/zod-helpers';
import { ValidationError } from '@/utils/error';

/**
 * Parses raw text from the generative model, extracts JSON,
 * and validates it against the strict InvestmentAnalysis Zod schema.
 */
export class InvestmentAnalysisParser extends BaseOutputParser<InvestmentAnalysis> {
  lc_namespace = ['agent', 'analysis', 'InvestmentAnalysisParser'];

  getFormatInstructions(): string {
    return '';
  }

  async parse(text: string): Promise<InvestmentAnalysis> {
    try {
      // Strips markdown code fences if present (e.g. ```json ... ``` or ``` ... ```)
      let cleanText = text.trim();
      const fenceMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fenceMatch?.[1]) {
        cleanText = fenceMatch[1].trim();
      }

      // Find the first and last brace to extract pure JSON in case there is trailing conversational noise
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start !== -1 && end !== -1 && end > start) {
        cleanText = cleanText.slice(start, end + 1);
      }

      const parsed = JSON.parse(cleanText);
      return parseOrThrow(investmentAnalysisSchema, parsed);
    } catch (error) {
      throw new ValidationError(
        `Failed to parse or validate InvestmentAnalysis JSON: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
