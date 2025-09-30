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

/**
 * Formats a number as currency with the specified currency code
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., "NGN", "USD", "EUR")
 * @param options - Optional formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN",
  options: {
    showDecimals?: boolean;
    compact?: boolean;
  } = {},
): string {
  const { showDecimals = false, compact = false } = options;

  if (compact && amount >= 1000000) {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }

  if (compact && amount >= 1000) {
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });

  return formatter.format(amount);
}

/**
 * Gets the currency symbol for a given currency code
 * @param currency - The currency code
 * @returns The currency symbol
 */
function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    GHS: "₵",
    ZAR: "R",
    KES: "KSh",
  };

  return symbols[currency] || currency;
}
