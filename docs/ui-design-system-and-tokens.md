# Design System

> InvestIQ uses a dark-first design language built on TailwindCSS HSL variables, glassmorphic panels, and Framer Motion micro-animations. Every visual token is defined once and consumed everywhere.

---

## Color Palette

All colors are defined as HSL CSS variables in `globals.css` and mapped to Tailwind utility classes.

| CSS Variable | Tailwind Class | Hex Value | Usage |
|---|---|---|---|
| `--background` | `bg-background` | `#030303` | Base dark layout |
| `--foreground` | `text-foreground` | `#f8f9fa` | Primary text |
| `--primary` | `bg-primary` | `#0070f3` | Blue highlights, focus rings |
| `--accent` | `bg-accent` | `#7c3aed` | Purple AI highlights |
| `--border` | `border-border` | `rgba(255,255,255,0.08)` | Low-contrast dividers |
| `--invest` | `text-emerald-400` | `#10b981` | BUY verdict, positive signals |
| `--hold` | `text-amber-400` | `#f59e0b` | HOLD verdict, neutral signals |
| `--pass` | `text-red-500` | `#ef4444` | AVOID verdict, risk signals |

The three semantic tokens (`invest`, `hold`, `pass`) are investment-specific additions to the standard Shadcn token set. Their values are CSS variables, so the actual colors can be updated in one place without touching any component.

---

## Typography

- **Primary Font** — `Inter`, configured via `--font-sans` in Tailwind.
- **Monospace Font** — System monospace, used for pipeline logs and ticker badges.

| Scale | Size | Usage |
|---|---|---|
| `text-xs` | 12px | Card metadata, news details, timestamps |
| `text-sm` | 14px | Body paragraphs, navigation labels |
| `text-lg` | 18px | Section headers, subtitles |
| `text-2xl` | 24px | Page headings, company tickers |
| `text-4xl` / `text-5xl` | 36px / 48px | Hero slogans, score numerals |

---

## Spacing & Layout

- **Border Radius** — `var(--radius)` resolves to `0.75rem` (12px). Sub-panels use `0.5rem` (8px).
- **Grid Gap** — Section components use `gap-6` (24px) to preserve breathing room.

---

## Glassmorphic Cards

The signature visual treatment across all panels:

```css
background: rgba(10, 10, 10, 0.6);
backdrop-filter: blur(16px);
border: 1px solid rgba(255, 255, 255, 0.05);
```

---

## Animation Guidelines (Framer Motion)

| Animation | Configuration | Usage |
|---|---|---|
| Entry fade-in | `duration: 0.6s`, cubic-bezier `[0.16, 1, 0.3, 1]` | Page sections, cards |
| Layout transitions | Spring `stiffness: 200`, `damping: 25` | Panel resizing, drawer open/close |
| Score gauges | SVG `strokeDashoffset` animated from 0 to target | Circular score meters on viewport entry |
| Hero entrance | `scale: [0.95, 1]`, `y: [10, 0]` | Search bar, landing headline |
| Terminal rows | Slide-in with staggered delay | Pipeline progress log lines |
