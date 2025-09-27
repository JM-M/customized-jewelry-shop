"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BarChart3, DollarSign, Package, Package2 } from "lucide-react";

interface CategoryStatsDashboardProps {
  categoryId: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <Card className="gap-0 p-3">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 pb-1">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent className="px-0">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export const CategoryStatsDashboard = ({
  categoryId,
}: CategoryStatsDashboardProps) => {
  const trpc = useTRPC();

  const { data: stats } = useSuspenseQuery(
    trpc.categories.getCategoryStats.queryOptions({ categoryId }),
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="grid grid-cols-2 gap-4 @xl:grid-cols-4">
      <StatCard
        title="Total Products"
        value={formatNumber(stats.totalProducts)}
        icon={Package}
      />

      <StatCard
        title="Subcategories"
        value={formatNumber(stats.subcategoriesCount)}
        icon={Package2}
      />

      <StatCard
        title="Total Stock"
        value={formatNumber(stats.totalStock)}
        icon={BarChart3}
      />

      <StatCard
        title="Average Price"
        value={formatPrice(stats.averagePrice)}
        icon={DollarSign}
      />
    </div>
  );
};
