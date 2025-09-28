"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";

import { AdminOrdersTable } from "../components/admin-orders-table";

export const AdminOrdersView = () => {
  const trpc = useTRPC();

  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.orders.getOrders.queryOptions({
      cursor: 0,
      limit: 20,
    }),
  );

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="Manage and track customer orders."
      />
      <div className="mt-6">
        <AdminOrdersTable
          data={ordersData?.items || []}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
