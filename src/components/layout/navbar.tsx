'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Github } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 p-2 shadow-lg shadow-blue-500/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
            InvestIQ
          </span>
          <span className="hidden rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 sm:block">
            V1.0
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-400 md:flex">
          <Link href="/" className="transition-colors hover:text-white">
            Home
          </Link>
          <a href="#features" className="transition-colors hover:text-white">
            Capabilities
          </a>
          <a href="https://github.com/Harshsaini555/InvestIQ" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-white">
            Documentation
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 text-neutral-400 hover:text-white sm:flex"
          >
            <Github className="h-4 w-4" />
          </a>
          <Link
            href="#"
            className="relative inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Invest Now
          </Link>
        </div>
      </div>
    </header>
  );
}
