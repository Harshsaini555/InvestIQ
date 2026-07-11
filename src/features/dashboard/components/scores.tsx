'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';
import { type ScoreObject } from '@/agent/types/investment.types';

interface ScoresProps {
  overallScore: ScoreObject;
  recommendation: 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid' | 'Strong Avoid';
  confidence: { value: number; reason: string };
  businessQuality: ScoreObject;
  financialHealth: ScoreObject;
  growth: ScoreObject;
  competitiveAdvantage: ScoreObject;
  valuation: ScoreObject;
}

export function Scores({
  overallScore,
  recommendation,
  confidence,
  businessQuality,
  financialHealth,
  growth,
  competitiveAdvantage,
  valuation,
}: ScoresProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore.value / 100) * circumference;

  // Color mappings based on recommendation
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'Strong Buy':
        return 'from-emerald-500 to-teal-600 text-emerald-400 border-emerald-500/20';
      case 'Buy':
        return 'from-emerald-500 to-blue-600 text-emerald-400 border-emerald-500/20';
      case 'Hold':
        return 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/20';
      case 'Avoid':
        return 'from-red-500 to-orange-600 text-red-400 border-red-500/20';
      case 'Strong Avoid':
        return 'from-red-600 to-rose-700 text-red-500 border-red-600/20';
      default:
        return 'from-neutral-600 to-neutral-800 text-neutral-400 border-white/5';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Overall Score Circle (Card 1) */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 flex flex-col items-center text-center justify-between backdrop-blur-md">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Overall Rating</h3>

        {/* SVG Circular score */}
        <div className="relative mt-4 flex items-center justify-center">
          <svg className="h-32 w-32 -rotate-90">
            {/* Background circle */}
            <circle cx="64" cy="64" r={radius} className="stroke-white/5 fill-transparent" strokeWidth="8" />
            {/* Foreground circle */}
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              className={`fill-transparent stroke-blue-500`}
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-white">{overallScore.value}</span>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">SCORE</span>
          </div>
        </div>

        {/* Recommendation Badge */}
        <div className="mt-4">
          <div className={`rounded-full bg-gradient-to-r ${getRecommendationColor(recommendation)} bg-opacity-10 border px-4 py-1 text-sm font-bold shadow-lg`}>
            {recommendation.toUpperCase()}
          </div>
          <p className="mt-2 text-[10px] text-neutral-400 italic max-w-xs mx-auto leading-relaxed">
            &ldquo;{overallScore.reason}&rdquo;
          </p>
        </div>
      </div>

      {/* Sub-Scores Matrix (Card 2) */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Investment Dimensions</h3>

        <div className="space-y-4 text-xs">
          {[
            { label: 'Business Quality', score: businessQuality },
            { label: 'Financial Health', score: financialHealth },
            { label: 'Growth Vector', score: growth },
            { label: 'Competitive Moat', score: competitiveAdvantage },
            { label: 'Valuation Entry', score: valuation },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-neutral-400">{item.label}</span>
                <span className="font-bold text-white">{item.score.value}/100</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-950/60 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score.value}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Score Gauge (Card 3) */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 flex flex-col justify-between backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Assessment Confidence</h3>
          <Shield className="h-4 w-4 text-neutral-500" />
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="text-5xl font-extrabold bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
            {confidence.value}%
          </div>
          <div className="mt-2 h-2 w-full max-w-[200px] bg-neutral-950/60 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence.value}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
            />
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-neutral-950/40 border border-white/5 p-3 text-[10px] text-neutral-400 leading-relaxed">
          <div className="font-semibold text-neutral-300 flex items-center gap-1 mb-1">
            <Sparkles className="h-3 w-3 text-violet-400" /> Trust Factor Explanation
          </div>
          {confidence.reason}
        </div>
      </div>
    </div>
  );
}
