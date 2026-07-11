import React, { useRef, useState, useEffect } from 'react';
import { useCompanySearch } from '@/hooks/use-company-search';
import CompanySearchDropdown from './CompanySearchDropdown';
import { type CompanySuggestion } from '@/types/research.types';
import { Search, X } from 'lucide-react';

interface CompanySearchProps {
  onSelectCompany: (company: CompanySuggestion) => void;
  disabled?: boolean;
}

export default function CompanySearch({ onSelectCompany, disabled = false }: CompanySearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { searchTerm, setSearchTerm, suggestions, isLoading, status, message } = useCompanySearch();

  // Reset selection index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Click outside listener to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 >= suggestions.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const selected = suggestions[selectedIndex];
          if (selected) handleSelect(selected);
        } else if (suggestions.length > 0) {
          const topMatch = suggestions[0];
          if (topMatch) handleSelect(topMatch);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (suggestion: CompanySuggestion) => {
    setSearchTerm('');
    setIsOpen(false);
    onSelectCompany(suggestion);
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`relative flex items-center p-1.5 rounded-xl border bg-neutral-900/60 shadow-2xl backdrop-blur-xl transition-all ${
          isOpen
            ? 'border-blue-500/40 ring-2 ring-blue-500/10'
            : 'border-white/10 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/10'
        }`}
      >
        <Search className="ml-3 h-5 w-5 text-neutral-500 shrink-0" />
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by company name or ticker (e.g. Apple, Tata, TSLA)..."
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-neutral-500 outline-none disabled:opacity-50"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls="company-suggestions-list"
        />

        {searchTerm.trim().length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-md text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 transition-colors mr-1 shrink-0"
            aria-label="Clear search input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <CompanySearchDropdown
        isOpen={isOpen && searchTerm.trim().length > 0}
        suggestions={suggestions}
        isLoading={isLoading}
        searchTerm={searchTerm}
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
        onHoverIndex={setSelectedIndex}
        status={status}
        message={message}
      />
    </div>
  );
}
