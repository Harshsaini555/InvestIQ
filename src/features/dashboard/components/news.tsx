'use client';

import React from 'react';
import { Globe, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export interface NewsAnalysisItem {
  title: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  investmentImpact: string;
}

interface NewsProps {
  newsAnalysis: NewsAnalysisItem[];
}

export function News({ newsAnalysis }: NewsProps) {
  const getSentimentBadge = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
            <ThumbsUp className="h-2.5 w-2.5" /> Positive
          </span>
        );
      case 'negative':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold text-red-400 uppercase tracking-wider">
            <ThumbsDown className="h-2.5 w-2.5" /> Negative
          </span>
        );
      case 'neutral':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-neutral-500/10 border border-white/5 px-2 py-0.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
            <MessageSquare className="h-2.5 w-2.5" /> Neutral
          </span>
        );
    }
  };

  if (!newsAnalysis || newsAnalysis.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 text-center text-xs text-neutral-500 backdrop-blur-md">
        No recent news analysis available.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">Stock News Sentiment Timeline</h3>

      <div className="relative border-l border-white/5 pl-6 ml-2 space-y-6">
        {newsAnalysis.map((article, idx) => (
          <div key={idx} className="relative">
            {/* Dot indicator on timeline */}
            <span className="absolute -left-[31px] top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-neutral-900 border border-white/10 p-0.5">
              <span className={`h-2 w-2 rounded-full ${article.sentiment === 'positive' ? 'bg-emerald-500' : article.sentiment === 'negative' ? 'bg-red-500' : 'bg-neutral-500'}`} />
            </span>

            {/* Content card */}
            <div className="rounded-xl border border-white/5 bg-neutral-950/20 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Market Sources</span>
                </div>
                <div className="flex items-center gap-2">
                  {getSentimentBadge(article.sentiment)}
                </div>
              </div>

              <h4 className="text-xs font-bold text-white leading-snug">{article.title}</h4>

              <div className="pt-2 border-t border-white/5 text-[10px] text-neutral-400">
                <span className="font-semibold text-neutral-300">Investment Impact: </span>
                {article.investmentImpact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
