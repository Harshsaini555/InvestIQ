import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type CompanySuggestion } from '@/types/research.types';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Play, Loader2, Info } from 'lucide-react';

// Helper to format large numbers with compact notation (e.g. 1.5B)
function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

interface CompanyPreviewCardProps {
  suggestion: CompanySuggestion;
  onStartAnalysis: (ticker: string) => void;
  isPipelineRunning: boolean;
}

// Helper to format currency values
function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function CompanyPreviewCard({
  suggestion,
  onStartAnalysis,
  isPipelineRunning,
}: CompanyPreviewCardProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Fetch live quick quote details for selected company
  const { data: quote, isLoading } = useQuery({
    queryKey: ['companyQuote', suggestion.ticker],
    queryFn: async () => {
      const res = await fetch(`/api/company/quote?ticker=${encodeURIComponent(suggestion.ticker)}`);
      if (!res.ok) throw new Error('Failed to fetch quote');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Quote failed');
      return json.data;
    },
    staleTime: 60 * 1000, // cache for 1 minute
  });

  const isUp = quote ? quote.change >= 0 : false;
  const currency = quote?.currency || suggestion.currency || 'USD';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg mt-6 rounded-2xl border border-white/10 bg-neutral-950/40 p-6 backdrop-blur-xl shadow-2xl shadow-black/40 flex flex-col space-y-5"
    >
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-neutral-900 border border-white/10 font-bold text-sm text-neutral-300">
            {suggestion.logoUrl ? (
              <img
                src={suggestion.logoUrl}
                alt=""
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <span>{suggestion.ticker.slice(0, 2)}</span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-none">{suggestion.name}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-400">
              <span className="font-bold uppercase tracking-wider text-neutral-300">{suggestion.ticker}</span>
              <span>•</span>
              <span>{suggestion.exchange}</span>
              <span>•</span>
              <span>{suggestion.country}</span>
            </div>
          </div>
        </div>

        <span className="px-2.5 py-1 text-[9px] font-bold rounded bg-neutral-900 border border-white/5 text-neutral-400 uppercase">
          {quote?.quoteType || suggestion.quoteType || 'EQUITY'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      ) : quote ? (
        <div className="space-y-4">
          {/* Price Metrics Grid */}
          <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
            <div>
              <span className="text-2xl font-bold text-white tracking-tight">
                {formatCurrency(quote.price, currency)}
              </span>
              <span className="text-[10px] text-neutral-500 ml-1.5">{currency}</span>
            </div>

            <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
              isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{isUp ? '+' : ''}{formatCurrency(quote.change, currency)} ({isUp ? '+' : ''}{quote.changePercent.toFixed(2)}%)</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col space-y-1">
              <span className="text-neutral-500">Market Cap</span>
              <span className="font-medium text-neutral-200">
                {quote.marketCap ? `${currency} ${formatCompactNumber(quote.marketCap)}` : 'N/A'}
              </span>
            </div>

            <div className="flex flex-col space-y-1">
              <span className="text-neutral-500">Industry</span>
              <span className="font-medium text-neutral-200 truncate">{suggestion.industry || quote.industry}</span>
            </div>
          </div>

          {/* 52-Week Slider */}
          {quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>52W Low: {formatCurrency(quote.fiftyTwoWeekLow, currency)}</span>
                <span>52W High: {formatCurrency(quote.fiftyTwoWeekHigh, currency)}</span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-neutral-900 border border-white/5 overflow-hidden">
                <div
                  className="absolute top-0 bottom-0 h-full bg-blue-500 rounded-full"
                  style={{
                    left: `${Math.max(0, Math.min(100, ((quote.price - quote.fiftyTwoWeekLow) / (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow)) * 100))}%`,
                    width: '3px',
                    marginLeft: '-1.5px',
                  }}
                />
              </div>
            </div>
          ) : null}

          {/* Description */}
          {quote.description ? (
            <div className="text-[11px] text-neutral-400 bg-neutral-900/30 border border-white/5 p-3 rounded-xl leading-relaxed">
              <div className="flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  {showFullDesc ? quote.description : `${quote.description.slice(0, 140)}...`}
                  <button
                    type="button"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                    className="text-blue-400 hover:text-blue-300 font-semibold ml-1 focus:outline-none"
                  >
                    {showFullDesc ? 'Show less' : 'Read more'}
                  </button>
                </p>
              </div>
            </div>
          ) : null}

          {/* Pricing Warn */}
          {quote.price <= 0 && (
            <div className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl leading-relaxed">
              <div className="flex items-start gap-1.5">
                <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <p>
                  This symbol has no active pricing data on Yahoo Finance. Investment analysis is disabled. Try searching for active symbols (e.g. <strong>{suggestion.ticker}.NS</strong> for MRF) instead.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-neutral-500 py-2">
          Unable to retrieve live market quote metrics.
        </div>
      )}

      {/* Action Trigger */}
      <button
        type="button"
        disabled={isPipelineRunning || (quote && quote.price <= 0)}
        onClick={() => onStartAnalysis(suggestion.ticker)}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/10 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
      >
        {isPipelineRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing Ticker...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-white" />
            <span>Start AI Research</span>
          </>
        )}
      </button>
    </motion.div>
  );
}
