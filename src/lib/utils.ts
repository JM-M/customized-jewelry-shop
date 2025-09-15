import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string (e.g., "₦1,500.00")
 */
export function formatNaira(
  amount: number,
  options: {
    showDecimals?: boolean;
    compact?: boolean;
  } = {},
): string {
  const { showDecimals = false, compact = false } = options;

  if (compact && amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }

  if (compact && amount >= 1000) {
    return `₦${(amount / 1000).toFixed(1)}K`;
  }

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}
