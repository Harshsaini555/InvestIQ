'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient details */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full glow-blur glow-purple opacity-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-white/5 bg-neutral-900/40 p-8 text-center backdrop-blur-xl space-y-5 shadow-2xl relative"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">404 - Page Not Found</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            The page you are looking for does not exist, has been removed, or has had its name changed.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow shadow-blue-500/20 hover:scale-102 active:scale-98 transition-transform"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Workspace
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
