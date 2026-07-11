import React from 'react';
import { type CompanySuggestion } from '@/types/research.types';

interface CompanySearchResultProps {
  suggestion: CompanySuggestion;
  searchTerm: string;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

/**
 * Highlights matching search substrings using case-insensitive regex splits.
 */
function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <span>{text}</span>;

  // Escape regex characters
  const escaped = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-blue-500/20 text-blue-400 font-semibold px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function CompanySearchResult({
  suggestion,
  searchTerm,
  isSelected,
  onSelect,
  onHover,
}: CompanySearchResultProps) {
  // Resolve a beautiful colored indicator for different exchanges
  const getExchangeColor = (exchange: string) => {
    const ex = exchange.toUpperCase();
    if (ex.includes('NASDAQ') || ex.includes('NMS')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (ex.includes('NYSE') || ex.includes('NYQ')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    if (ex.includes('NSE') || ex.includes('BOM')) return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
  };

  // Helper to fetch flag emojis for major resolved countries
  const getCountryEmoji = (country: string) => {
    switch (country) {
      case 'United States': return '🇺🇸';
      case 'India': return '🇮🇳';
      case 'United Kingdom': return '🇬🇧';
      case 'Canada': return '🇨🇦';
      case 'Australia': return '🇦🇺';
      case 'Germany': return '🇩🇪';
      case 'France': return '🇫🇷';
      case 'Japan': return '🇯🇵';
      case 'China': return '🇨🇳';
      case 'Hong Kong': return '🇭🇰';
      default: return '🌐';
    }
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onHover}
      role="option"
      aria-selected={isSelected}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-left border transition-all duration-150 ${
        isSelected
          ? 'bg-blue-600/10 border-blue-500/30 shadow-md shadow-blue-900/5'
          : 'bg-transparent border-transparent hover:bg-neutral-900/40 hover:border-white/5'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo or Placeholder Globe */}
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 border border-white/5 text-xs select-none">
          {suggestion.logoUrl ? (
            <img
              src={suggestion.logoUrl}
              alt=""
              onError={(e) => {
                // Fallback to Globe if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="h-4 w-4 object-contain"
            />
          ) : (
            <span className="text-neutral-500 font-bold">{suggestion.ticker.slice(0, 2)}</span>
          )}
        </div>

        {/* Company Details */}
        <div className="min-w-0">
          <p className="text-xs font-medium text-white truncate max-w-[280px]">
            <HighlightedText text={suggestion.name} highlight={searchTerm} />
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
            <span className="flex items-center gap-0.5">
              <span>{getCountryEmoji(suggestion.country)}</span>
              <span>{suggestion.country}</span>
            </span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{suggestion.industry}</span>
          </div>
        </div>
      </div>

      {/* Ticker & Exchange Badges */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase ${getExchangeColor(suggestion.exchange)}`}>
          {suggestion.exchange.split(' ')[0]}
        </span>
        <span className="text-xs font-bold text-neutral-300">
          <HighlightedText text={suggestion.ticker} highlight={searchTerm} />
        </span>
      </div>
    </button>
  );
}
