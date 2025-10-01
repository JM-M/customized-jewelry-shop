"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";

export const InventoryAnalyticsView = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inventory Analytics"
        description="Monitor stock levels and inventory performance"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Inventory charts and metrics will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
