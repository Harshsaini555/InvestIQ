'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center space-y-6 px-6">
      {/* Pulse loading container */}
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full border border-blue-500/30 animate-ping" />
        <div className="relative h-10 w-10 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-sm font-bold text-white tracking-wide uppercase">Initializing Workspace</h3>
        <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
          Loading client configurations, checking system packages, and initializing queries.
        </p>
      </div>

      {/* Skeletons block */}
      <div className="w-full max-w-sm space-y-3 pt-6">
        <div className="h-6 w-3/4 rounded bg-neutral-900 border border-white/5 animate-pulse-slow" />
        <div className="h-16 w-full rounded bg-neutral-900 border border-white/5 animate-pulse-slow" />
        <div className="h-4 w-1/2 rounded bg-neutral-900 border border-white/5 animate-pulse-slow" />
      </div>
    </div>
  );
}
