'use client';

import React from 'react';
import { TrendingUp, BookOpen, Clock, AlertTriangle } from 'lucide-react';

interface VerdictProps {
  executiveSummary: string;
  bullCase: string;
  bearCase: string;
  growthOpportunities: string[];
  catalysts: string[];
  investmentHorizon: string;
  finalVerdict: string;
  sourcesUsed: string[];
}

export function Verdict({
  executiveSummary,
  bullCase,
  bearCase,
  growthOpportunities,
  catalysts,
  investmentHorizon,
  finalVerdict,
  sourcesUsed,
}: VerdictProps) {
  return (
    <div className="space-y-6">
      {/* Executive Summary (Highlighted ChatGPT-style card) */}
      <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-6 backdrop-blur-md relative overflow-hidden">
        {/* Glow backdrop detail */}
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-500/10 glow-blur" />
        
        <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Executive Summary</h3>
        <p className="text-xs leading-relaxed text-neutral-200">
          {executiveSummary}
        </p>
      </div>

      {/* Main Verdict & Horizon */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Final Verdict */}
        <div className="md:col-span-2 rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Final Verdict</h3>
            <p className="text-xs leading-relaxed text-neutral-300">
              {finalVerdict}
            </p>
          </div>
        </div>

        {/* Investment Horizon */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Investment Horizon</h3>
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5 text-violet-400" />
              <span className="text-lg font-bold">{investmentHorizon}</span>
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              Recommended duration for holding equity value to realize modeled catalysts.
            </p>
          </div>
        </div>
      </div>

      {/* Bull and Bear Cases */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bull Case */}
        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" /> Bull Case Scenario
          </h3>
          <p className="text-xs leading-relaxed text-neutral-300">
            {bullCase}
          </p>
        </div>

        {/* Bear Case */}
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Bear Case Scenario
          </h3>
          <p className="text-xs leading-relaxed text-neutral-300">
            {bearCase}
          </p>
        </div>
      </div>

      {/* Growth Drivers & Catalysts lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Growth Opportunities */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Growth Opportunities</h3>
          <ul className="space-y-2 text-xs text-neutral-300">
            {growthOpportunities.map((op, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>{op}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Catalysts */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Key Investment Catalysts</h3>
          <ul className="space-y-2 text-xs text-neutral-300">
            {catalysts.map((cat, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                <span>{cat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sources list */}
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-neutral-500" /> Audited Information Sources
        </h3>
        <div className="flex flex-wrap gap-2 pt-2">
          {sourcesUsed.map((source, idx) => (
            <span key={idx} className="rounded bg-neutral-800 border border-white/10 px-3 py-1 text-[10px] font-semibold text-neutral-300">
              {source}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
