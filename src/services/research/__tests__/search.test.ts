import { vi, describe, it, expect, beforeEach } from 'vitest';
import { resolveCompany } from '../company-resolver.service';
import { resolveCountry, searchCompanies } from '../company-search.service';

// Mock the company-search service
vi.mock('../company-search.service', async () => {
  const actual = await vi.importActual<typeof import('../company-search.service')>('../company-search.service');
  return {
    ...actual,
    searchCompanies: vi.fn(),
  };
});

describe('Company Search Resolver Fuzzy Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('resolveCountry', () => {
    it('should map major exchanges to their correct countries', () => {
      expect(resolveCountry('NMS')).toBe('United States');
      expect(resolveCountry('NYQ')).toBe('United States');
      expect(resolveCountry('NSI')).toBe('India');
      expect(resolveCountry('BOM')).toBe('India');
      expect(resolveCountry('LSE')).toBe('United Kingdom');
    });

    it('should fallback to United States for unknown exchange codes', () => {
      expect(resolveCountry('XYZ')).toBe('United States');
    });
  });

  describe('resolveCompany', () => {
    it('should return null for empty queries', async () => {
      const result = await resolveCompany('');
      expect(result).toBeNull();
    });

    it('should resolve exact symbol match with highest priority', async () => {
      const mockSuggestions = [
        { name: 'Apple Inc.', ticker: 'AAPL', exchange: 'NASDAQ', country: 'United States' },
        { name: 'Apples Corp', ticker: 'APPL', exchange: 'NYSE', country: 'United States' },
      ];
      vi.mocked(searchCompanies).mockResolvedValue({
        status: 'success',
        message: null,
        suggestions: mockSuggestions as any,
      });

      const result = await resolveCompany('AAPL');
      expect(result).toEqual(mockSuggestions[0]);
    });

    it('should resolve typos using Levenshtein distance matching', async () => {
      const mockSuggestions = [
        { name: 'Microsoft Corporation', ticker: 'MSFT', exchange: 'NASDAQ', country: 'United States' },
        { name: 'MicroStrategy Inc.', ticker: 'MSTR', exchange: 'NASDAQ', country: 'United States' },
      ];
      vi.mocked(searchCompanies).mockResolvedValue({
        status: 'success',
        message: null,
        suggestions: mockSuggestions as any,
      });

      // Query with typo "Microsft"
      const result = await resolveCompany('Microsft');
      expect(result?.ticker).toBe('MSFT');
    });

    it('should resolve lowercase queries case-insensitively', async () => {
      const mockSuggestions = [
        { name: 'Tesla Inc.', ticker: 'TSLA', exchange: 'NASDAQ', country: 'United States' },
      ];
      vi.mocked(searchCompanies).mockResolvedValue({
        status: 'success',
        message: null,
        suggestions: mockSuggestions as any,
      });

      const result = await resolveCompany('tesla');
      expect(result?.ticker).toBe('TSLA');
    });
  });
});
