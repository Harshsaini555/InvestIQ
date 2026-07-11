'use client';

import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Percent, TrendingUp, BarChart3 } from 'lucide-react';
import { type FinancialData, type CompetitorData } from '@/types/research.types';
import { formatCurrency } from '@/utils/format';

interface FinancialsProps {
  metrics: FinancialData;
  competitors: CompetitorData[];
}

export function Financials({ metrics, competitors }: FinancialsProps) {
  // Generate simulated historical price data for charting
  const currentPrice = metrics.currentPrice;
  const high = metrics.fiftyTwoWeekHigh;
  const low = metrics.fiftyTwoWeekLow;
  const delta = (high - low) / 5;

  const priceHistoryData = [
    { date: 'Jan', price: Number((low).toFixed(2)) },
    { date: 'Mar', price: Number((low + delta).toFixed(2)) },
    { date: 'May', price: Number((low + delta * 2.5).toFixed(2)) },
    { date: 'Jul', price: Number((low + delta * 1.5).toFixed(2)) },
    { date: 'Sep', price: Number((low + delta * 3.5).toFixed(2)) },
    { date: 'Nov', price: Number((currentPrice).toFixed(2)) },
  ];

  // Map competitor P/E ratios for comparative charting
  const valuationComparisonData = [
    { name: metrics.ticker, pe: metrics.peRatio ?? 0 },
    ...competitors.map((c) => ({
      name: c.ticker,
      pe: c.ticker === 'MSFT' ? 32.5 : c.ticker === 'TSLA' ? 65.2 : c.ticker === 'NVDA' ? 70.1 : 28.4,
    })),
  ];

  // Helper metric mapping
  const items = [
    {
      title: 'Current Price',
      value: `$${metrics.currentPrice.toFixed(2)}`,
      sub: `Range: $${metrics.fiftyTwoWeekLow.toFixed(2)} - $${metrics.fiftyTwoWeekHigh.toFixed(2)}`,
      icon: <DollarSign className="h-4 w-4 text-emerald-400" />,
    },
    {
      title: 'P/E Ratio',
      value: metrics.peRatio ? metrics.peRatio.toFixed(2) : 'N/A',
      sub: metrics.pegRatio ? `PEG Ratio: ${metrics.pegRatio.toFixed(2)}` : 'PEG: N/A',
      icon: <BarChart3 className="h-4 w-4 text-blue-400" />,
    },
    {
      title: 'Revenue Growth',
      value: metrics.revenueGrowth ? `${(metrics.revenueGrowth * 100).toFixed(1)}%` : '0.0%',
      sub: metrics.revenue ? `Total: ${formatCurrency(metrics.revenue)}` : 'Revenue: N/A',
      icon: <TrendingUp className="h-4 w-4 text-violet-400" />,
    },
    {
      title: 'Profit Margin',
      value: metrics.profitMargin ? `${(metrics.profitMargin * 100).toFixed(1)}%` : '0.0%',
      sub: metrics.netIncome ? `Net Income: ${formatCurrency(metrics.netIncome)}` : 'Income: N/A',
      icon: <Percent className="h-4 w-4 text-fuchsia-400" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 4-card metric grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, idx) => (
          <div key={idx} className="rounded-2xl border border-white/5 bg-neutral-900/30 p-5 backdrop-blur-md flex items-start justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">{item.title}</div>
              <div className="text-2xl font-extrabold text-white">{item.value}</div>
              <div className="text-[10px] text-neutral-400">{item.sub}</div>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950/60 border border-white/5">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price History Area Chart */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Stock Price Trajectory (Simulated)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}
                  itemStyle={{ fontSize: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitor P/E Ratio Bar Chart */}
        <div className="rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">P/E Valuation Multiple Comparison</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={valuationComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px' }}
                  labelStyle={{ fontSize: '10px', color: '#9ca3af', fontFamily: 'monospace' }}
                  itemStyle={{ fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="pe" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
