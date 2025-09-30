"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { DataTable } from "@/components/shared/data-table";
import { AdminUser } from "@/modules/admin/customers/types";
import { useTRPC } from "@/trpc/client";

import { columns } from "./columns";

interface AdminCustomersTableProps {
  data: AdminUser[];
  isLoading?: boolean;
  error?: Error | null;
}

export const AdminCustomersTable = ({
  data,
  isLoading,
  error,
}: AdminCustomersTableProps) => {
  const trpc = useTRPC();
  const [search, setSearch] = useState("");

  const {
    data: customersData,
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery(
    trpc.admin.users.getUsers.queryOptions(
      {
        cursor: 0,
        limit: 100,
        search: search || undefined,
      },
      {
        enabled: !!search,
      },
    ),
  );

  const displayData = search ? customersData?.items || [] : data;
  const displayLoading = search ? isSearchLoading : isLoading;
  const displayError = search ? searchError : error;

  return (
    <DataTable
      columns={columns}
      data={displayData}
      searchPlaceholder="Search customers by name or email..."
    />
  );
};
