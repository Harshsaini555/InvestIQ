import { type z } from 'zod';
import { investmentAnalysisSchema, scoreSchema, riskRatingSchema } from '../schemas/investment.schema';

export type InvestmentAnalysis = z.infer<typeof investmentAnalysisSchema>;
export type ScoreObject = z.infer<typeof scoreSchema>;
export type RiskRatingObject = z.infer<typeof riskRatingSchema>;
export type NewsAnalysisItem = z.infer<typeof investmentAnalysisSchema>['newsAnalysis'][number];
export type CompetitorAnalysisItem = z.infer<typeof investmentAnalysisSchema>['competitorAnalysis'][number];
