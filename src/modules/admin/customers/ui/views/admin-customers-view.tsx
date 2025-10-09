"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";

import { AdminCustomersTable } from "../components/admin-customers-table";

export const AdminCustomersView = () => {
  const trpc = useTRPC();

  const { data: customersData, isLoading } = useQuery(
    trpc.admin.users.getUsers.queryOptions({
      cursor: 0,
      limit: 20,
    }),
  );

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Manage customer accounts and view customer information."
      />
      <div className="mt-6">
        <AdminCustomersTable
          data={customersData?.items || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
