import React from 'react';

export default function LoadingState() {
  return (
    <div className="space-y-2 p-2" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-neutral-900/20 animate-pulse"
        >
          {/* Mock Logo Skeleton */}
          <div className="h-6 w-6 rounded bg-neutral-800" />
          
          {/* Mock Details Skeleton */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/3 rounded bg-neutral-800" />
            <div className="h-2 w-1/4 rounded bg-neutral-800/60" />
          </div>

          {/* Mock Ticker Skeleton */}
          <div className="h-4 w-12 rounded bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}
