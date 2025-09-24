"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { PackagingTable } from "../components/packaging-table";

export const PackagingView = () => {
  return (
    <div>
      <AdminPageHeader
        title="Packaging"
        description="Manage your packaging options and configurations."
      />
      <PackagingTable />
    </div>
  );
};
