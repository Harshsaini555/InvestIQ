'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export interface RiskFactor {
  rating: 'Low' | 'Medium' | 'High';
  explanation: string;
}

interface RisksProps {
  keyRisks: {
    financialRisk: RiskFactor;
    marketRisk: RiskFactor;
    competitionRisk: RiskFactor;
    macroeconomicRisk: RiskFactor;
    executionRisk: RiskFactor;
    regulatoryRisk: RiskFactor;
    technologyRisk: RiskFactor;
    supplyChainRisk: RiskFactor;
  };
}

export function Risks({ keyRisks }: RisksProps) {
  const getBadgeColor = (rating: 'Low' | 'Medium' | 'High') => {
    switch (rating) {
      case 'High':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'Medium':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      case 'Low':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      default:
        return 'bg-neutral-500/10 border-white/5 text-neutral-400';
    }
  };

  const getShieldIcon = (rating: 'Low' | 'Medium' | 'High') => {
    switch (rating) {
      case 'High':
        return <ShieldAlert className="h-4 w-4 text-red-400" />;
      case 'Medium':
        return <Shield className="h-4 w-4 text-amber-400" />;
      case 'Low':
        return <ShieldCheck className="h-4 w-4 text-emerald-400" />;
    }
  };

  const riskList = [
    { label: 'Financial Risk', data: keyRisks.financialRisk },
    { label: 'Market Risk', data: keyRisks.marketRisk },
    { label: 'Competition Risk', data: keyRisks.competitionRisk },
    { label: 'Macroeconomic Risk', data: keyRisks.macroeconomicRisk },
    { label: 'Execution Risk', data: keyRisks.executionRisk },
    { label: 'Regulatory Risk', data: keyRisks.regulatoryRisk },
    { label: 'Technology Risk', data: keyRisks.technologyRisk },
    { label: 'Supply Chain Risk', data: keyRisks.supplyChainRisk },
  ];

  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Risk Profile Matrix</h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {riskList.map((risk, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-neutral-950/20 p-4 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-300">{risk.label}</span>
              {getShieldIcon(risk.data.rating)}
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed min-h-[48px]">
              {risk.data.explanation}
            </p>

            <div className="flex items-center justify-start">
              <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border ${getBadgeColor(risk.data.rating)}`}>
                {risk.data.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
