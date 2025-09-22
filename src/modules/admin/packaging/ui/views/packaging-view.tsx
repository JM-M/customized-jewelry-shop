"use client";

import { PageHeader } from "@/components/admin/shared/page-header";
import { PackagingTable } from "../components/packaging-table";

export const PackagingView = () => {
  return (
    <div>
      <PageHeader
        title="Packaging"
        description="Manage your packaging options and configurations."
      />
      <PackagingTable />
    </div>
  );
};
