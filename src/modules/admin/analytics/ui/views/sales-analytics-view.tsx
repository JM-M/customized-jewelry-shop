"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { RevenueTrendChart } from "../components/revenue-trend-chart";

export const SalesAnalyticsView = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sales Analytics"
        description="Track sales performance and revenue trends"
      />

      <div className="grid gap-6">
        <RevenueTrendChart />
      </div>
    </div>
  );
};
