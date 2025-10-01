"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";

export const OrdersAnalyticsView = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders Analytics"
        description="Analyze order patterns and processing metrics"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Orders charts and metrics will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
