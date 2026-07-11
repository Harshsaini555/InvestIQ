'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function ResearchLoading() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center space-y-6 px-6">
      {/* Animated loader */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-14 w-14 rounded-full border border-blue-500/20 animate-ping" />
        <div className="absolute h-10 w-10 rounded-full border border-purple-500/20 animate-ping delay-150" />
        <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">
          Preparing Research Workspace
        </h3>
        <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
          Initializing analysis modules and loading research pipeline.
        </p>
      </div>

      {/* Skeleton placeholders */}
      <div className="w-full max-w-md space-y-4 pt-6">
        <div className="h-8 w-2/3 rounded-lg bg-neutral-900 border border-white/5 animate-pulse-slow" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 rounded-lg bg-neutral-900 border border-white/5 animate-pulse-slow" />
          <div className="h-20 rounded-lg bg-neutral-900 border border-white/5 animate-pulse-slow" />
          <div className="h-20 rounded-lg bg-neutral-900 border border-white/5 animate-pulse-slow" />
        </div>
        <div className="h-40 w-full rounded-lg bg-neutral-900 border border-white/5 animate-pulse-slow" />
        <div className="h-5 w-1/2 rounded bg-neutral-900 border border-white/5 animate-pulse-slow" />
      </div>
    </div>
  );
}
