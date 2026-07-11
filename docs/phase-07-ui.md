# UI Layer Architecture & Implementation (Phase 07)

We have built a premium, production-grade frontend interface inspired by industry-leading tools like Perplexity AI, Linear, and Stripe.

---

## 1. Design Philosophy
- **Dark Elegance**: Deep background contrast (`#030303`) with subtle border separators (`rgba(255, 255, 255, 0.05)`) to minimize visual noise.
- **Glassmorphism**: Backdrop blur configurations (`blur(16px)`) with gradient borders simulate floating panels.
- **Micro-Animations**: Uses Framer Motion for entrance, hovering, and transitions.
- **Clean Typography**: Uses Inter configured via Tailwind fonts (`--font-sans`).

---

## 2. Component Architecture

We established a modular directory pattern under `src/features/` and `src/components/`:

### Key Modular Components
- **Navbar & Footer** (`src/components/layout/`): Handles persistent branding and routing actions.
- **Landing Page** (`src/app/(marketing)/`): Premium search bar, background glows, and example ticker triggers.
- **Pipeline Progress Tracker** (`src/features/research/components/progress.tsx`): Renders checkmarks, spin indicators, and an active console terminal.
- **Company Header** (`src/features/dashboard/components/header.tsx`): Displays stock price, description, CEO, and statistics.
- **Scores Card Grid** (`src/features/dashboard/components/scores.tsx`): Renders SVG gauges, investment scores, and confidence.
- **Financial Performance** (`src/features/dashboard/components/financials.tsx`): Metric cards and responsive Recharts.
- **SWOT Card Grid** (`src/features/dashboard/components/swot.tsx`): A 2x2 grid representing Strengths, Weaknesses, Opportunities, and Threats.
- **Risk Profile Grid** (`src/features/dashboard/components/risks.tsx`): Color-coded warnings for risk categories.
- **Competitors Matrix** (`src/features/dashboard/components/competitors.tsx`): Peer comparison and threat level matrix.
- **AI Chat Panel** (`src/features/chat/components/chat-panel.tsx`): Interactive co-pilot.

---

## 3. Animation Strategy
We leverage **Framer Motion** for premium micro-animations:
- **Hero & Search Entrance**: Gentle spring-back scale-ups on inputs (`scale: [0.95, 1]`, `y: [10, 0]`).
- **Circular Gauge Progress**: Smooth SVGs animating the circle outline (`strokeDashoffset`).
- **Metric Loaders**: Bar chart loading animations.
- **Terminal Log Rows**: Slide-in transitions for terminal outputs.

---

## 4. Accessibility (a11y)
- **ARIA Roles & Labels**: Appropriate keyboard forms and ARIA inputs for search fields.
- **Semantic Tags**: Semantic layouts (`header`, `main`, `footer`, `section`, `table`).
- **Color Contrast**: Complies with dark mode constraints.

---

## 5. Performance
- **Client/Server Splitting**: Routes use client-side hydration only for interactive elements, while wrappers render statically.
- **Recharts Optimization**: Encapsulated within `ResponsiveContainer` components to avoid resizing layouts.
- **Asset Minimization**: Exclusively uses light-weight vector icons.
