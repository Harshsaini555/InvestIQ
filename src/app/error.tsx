'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCcw, AlertOctagon } from 'lucide-react';
import { logger } from '@/utils/logger';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log exception metadata
    logger.error('Root error boundary caught exception', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full glow-blur glow-blue opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-red-500/10 bg-red-500/5 p-8 text-center backdrop-blur-xl space-y-5 shadow-2xl relative"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertOctagon className="h-6 w-6 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">System Error Occurred</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            An unexpected error has crashed the current screen layout. Diagnostic logs have been written.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-neutral-900 border border-white/5 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition-colors"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Retry Layout
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow shadow-blue-500/20 hover:scale-102 active:scale-98 transition-transform"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
