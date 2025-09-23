"use client";

import { PageHeader } from "@/components/admin/shared/page-header";
import { PickupAddressesTable } from "../components/pickup-addresses-table";

export const PickupAddressesView = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Pickup Addresses"
        description="Manage your pickup addresses"
      />
      <PickupAddressesTable />
    </div>
  );
};
