"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { OrderSummaryCards } from "../components/order-summary-cards";
import { OrderVolumeChart } from "../components/order-volume-chart";

export const OrdersAnalyticsView = () => {
  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Orders Analytics"
        description="Analyze order patterns and processing metrics"
      />

      <div className="space-y-4">
        <OrderSummaryCards />
        <OrderVolumeChart />
      </div>
    </div>
  );
};
