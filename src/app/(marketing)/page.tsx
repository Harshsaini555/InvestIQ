'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, TrendingUp, BarChart2, Briefcase } from 'lucide-react';
import CompanySearch from '@/components/company-search/CompanySearch';
import CompanyPreviewCard from '@/components/company-search/CompanyPreviewCard';
import { type CompanySuggestion } from '@/types/research.types';

const FEATURE_CARDS = [
  {
    icon: <Cpu className="h-6 w-6 text-blue-400" />,
    title: 'LangGraph Orchestrated',
    description: 'Multi-node data pipelines that sequentially query, validate, and aggregate stock profiles.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-violet-400" />,
    title: 'Real-Time Financials',
    description: 'Queries live quotes, key ratios, target prices, and fundamental charts via Yahoo Finance APIs.',
  },
  {
    icon: <BarChart2 className="h-6 w-6 text-emerald-400" />,
    title: 'Moat & Peer Mapping',
    description: 'Aggregates profile summaries and comparative pricing matrices for industry peers.',
  },
  {
    icon: <Briefcase className="h-6 w-6 text-amber-400" />,
    title: 'AI Synthesis Engine',
    description: 'Runs Gemini models with strict structured JSON schemas and auto-corrective retry guardrails.',
  },
];

const EXAMPLE_COMPANIES = [
  { ticker: 'AAPL', name: 'Apple' },
  { ticker: 'MSFT', name: 'Microsoft' },
  { ticker: 'TSLA', name: 'Tesla' },
  { ticker: 'NVDA', name: 'Nvidia' },
  { ticker: 'TATAMOTORS.NS', name: 'Tata Motors' },
];

export default function MarketingPage() {
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<CompanySuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectCompany = (company: CompanySuggestion) => {
    setSelectedCompany(company);
  };

  const handleStartAnalysis = (ticker: string) => {
    setLoading(true);
    router.push(`/research/${ticker}`);
  };

  const handleExampleClick = async (symbol: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/company/quote?ticker=${symbol}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSelectedCompany({
            name: json.data.name || name,
            ticker: json.data.ticker,
            exchange: json.data.exchange,
            country: json.data.country || 'United States',
            industry: json.data.industry,
            logoUrl: `https://images.financialmodelingprep.com/symbol/${symbol.split('.')[0]}.png`,
            quoteType: json.data.quoteType,
            isTradable: json.data.isTradable,
          });
        }
      }
    } catch (e) {
      console.error('Failed to pre-select symbol', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      {/* Background radial ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full glow-blur glow-purple opacity-30" />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full glow-blur glow-blue opacity-20" />

      {/* Main Hero Container */}
      <main className="flex-1">
        <section className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-semibold text-violet-300 backdrop-blur-md"
            >
              <Sparkles className="h-3 w-3" /> Autonomous Investment Intelligence
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-3xl bg-gradient-to-b from-white via-neutral-100 to-neutral-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl"
            >
              AI Equity Research Agent for Institutional Investors
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-2xl text-base text-neutral-400 md:text-lg"
            >
              Generate structured, institutional-grade equity reports and valuation models in seconds. Engineered with LangGraph, Yahoo Finance, and Gemini.
            </motion.p>

            {/* Autocomplete Search Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="mt-10 w-full max-w-lg flex flex-col items-center"
            >
              <CompanySearch onSelectCompany={handleSelectCompany} disabled={loading} />

              {/* Example Tickers */}
              <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-neutral-500">
                <span>Popular symbols:</span>
                {EXAMPLE_COMPANIES.map((company) => (
                  <button
                    key={company.ticker}
                    onClick={() => handleExampleClick(company.ticker, company.name)}
                    disabled={loading}
                    className="rounded-md border border-white/5 bg-neutral-950/40 px-2.5 py-1 text-neutral-400 transition-colors hover:border-white/10 hover:text-white disabled:opacity-50"
                  >
                    {company.ticker.split('.')[0]}
                  </button>
                ))}
              </div>

              {/* Company Preview Card */}
              {selectedCompany && (
                <CompanyPreviewCard
                  suggestion={selectedCompany}
                  onStartAnalysis={handleStartAnalysis}
                  isPipelineRunning={loading}
                />
              )}
            </motion.div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section id="features" className="border-t border-white/5 bg-[#050505]/40 py-24 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Advanced Pipeline Orchestration & Analysis
              </h2>
              <p className="mt-3 text-neutral-400 text-sm max-w-lg mx-auto">
                InvestIQ runs an automated processing stack delivering verified data models.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURE_CARDS.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1, cubicBezier: [0.16, 1, 0.3, 1] }}
                  className="rounded-xl border border-white/5 bg-neutral-950/30 p-6 glass-panel-hover"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-900/60 border border-white/5">
                    {card.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-400">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
