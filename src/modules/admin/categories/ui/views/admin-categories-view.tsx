"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { AdminCategoriesTable } from "../components/admin-categories-table";

export const AdminCategoriesView = () => {
  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Manage your product categories and subcategories."
      />
      <AdminCategoriesTable />
    </div>
  );
};
