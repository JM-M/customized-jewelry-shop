import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export const AdminProductsTable = () => {
  const trpc = useTRPC();
  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery(
    trpc.adminProducts.getProducts.queryOptions({
      cursor: 0,
      limit: 20,
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
        Error loading products data: {error.message}
      </div>
    );
  }

  const products = productsData?.items || [];

  return (
    <div>
      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        pageSize={10}
      />
    </div>
  );
};
