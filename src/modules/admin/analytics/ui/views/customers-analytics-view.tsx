"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { CustomerSourceCards } from "../components/customer-source-cards";
import { CustomerSourceChart } from "../components/customer-source-chart";

export const CustomersAnalyticsView = () => {
  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Customers Analytics"
        description="Understand customer behavior and demographics"
      />

      {/* Customer Source Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Customer Sources</h2>
        <CustomerSourceCards />
      </div>

      {/* Customer Source Distribution */}
      <div className="space-y-4">
        <CustomerSourceChart />
      </div>
    </div>
  );
};
