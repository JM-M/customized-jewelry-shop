import { AlertTriangle, TrendingDown } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LowStockProductsProps {
  outOfStock?: number;
  lowStock?: number;
}

export const LowStockProducts = ({
  outOfStock = 2,
  lowStock = 8,
}: LowStockProductsProps) => {
  const totalLowStock = outOfStock + lowStock;
  const trendPercentage = -12.5; // Example negative trend
  const isNegativeTrend = trendPercentage < 0;
  const trendColor = isNegativeTrend ? "text-red-600" : "text-green-600";

  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
        <AlertTriangle className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalLowStock}</div>
        <div className="text-muted-foreground mt-1 text-xs">
          {outOfStock} out of stock, {lowStock} low stock
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground flex items-center space-x-1 text-xs">
          <TrendingDown className={`mr-1 h-3 w-3 ${trendColor}`} />
          <span className={trendColor}>
            {isNegativeTrend ? "" : "+"}
            {trendPercentage}%
          </span>
          <span>from last week</span>
        </p>
        <button className="text-sm hover:underline">Manage</button>
      </CardFooter>
    </Card>
  );
};
