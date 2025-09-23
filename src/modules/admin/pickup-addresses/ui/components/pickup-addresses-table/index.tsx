import { DataTable } from "@/components/shared/data-table";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export const PickupAddressesTable = () => {
  const trpc = useTRPC();
  const {
    data: pickupAddressesData,
    isLoading,
    error,
  } = useQuery(
    trpc.terminal.getPickupAddresses.queryOptions({
      page: 1,
      limit: 20,
    }),
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading pickup addresses...
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-red-600">
        Error loading pickup addresses: {error.message}
      </div>
    );
  }

  if (!pickupAddressesData || pickupAddressesData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <p>
          No pickup addresses found. Create your first pickup address to get
          started.
        </p>

        <Button variant="ghost" asChild>
          <Link href="/admin/pickup-addresses/create">
            <PlusIcon className="size-4" />
            Create pickup address
          </Link>
        </Button>
      </div>
    );
  }

  const pickupAddresses = pickupAddressesData.items;

  return (
    <div>
      <DataTable
        columns={columns}
        data={pickupAddresses}
        searchKey="nickname"
        searchPlaceholder="Filter by nickname..."
        pageSize={10}
        emptyMessage="No pickup addresses found. Create your first pickup address to get started."
      />
    </div>
  );
};
