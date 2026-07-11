'use client';

import React from 'react';
import { formatMarketCap } from '@/utils/format';

export interface CompetitorAnalysisItem {
  competitorName: string;
  ticker: string;
  competitiveAdvantages: string[];
  competitiveWeaknesses: string[];
  marketPosition: string;
  moat: string;
  threatLevel: 'Low' | 'Medium' | 'High';
}

interface CompetitorsProps {
  competitorAnalysis: CompetitorAnalysisItem[];
  peers: Array<{ ticker: string; marketCap: number | null; currentPrice: number | null }>;
}

export function Competitors({ competitorAnalysis, peers }: CompetitorsProps) {
  const getThreatColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High':
        return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'Medium':
        return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'Low':
        return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
    }
  };

  const getMarketCap = (ticker: string) => {
    const peer = peers.find((p) => p.ticker.toUpperCase() === ticker.toUpperCase());
    return peer?.marketCap ? formatMarketCap(peer.marketCap) : 'N/A';
  };

  if (!competitorAnalysis || competitorAnalysis.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 text-center text-xs text-neutral-500 backdrop-blur-md">
        No competitor analysis available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Competitor Moat & Peer Matrix</h3>

      {/* Desktop view: Table layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-neutral-500 font-semibold uppercase tracking-wider text-[9px] pb-4">
              <th className="py-3 pr-4">Competitor</th>
              <th className="py-3 px-4">Market Cap</th>
              <th className="py-3 px-4">Market Position</th>
              <th className="py-3 px-4">Moat Description</th>
              <th className="py-3 px-4">Advantages</th>
              <th className="py-3 px-4">Threat Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {competitorAnalysis.map((comp, idx) => (
              <tr key={idx} className="hover:bg-neutral-950/20 transition-colors">
                <td className="py-4 pr-4">
                  <div className="font-bold text-white">{comp.competitorName}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{comp.ticker}</div>
                </td>
                <td className="py-4 px-4 font-mono font-semibold">{getMarketCap(comp.ticker)}</td>
                <td className="py-4 px-4">
                  <span className="rounded bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300">
                    {comp.marketPosition}
                  </span>
                </td>
                <td className="py-4 px-4 max-w-[200px] truncate" title={comp.moat}>
                  {comp.moat}
                </td>
                <td className="py-4 px-4">
                  <ul className="list-disc list-inside space-y-0.5">
                    {comp.competitiveAdvantages.slice(0, 2).map((adv, aIdx) => (
                      <li key={aIdx} className="text-[10px] text-neutral-400 truncate max-w-[180px]" title={adv}>
                        {adv}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-4 px-4">
                  <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getThreatColor(comp.threatLevel)}`}>
                    {comp.threatLevel}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view: Card stack */}
      <div className="md:hidden space-y-4">
        {competitorAnalysis.map((comp, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-neutral-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white">{comp.competitorName}</span>
                <span className="ml-2 font-mono text-[10px] text-neutral-500">{comp.ticker}</span>
              </div>
              <span className={`rounded border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getThreatColor(comp.threatLevel)}`}>
                {comp.threatLevel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-400">
              <div>
                <span className="text-neutral-500">Market Cap:</span> <span className="font-mono font-semibold text-white">{getMarketCap(comp.ticker)}</span>
              </div>
              <div>
                <span className="text-neutral-500">Position:</span> <span className="text-white">{comp.marketPosition}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 text-[10px] text-neutral-400 space-y-1">
              <div>
                <span className="font-semibold text-neutral-300">Moat: </span>
                {comp.moat}
              </div>
              <div>
                <span className="font-semibold text-emerald-400">Advantages: </span>
                {comp.competitiveAdvantages.join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
