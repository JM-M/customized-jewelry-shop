"use client";

import { formatNaira } from "@/lib/utils";
import { format } from "date-fns";

interface PriceCellProps {
  value: string | number;
  className?: string;
}

export function PriceCell({
  value,
  className = "text-right font-medium",
}: PriceCellProps) {
  const price = parseFloat(value.toString());
  return <div className={className}>{formatNaira(price)}</div>;
}

interface StockCellProps {
  value: number;
  className?: string;
}

export function StockCell({
  value,
  className = "text-right font-medium",
}: StockCellProps) {
  const getStockColor = (stock: number) => {
    if (stock === 0) return "text-red-600";
    if (stock < 10) return "text-yellow-600";
    return "text-green-600";
  };

  return <div className={`${className} ${getStockColor(value)}`}>{value}</div>;
}

interface DateCellProps {
  value: Date | string;
  format?: string;
  className?: string;
}

export function DateCell({
  value,
  format: dateFormat = "MMM dd, yyyy",
  className = "text-sm",
}: DateCellProps) {
  const date = new Date(value);
  return <div className={className}>{format(date, dateFormat)}</div>;
}

interface SkuCellProps {
  value: string | null | undefined;
  fallback?: string;
  className?: string;
}

export function SkuCell({
  value,
  fallback = "No SKU",
  className = "text-muted-foreground text-sm",
}: SkuCellProps) {
  return <div className={className}>{value || fallback}</div>;
}
