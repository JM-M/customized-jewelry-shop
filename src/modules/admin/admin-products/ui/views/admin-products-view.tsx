"use client";

import { PageHeader } from "@/components/admin/shared/page-header";
import { AdminProductsTable } from "../components/admin-products-table";

export const AdminProductsView = () => {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your products and configurations."
      />
      <div className="mt-6">
        <AdminProductsTable />
      </div>
    </div>
  );
};
