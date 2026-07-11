'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, CircleDot, Loader2, AlertTriangle, Terminal } from 'lucide-react';

export interface ProgressStage {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  log?: string;
}

interface ResearchProgressProps {
  ticker: string;
  stages: ProgressStage[];
  logs: string[];
}

export function ResearchProgress({ ticker, stages, logs }: ResearchProgressProps) {


  useEffect(() => {
    // Keep logs scrolled to bottom
    const logConsole = document.getElementById('log-console');
    if (logConsole) {
      logConsole.scrollTop = logConsole.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-white/5 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-xl">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Compiling Equity Intelligence</h2>
          <p className="mt-1 text-xs text-neutral-400">Target stock: <span className="font-semibold text-blue-400">{ticker.toUpperCase()}</span></p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-[10px] font-semibold text-blue-400">
          <Loader2 className="h-3 w-3 animate-spin" /> In Progress
        </div>
      </div>

      {/* Progress Stages */}
      <div className="mt-8 space-y-4">
        {stages.map((stage) => {
          const isPending = stage.status === 'pending';
          const isRunning = stage.status === 'running';
          const isCompleted = stage.status === 'completed';
          const isFailed = stage.status === 'failed';

          return (
            <div key={stage.id} className="flex items-start gap-4">
              {/* Status Icons */}
              <div className="mt-0.5 flex h-5 w-5 items-center justify-center">
                {isCompleted && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </motion.div>
                )}
                {isRunning && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                )}
                {isPending && (
                  <CircleDot className="h-4 w-4 text-neutral-600" />
                )}
                {isFailed && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1">
                <span className={`text-xs font-semibold ${isCompleted ? 'text-neutral-300' : isRunning ? 'text-white' : 'text-neutral-500'}`}>
                  {stage.label}
                </span>
                {isRunning && stage.log && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-[10px] text-blue-400/80 font-mono"
                  >
                    {stage.log}
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Log Console */}
      <div className="mt-10">
        <div className="flex items-center gap-1.5 border-b border-white/5 bg-neutral-950/60 px-4 py-2 rounded-t-lg border-x border-t border-white/5">
          <Terminal className="h-3.5 w-3.5 text-neutral-500" />
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 font-mono">PIPELINE CONSOLE</span>
        </div>
        <div
          id="log-console"
          className="h-36 overflow-y-auto rounded-b-lg border-b border-x border-white/5 bg-black/90 p-4 font-mono text-[10px] leading-relaxed text-neutral-400 space-y-1.5"
        >
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-emerald-400' : 'text-neutral-400'}
              >
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
          {stages.every((s) => s.status === 'completed') && (
            <div className="text-emerald-400 animate-pulse">
              [SYSTEM] Pipeline complete. Rendering dashboard...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
