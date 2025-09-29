import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";

import { AdminGetOrdersOutput } from "@/modules/admin/orders/types";
import { columns } from "./columns";

interface AdminOrdersTableProps {
  data: AdminGetOrdersOutput["items"];
  isLoading?: boolean;
  error?: unknown;
}

export const AdminOrdersTable = ({
  data,
  isLoading = false,
  error = null,
}: AdminOrdersTableProps) => {
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
        Error loading orders data:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <div>
      {/* TODO: Add date range filter */}
      <DataTable
        columns={columns}
        data={data}
        searchKey="orderNumber"
        searchPlaceholder="Filter by order number..."
        pageSize={10}
      />
    </div>
  );
};
