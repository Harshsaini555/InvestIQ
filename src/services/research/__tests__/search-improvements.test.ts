import { vi, describe, it, expect, beforeEach } from 'vitest';
import YahooFinance from 'yahoo-finance2';
import {
  searchCompanies,
  filterResults,
  normalizeResults,
} from '../company-search.service';

describe('Company Search Pipeline Enhancements', () => {
  let searchSpy: any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on the prototype method to intercept all search calls on YahooFinance instances
    searchSpy = vi.spyOn(YahooFinance.prototype, 'search');
  });

  describe('filterResults', () => {
    it('should only accept EQUITY quoteType', () => {
      const raw = [
        { symbol: 'AAPL', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'BTC-USD', quoteType: 'CRYPTOCURRENCY', isYahooFinance: true },
        { symbol: 'MUTF', quoteType: 'MUTUALFUND', isYahooFinance: true },
      ];
      const filtered = filterResults(raw);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.symbol).toBe('AAPL');
    });

    it('should reject private, delisted, and old symbols', () => {
      const raw = [
        { symbol: 'AAPL', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'OPAI.PVT', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'SPX.PRIVATE', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'XYZ.OLD', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'TEST.DELISTED', quoteType: 'EQUITY', isYahooFinance: true },
      ];
      const filtered = filterResults(raw);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.symbol).toBe('AAPL');
    });

    it('should reject non-tradable symbols (isYahooFinance === false)', () => {
      const raw = [
        { symbol: 'AAPL', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'INACT', quoteType: 'EQUITY', isYahooFinance: false },
      ];
      const filtered = filterResults(raw);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.symbol).toBe('AAPL');
    });

    it('should reject symbols whose names contain delisted/private keywords', () => {
      const raw = [
        { symbol: 'AAPL', longname: 'Apple Inc.', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'XYZ', longname: 'SpaceX Pre-IPO Placement', quoteType: 'EQUITY', isYahooFinance: true },
        { symbol: 'ABC', shortname: 'Delisted Company Inc', quoteType: 'EQUITY', isYahooFinance: true },
      ];
      const filtered = filterResults(raw);
      expect(filtered).toHaveLength(1);
      expect(filtered[0]!.symbol).toBe('AAPL');
    });
  });

  describe('normalizeResults', () => {
    it('should use "Unknown" default industry if unavailable', () => {
      const raw = [
        { symbol: 'AAPL', longname: 'Apple Inc.', exchange: 'NMS', quoteType: 'EQUITY', isYahooFinance: true },
      ];
      const normalized = normalizeResults(raw);
      expect(normalized[0]!.industry).toBe('Unknown');
    });
  });

  describe('searchCompanies Status Rules', () => {
    it('should return "not_found" for completely empty search results', async () => {
      searchSpy.mockResolvedValue({ quotes: [] });

      const response = await searchCompanies('xyz123abc');
      expect(response.status).toBe('not_found');
      expect(response.message).toContain('No companies found');
      expect(response.suggestions).toHaveLength(0);
    });

    it('should return "private" for companies with matches but no public equities', async () => {
      // Mock search results representing a private company like OpenAI
      searchSpy.mockResolvedValue({
        quotes: [
          { symbol: 'OPEAZZX', longname: 'OpenAI - Company Level', quoteType: 'MUTUALFUND', isYahooFinance: true },
          { symbol: 'OPENAI-USD', longname: 'OpenAI tokenized stock', quoteType: 'CRYPTOCURRENCY', isYahooFinance: true },
        ]
      });

      const response = await searchCompanies('OpenAI');
      expect(response.status).toBe('private');
      expect(response.message).toBe('This company is privately held and is not listed on a public stock exchange.');
      // Should return AI leader alternatives (like MSFT)
      expect(response.suggestions.some(s => s.ticker === 'MSFT')).toBe(true);
    });

    it('should return "private" for SpaceX aerospace queries', async () => {
      searchSpy.mockResolvedValue({
        quotes: [
          { symbol: 'SPACEX.PVT', longname: 'SpaceX Private', quoteType: 'EQUITY', isYahooFinance: true },
        ]
      });

      const response = await searchCompanies('SpaceX');
      expect(response.status).toBe('private');
      // Should return aerospace/founding alternatives (like TSLA or LMT)
      expect(response.suggestions.some(s => s.ticker === 'TSLA' || s.ticker === 'LMT')).toBe(true);
    });

    it('should return "success" for unique public equities like Apple, Google, Meta, Tesla', async () => {
      const testCases = [
        { query: 'Apple', ticker: 'AAPL', name: 'Apple Inc.' },
        { query: 'Google', ticker: 'GOOGL', name: 'Alphabet Inc.' },
        { query: 'Meta', ticker: 'META', name: 'Meta Platforms' },
        { query: 'Tesla', ticker: 'TSLA', name: 'Tesla, Inc.' },
      ];

      for (const tc of testCases) {
        searchSpy.mockResolvedValue({
          quotes: [
            { symbol: tc.ticker, longname: tc.name, exchange: 'NMS', quoteType: 'EQUITY', isYahooFinance: true },
          ]
        });

        const response = await searchCompanies(tc.query);
        expect(response.status).toBe('success');
        expect(response.suggestions[0]!.ticker).toBe(tc.ticker);
      }
    });

    it('should return "ambiguous" for queries matching multiple close public equities', async () => {
      // Mock ambiguous results for "Tata"
      searchSpy.mockResolvedValue({
        quotes: [
          { symbol: 'TATAMOTORS.NS', longname: 'Tata Motors Limited', exchange: 'NSI', quoteType: 'EQUITY', isYahooFinance: true },
          { symbol: 'TCS.NS', longname: 'Tata Consultancy Services', exchange: 'NSI', quoteType: 'EQUITY', isYahooFinance: true },
        ]
      });

      const response = await searchCompanies('Tata');
      expect(response.status).toBe('ambiguous');
      expect(response.message).toContain('Multiple matching companies found');
      expect(response.suggestions).toHaveLength(2);
    });

    it('should resolve MRF query successfully', async () => {
      searchSpy.mockResolvedValue({
        quotes: [
          { symbol: 'MRF.NS', longname: 'MRF Limited', exchange: 'NSI', quoteType: 'EQUITY', isYahooFinance: true },
        ]
      });

      const response = await searchCompanies('MRF');
      expect(response.status).toBe('success');
      expect(response.suggestions[0]!.ticker).toBe('MRF.NS');
    });
  });
});
