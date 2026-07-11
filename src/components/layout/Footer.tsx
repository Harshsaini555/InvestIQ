import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030303] py-12 text-neutral-500">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-800 p-1">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              InvestIQ RESEARCH
            </span>
          </div>

          {/* Copyright & Info */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" /> Secure Processing
            </span>
            <span>&copy; {new Date().getFullYear()} InvestIQ Inc. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
