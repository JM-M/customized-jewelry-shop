import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";

import { AdminGetTransactionsOutput } from "@/modules/admin/transactions/types";
import { columns } from "./columns";

interface AdminTransactionsTableProps {
  data: AdminGetTransactionsOutput["items"];
  isLoading?: boolean;
  error?: unknown;
}

export const AdminTransactionsTable = ({
  data,
  isLoading = false,
  error = null,
}: AdminTransactionsTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600">
        Error loading transactions data:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="paymentReference"
        searchPlaceholder="Filter by payment reference..."
        pageSize={10}
      />
    </div>
  );
};
