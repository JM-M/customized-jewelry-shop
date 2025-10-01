"use client";

import {
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderStatusCount {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
}

interface OrdersCardProps {
  count?: number;
  trend?: {
    percentage: number;
    period: string;
  };
  statusCounts?: OrderStatusCount;
  showPipeline?: boolean;
}

export const OrdersCard = ({
  count = 12,
  trend = {
    percentage: 15.3,
    period: "from yesterday",
  },
  statusCounts = {
    pending: 5,
    confirmed: 3,
    processing: 8,
    shipped: 12,
    delivered: 25,
  },
  showPipeline = true,
}: OrdersCardProps) => {
  const [isPipelineVisible, setIsPipelineVisible] = useState(showPipeline);

  const isPositiveTrend = trend.percentage > 0;
  const trendColor = isPositiveTrend ? "text-green-600" : "text-red-600";
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingUp;

  const togglePipeline = () => {
    setIsPipelineVisible(!isPipelineVisible);
  };

  const pipelineItems = [
    {
      status: "pending",
      count: statusCounts.pending,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
      label: "Pending",
    },
    {
      status: "confirmed",
      count: statusCounts.confirmed,
      icon: CheckCircle,
      color: "bg-blue-100 text-blue-600",
      label: "Confirmed",
    },
    {
      status: "processing",
      count: statusCounts.processing,
      icon: Package,
      color: "bg-purple-100 text-purple-600",
      label: "Processing",
    },
    {
      status: "shipped",
      count: statusCounts.shipped,
      icon: Truck,
      color: "bg-indigo-100 text-indigo-600",
      label: "Shipped",
    },
    {
      status: "delivered",
      count: statusCounts.delivered,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      label: "Delivered",
    },
  ];

  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
        <ShoppingBag className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        {isPipelineVisible && (
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              Order Pipeline
            </p>
            <div className="space-y-1">
              {pipelineItems.map((item, index) => (
                <div key={item.status} className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full ${item.color}`}
                        >
                          <item.icon className="h-3 w-3" />
                        </div>
                        {/* Connecting line to next item */}
                        {index < pipelineItems.length - 1 && (
                          <div className="absolute top-full left-1/2 h-4 w-px -translate-x-1/2 bg-gray-300" />
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs font-medium">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
        <button onClick={togglePipeline} className="text-sm hover:underline">
          {isPipelineVisible ? "Hide Pipeline" : "View Pipeline"}
        </button>
      </CardFooter>
    </Card>
  );
};
