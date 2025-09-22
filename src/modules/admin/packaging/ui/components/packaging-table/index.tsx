import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export const PackagingTable = () => {
  const trpc = useTRPC();
  const {
    data: packagingsData,
    isLoading,
    error,
  } = useQuery(
    trpc.terminal.getPackaging.queryOptions({
      perPage: 100, // Get more data for the table
      page: 1,
    }),
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600">
        Error loading packaging data: {error.message}
      </div>
    );
  }

  const packagings = packagingsData?.data?.packaging || [];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Packaging</h2>
        <p className="text-muted-foreground">
          Manage your packaging options and configurations.
        </p>
      </div>
      <DataTable
        columns={columns}
        data={packagings}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        pageSize={10}
      />
    </div>
  );
};
