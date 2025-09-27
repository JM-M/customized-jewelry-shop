import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { columns } from "./columns";

export const AdminCategoriesTable = () => {
  const trpc = useTRPC();
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery(trpc.categories.getParentCategories.queryOptions());

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600">
        Error loading categories data: {error.message}
      </div>
    );
  }

  const categories = categoriesData || [];

  return (
    <div>
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Filter by name..."
        pageSize={10}
      />
    </div>
  );
};
