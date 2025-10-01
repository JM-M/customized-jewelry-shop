"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeType: "increase" | "decrease";
  icon?: React.ReactNode;
}

const MetricCard = ({
  title,
  value,
  change,
  changeType,
  icon,
}: MetricCardProps) => {
  const isPositive = changeType === "increase";
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-muted-foreground flex items-center space-x-1 text-xs">
          <ChangeIcon
            className={`h-3 w-3 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          />
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {Math.abs(change)}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export const OrderSummaryCards = () => {
  return (
    <div className="@container grid gap-4 @lg:grid-cols-3">
      <MetricCard
        title="Average Order Value"
        value="₦24,500"
        change={12.5}
        changeType="increase"
      />
      <MetricCard
        title="Total Orders"
        value="1,247"
        change={8.3}
        changeType="increase"
      />
      <MetricCard
        title="Repeat Orders"
        value="34.2%"
        change={2.1}
        changeType="decrease"
      />
    </div>
  );
};
