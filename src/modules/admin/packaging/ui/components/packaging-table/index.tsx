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
  // console.log(packagingsData);

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
