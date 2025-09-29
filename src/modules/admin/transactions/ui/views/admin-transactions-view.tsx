"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";

import { AdminTransactionsTable } from "../components/admin-transactions-table";

export const AdminTransactionsView = () => {
  const trpc = useTRPC();

  const {
    data: transactionsData,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.transactions.getTransactions.queryOptions({
      cursor: 0,
      limit: 20,
    }),
  );

  return (
    <div>
      <AdminPageHeader
        title="Transactions"
        description="View and manage payment transactions."
      />
      <div className="mt-6 space-y-4">
        {/* <AdminTransactionsViewHeader /> */}
        <AdminTransactionsTable
          data={transactionsData?.items || []}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
