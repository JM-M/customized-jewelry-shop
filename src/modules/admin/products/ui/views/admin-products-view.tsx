"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { AdminProductsTable } from "../components/admin-products-table";

export const AdminProductsView = () => {
  const trpc = useTRPC();

  const {
    data: productsData,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.products.getProducts.queryOptions({
      cursor: 0,
      limit: 20,
    }),
  );

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your products and configurations."
      />
      <div className="mt-6">
        <AdminProductsTable
          data={productsData?.items || []}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};
