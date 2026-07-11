import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CompanySuggestion } from '@/types/research.types';
import { Info, HelpCircle } from 'lucide-react';
import LoadingState from './LoadingState';
import EmptyState from './EmptyState';
import CompanySearchResult from './CompanySearchResult';

interface CompanySearchDropdownProps {
  isOpen: boolean;
  suggestions: CompanySuggestion[];
  isLoading: boolean;
  searchTerm: string;
  selectedIndex: number;
  onSelect: (suggestion: CompanySuggestion) => void;
  onHoverIndex: (index: number) => void;
  status: 'success' | 'not_found' | 'ambiguous' | 'private';
  message: string | null;
}

export default function CompanySearchDropdown({
  isOpen,
  suggestions,
  isLoading,
  searchTerm,
  selectedIndex,
  onSelect,
  onHoverIndex,
  status,
  message,
}: CompanySearchDropdownProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.99 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950/95 shadow-2xl shadow-black/80 backdrop-blur-2xl max-h-[320px] overflow-y-auto"
        role="listbox"
        aria-label="Company suggestions"
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <div className="flex flex-col">
            {/* Status alerts */}
            {status === 'private' && message && (
              <div className="flex items-start gap-2.5 bg-amber-500/10 border-b border-white/5 p-3.5 text-xs text-amber-400">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">{message}</p>
                  <p className="text-[10px] text-neutral-400">
                    Try searching for these publicly traded alternatives:
                  </p>
                </div>
              </div>
            )}

            {status === 'ambiguous' && message && (
              <div className="flex items-start gap-2.5 bg-blue-500/10 border-b border-white/5 p-3.5 text-xs text-blue-400">
                <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="font-semibold">{message}</p>
              </div>
            )}

            {suggestions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="p-1.5 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <CompanySearchResult
                    key={suggestion.ticker}
                    suggestion={suggestion}
                    searchTerm={searchTerm}
                    isSelected={index === selectedIndex}
                    onSelect={() => onSelect(suggestion)}
                    onHover={() => onHoverIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
