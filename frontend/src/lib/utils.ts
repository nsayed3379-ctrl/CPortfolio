import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared form-field styling used by every form on the site (Contact, Quote,
// Career Application) so inputs, labels, and error text stay visually
// identical everywhere instead of drifting per component. Includes a
// visible focus-visible ring (not just a border-color change) to match the
// same keyboard-focus treatment used by .focus-ring elsewhere.
export const formInputClass =
  "focus-ring w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-paper)] placeholder:text-[var(--color-muted-2)] outline-none transition-colors focus:border-[var(--color-electric-soft)] disabled:opacity-50 disabled:pointer-events-none";
export const formLabelClass = "mb-2 block text-sm font-medium text-[var(--color-paper)]";
export const formErrorClass = "mt-1.5 text-xs text-red-400";
