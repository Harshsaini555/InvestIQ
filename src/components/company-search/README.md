# Company Search Autocomplete & Ticker Resolver

A production-grade, Google Finance / TradingView style intelligent company search autocomplete dropdown and fuzzy ticker resolver.

This feature allows users to type natural language company names (e.g. "Apple", "Tata", "Reliance", "MRF") instead of exact stock tickers, fuzzy-resolving spelling mistakes (e.g. "Googel" or "Microsft") to active stock tickers globally.

---

## 🏗️ Architecture Layout

```
src/
├── app/
│   └── api/
│       └── company/
│           ├── search/
│           │   └── route.ts         # GET /api/company/search?q=<query>
│           └── quote/
│               └── route.ts         # GET /api/company/quote?ticker=<symbol>
├── services/
│   └── research/
│       ├── company-search.service.ts   # Yahoo Finance search & country mapper
│       └── company-resolver.service.ts # Fuzzy Levenshtein ranking resolver
├── hooks/
│   └── use-company-search.ts        # TanStack Query cache & debounce hook
├── components/
│   └── company-search/
│       ├── CompanySearch.tsx        # Search bar wrapper & keybindings handler
│       ├── CompanySearchDropdown.tsx# Dropdown popup overlay container
│       ├── CompanySearchResult.tsx  # Suggestion list item with match highlighter
│       ├── CompanyPreviewCard.tsx   # Detailed quote metrics & validation display
│       ├── LoadingState.tsx         # Dropdown shimmer skeleton item loaders
│       └── EmptyState.tsx           # Dropdown empty result overlay
```

---

## ⚙️ Core Modules & Logic

### 1. Fuzzy Ticker Resolver (`company-resolver.service.ts`)
Uses a hybrid **Levenshtein Distance** and **Substring Containment** algorithm to score matching candidates (lower scores represent higher relevance):
1. **Exact Symbol Match**: Score = `0.00`
2. **Exact Name Match**: Score = `0.05`
3. **Symbol Substring**: Score based on length difference (`0.10 - 0.20`)
4. **Name Substring**: Score based on word placement (`0.20 - 0.50`)
5. **Fuzzy Typo Distance**: Calculates Levenshtein edits on name, symbol, and individual words. Penalizes if the distance is too large relative to the query length.
6. **Primary Exchange Boost**: Sorts candidates that trade on major primary exchanges (`NASDAQ`, `NYSE`, `NSE`, `BSE`) above OTC or obscure exchanges.

### 2. Caching Hook (`use-company-search.ts`)
- **Debouncing**: Updates search query after `300ms` of user typing inactivity to minimize server load.
- **TanStack Caching**: Caches recent search suggestion results for **5 minutes** (`staleTime: 300000`).
- **Request Cancellation**: Automatically passes the AbortController `signal` from TanStack Query to the fetch request, cancelling outstanding requests when input changes mid-flight.

### 3. Quote Metrics API (`/api/company/quote`)
Fetches basic metrics (`price`, `changePercent`, `marketCap`, `fiftyTwoWeekHigh`, `fiftyTwoWeekLow`, `description`) in `<500ms` using `yahoo-finance2.quote()` and `quoteSummary()`. This feeds the preview card without running the heavy LangGraph research workflow.

### 4. Preview Card Validation (`CompanyPreviewCard.tsx`)
- Detects if the stock has no pricing data (e.g. `price <= 0`, common on obsolete mutual funds like `MRF` vs active equity `MRF.NS`).
- Displays a warning informing the user to query active symbols (e.g. `MRF.NS` or `TATAMOTORS.NS`).
- Disables the **Start AI Research** button to prevent backend validation crashes.

---

## 🧪 Tests

Run the test suite to verify the resolver rules:
```bash
npx vitest run
```
Test cases cover:
- Typos matching (e.g. `Microsft` -> resolves to `MSFT`, `tesla` -> `TSLA`).
- Country exchange resolves.
- Exact symbol priority checks.
