import { DollarSign, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface RevenueCardProps {
  amount?: number;
  currency?: string;
  trend?: {
    percentage: number;
    period: string;
  };
}

export const RevenueCard = ({
  amount = 45231,
  currency = "₦",
  trend = {
    percentage: 20.1,
    period: "from yesterday",
  },
}: RevenueCardProps) => {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

  const isPositiveTrend = trend.percentage > 0;
  const trendColor = isPositiveTrend ? "text-green-600" : "text-red-600";
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingUp;

  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">
          Today{"'"}s Revenue
        </CardTitle>
        <DollarSign className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedAmount}</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground flex items-center space-x-1 text-xs">
          <TrendIcon className={`mr-1 h-3 w-3 ${trendColor}`} />
          <span className={trendColor}>
            {isPositiveTrend ? "+" : ""}
            {trend.percentage}%
          </span>
          <span>{trend.period}</span>
        </p>
        <Link
          href="/admin/analytics/revenue"
          className="text-sm hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};
