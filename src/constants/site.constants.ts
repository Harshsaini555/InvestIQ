export const SITE_NAME = 'AI Investment Research Agent';

export const SITE_DESCRIPTION =
  'Production-grade AI financial analyst. Enter a company name and get a full investment report in seconds.';

export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'Dashboard', href: '/dashboard' },
] as const;

export const RECOMMENDATION_LABELS = {
  INVEST: 'Invest',
  HOLD: 'Hold',
  PASS: 'Pass',
} as const;

export const FEATURE_FLAGS = {
  ENABLE_CHAT: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
} as const;
