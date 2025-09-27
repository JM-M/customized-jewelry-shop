import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";

import { AdminGetProductsOutput } from "@/modules/admin/products/types";
import { columns } from "./columns";

interface AdminProductsTableProps {
  data: AdminGetProductsOutput["items"];
  isLoading?: boolean;
  error?: unknown;
}

export const AdminProductsTable = ({
  data,
  isLoading = false,
  error = null,
}: AdminProductsTableProps) => {
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
        Error loading products data:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        pageSize={10}
      />
    </div>
  );
};
