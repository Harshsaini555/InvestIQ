'use client';

import React from 'react';
import { ShieldAlert, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { type InvestmentAnalysis } from '@/agent/types/investment.types';

interface SwotProps {
  swot: InvestmentAnalysis['swot'];
}

export function Swot({ swot }: SwotProps) {
  const cards = [
    {
      title: 'Strengths',
      items: swot.strengths,
      icon: <Zap className="h-4 w-4 text-emerald-400" />,
      bg: 'bg-emerald-500/5 border-emerald-500/10',
    },
    {
      title: 'Weaknesses',
      items: swot.weaknesses,
      icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
      bg: 'bg-amber-500/5 border-amber-500/10',
    },
    {
      title: 'Opportunities',
      items: swot.opportunities,
      icon: <TrendingUp className="h-4 w-4 text-blue-400" />,
      bg: 'bg-blue-500/5 border-blue-500/10',
    },
    {
      title: 'Threats',
      items: swot.threats,
      icon: <ShieldAlert className="h-4 w-4 text-red-400" />,
      bg: 'bg-red-500/5 border-red-500/10',
    },
  ];

  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">SWOT Analysis</h3>

      <div className="grid gap-6 sm:grid-cols-2">
        {cards.map((card, idx) => (
          <div key={idx} className={`rounded-xl border p-5 ${card.bg}`}>
            <div className="flex items-center gap-2 mb-3">
              {card.icon}
              <h4 className="text-sm font-bold text-white">{card.title}</h4>
            </div>
            <ul className="space-y-2 text-xs leading-relaxed text-neutral-400 list-disc list-inside">
              {card.items.map((item: string, itemIdx: number) => (
                <li key={itemIdx} className="pl-1">
                  <span className="text-neutral-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
