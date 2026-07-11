import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes without conflicts.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * @example cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6') → 'py-2 bg-blue-500 px-6'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
