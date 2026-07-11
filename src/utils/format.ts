/* ── Currency ──────────────────────────────────────────────── */

/**
 * Formats a number as USD currency.
 * @example formatCurrency(1234567) → '$1,234,567.00'
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats large numbers with compact notation.
 * @example formatMarketCap(1_500_000_000) → '$1.5B'
 */
export function formatMarketCap(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

/* ── Percentage ────────────────────────────────────────────── */

/**
 * Formats a decimal as a percentage string.
 * @example formatPercent(0.1523) → '15.23%'
 */
export function formatPercent(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/* ── Numbers ───────────────────────────────────────────────── */

/**
 * Formats a number with thousand separators.
 * @example formatNumber(1234567.89) → '1,234,567.89'
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/* ── Dates ─────────────────────────────────────────────────── */

/**
 * Formats a date to a readable string.
 * @example formatDate(new Date()) → 'Jan 15, 2025'
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

/**
 * Returns a relative time string.
 * @example formatRelativeTime(new Date(Date.now() - 3600000)) → '1 hour ago'
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

/* ── Strings ───────────────────────────────────────────────── */

/**
 * Truncates a string to a max length with ellipsis.
 * @example truncate('Hello World', 8) → 'Hello...'
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitalizes the first letter of a string.
 * @example capitalize('invest') → 'Invest'
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
