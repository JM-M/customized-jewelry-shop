"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { PickupAddressesTable } from "../components/pickup-addresses-table";

export const PickupAddressesView = () => {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pickup Addresses"
        description="Manage your pickup addresses"
      />
      <PickupAddressesTable />
    </div>
  );
};
