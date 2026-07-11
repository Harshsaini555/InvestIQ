# Design System Specifications

This document outlines the visual guidelines, tokens, and styling standards for the InvestIQ Investment Intelligence platform.

---

## 1. Color Palette

We utilize HSL color variables mapped to custom theme classes in Tailwind:

| Variable | Class | Color | Purpose |
| --- | --- | --- | --- |
| `--background` | `bg-background` | `#030303` | Dark mode base layout |
| `--foreground` | `text-foreground`| `#f8f9fa` | Primary text output |
| `--primary` | `bg-primary` | `#0070f3` | Blue highlight / Focus rings |
| `--accent` | `bg-accent` | `#7c3aed` | Purple theme / AI highlights |
| `--border` | `border-border` | `rgba(255,255,255,0.08)` | Low-contrast delimiters |
| `--invest` | `text-emerald-400` | `#10b981` | Emerald Success (BUY verdict) |
| `--hold` | `text-amber-400` | `#f59e0b` | Amber Warning (HOLD verdict) |
| `--pass` | `text-red-500` | `#ef4444` | Red Danger (AVOID verdict) |

---

## 2. Typography

- **Primary Font**: `Inter`, configured via the Tailwind `font-sans` family.
- **Monospace Font**: System monospace, for coding logs and ticker badges.
- **Sizes**:
  - `text-xs` (12px) - Default for cards, news details, and summaries.
  - `text-sm` (14px) - Used for description paragraphs and navigation.
  - `text-lg` (18px) - Section headers and subtitles.
  - `text-2xl` (24px) - Page headings and company tickers.
  - `text-4xl` (36px) / `text-5xl` (48px) - Hero slogans and score counts.

---

## 3. Spacing & Borders

- **Border Radius**: Defined as `var(--radius)` which resolves to `0.75rem` (12px). Custom sub-panels use `0.5rem` (8px).
- **Grid Layouts**: Section components use `grid-gap` values of `6` (24px) to preserve white space.
- **Glassmorphic Cards**: Glass layouts are configured using:
  ```css
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  ```

---

## 4. Animation Guidelines (Framer Motion)

- **Entry Fade-in**: Uses duration of `0.6s` with a cubic-bezier timing curve of `[0.16, 1, 0.3, 1]` for ultra-smooth scaling.
- **Layout Transitions**: Layout animations are set to spring stiffness `200` and damping `25` to avoid elastic bounces.
- **Score Gauges**: Uses stroke offsets on SVG borders to animate progress from 0 to 100 during viewport entrance.
