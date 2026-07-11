'use client';

import React from 'react';
import { Globe, Users, MapPin, Briefcase } from 'lucide-react';
import { type CompanyProfileData } from '@/types/research.types';
import { formatNumber, formatMarketCap } from '@/utils/format';

interface CompanyHeaderProps {
  profile: CompanyProfileData;
  price: number;
}

export function CompanyHeader({ profile, price }: CompanyHeaderProps) {
  return (
    <div className="w-full rounded-2xl border border-white/5 bg-neutral-900/30 p-6 backdrop-blur-md">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Identity & Price */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h1>
            <span className="rounded bg-neutral-800 border border-white/10 px-2 py-0.5 text-xs font-mono font-bold text-neutral-300">
              {profile.ticker}
            </span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
              {profile.sector}
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">${price.toFixed(2)}</span>
            <span className="text-xs text-neutral-400">USD</span>
          </div>
        </div>

        {/* High-level stats */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 md:flex md:border-t-0 md:pt-0">
          <div className="rounded-xl border border-white/5 bg-neutral-950/20 px-4 py-3 min-w-[120px]">
            <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Market Cap</div>
            <div className="mt-1 text-sm font-bold text-white">
              {profile.marketCap ? formatMarketCap(profile.marketCap) : 'N/A'}
            </div>
          </div>
          <div className="rounded-xl border border-white/5 bg-neutral-950/20 px-4 py-3 min-w-[120px]">
            <div className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Industry</div>
            <div className="mt-1 text-sm font-bold text-neutral-300 truncate max-w-[180px]" title={profile.industry}>
              {profile.industry || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Profile Details */}
      <div className="mt-6 grid gap-4 border-t border-white/5 pt-6 sm:grid-cols-2 lg:grid-cols-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-neutral-500" />
          <span>CEO: <span className="font-semibold text-white">{profile.ceo || 'N/A'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-neutral-500" />
          <span>Employees: <span className="font-semibold text-white">{profile.employees ? formatNumber(profile.employees) : 'N/A'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-neutral-500" />
          <span>Headquarters: <span className="font-semibold text-white">{profile.headquarters || 'N/A'}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-neutral-500" />
          <a href={profile.website} target="_blank" rel="noreferrer" className="font-semibold text-blue-400 hover:underline">
            {profile.website ? new URL(profile.website).hostname : 'Website'}
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 border-t border-white/5 pt-6">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Business Summary</h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-400 max-h-24 overflow-y-auto">
          {profile.description || 'No summary available.'}
        </p>
      </div>
    </div>
  );
}
