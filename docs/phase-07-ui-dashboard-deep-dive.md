# Phase 07 — UI Layer & Interactive Dashboard

> A premium, production-grade frontend inspired by Perplexity AI, Linear, and Stripe. Built with Next.js 15, TailwindCSS, Framer Motion, and Recharts.

---

## Design Philosophy

| Principle | Implementation |
|---|---|
| Dark elegance | `#030303` base with `rgba(255,255,255,0.05)` borders |
| Glassmorphism | `backdrop-filter: blur(16px)` with gradient borders |
| Micro-animations | Framer Motion for all entrances, hovers, and transitions |
| Clean typography | Inter via `--font-sans`, monospace for logs and tickers |

---

## Component Architecture

```
src/features/
├── research/
│   └── components/
│       └── progress.tsx            # Pipeline stage tracker with terminal log
└── dashboard/
    └── components/
        ├── header.tsx              # Company name, price, sector, CEO, market cap
        ├── scores.tsx              # Circular SVG score meters, sub-score grid
        ├── financials.tsx          # Metric cards, Recharts area/bar charts
        ├── swot.tsx                # 2×2 SWOT quadrant grid
        ├── risks.tsx               # Color-coded risk category matrix
        └── competitors.tsx         # Peer comparison and threat level table

src/components/layout/
├── Navbar.tsx
└── Footer.tsx

src/app/
├── (marketing)/                    # Landing page with search and animated background
└── research/                       # Dashboard workspace route
```

---

## Animation Strategy

| Element | Framer Motion Configuration |
|---|---|
| Hero & search entrance | `scale: [0.95, 1]`, `y: [10, 0]`, spring easing |
| Page section fade-in | `duration: 0.6s`, cubic-bezier `[0.16, 1, 0.3, 1]` |
| Circular score gauge | `strokeDashoffset` animated from circumference to target value |
| Terminal log rows | Slide-in with staggered delay per row |

---

## Key Technical Decisions

**Recharts SSR Handling**
All charts are wrapped in `<ResponsiveContainer height="100%" width="100%">` and rendered only after client mounting. Recharts relies on browser DOM sizing calculations that fail during Next.js SSR passes.

**Casing Standardization**
All imports use exact file system casing (`@/components/layout/Footer`, not `footer`). Windows masks casing bugs that surface on Vercel/Linux builds.

**Competitor Metric Mapping**
Yahoo Finance competitor objects do not carry a native P/E ratio. Real ticker values are mapped directly for display rather than introducing database overhead.

---

## Accessibility

- ARIA roles and labels on all interactive elements
- Semantic HTML (`header`, `main`, `footer`, `section`, `table`)
- Color contrast compliant with dark mode WCAG guidelines
- Keyboard-navigable search inputs

---

## Verification

| Check | Result |
|---|---|
| `npm run type-check` | ✅ Exit code 0, 0 errors |
| `npx vitest run` | ✅ 19/19 tests passing |
