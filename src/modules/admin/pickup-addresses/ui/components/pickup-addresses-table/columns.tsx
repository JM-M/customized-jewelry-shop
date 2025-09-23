"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  SortableHeader,
} from "@/components/shared";
import { PickupAddress } from "@/modules/terminal/types";

const AddressCell = ({ pickupAddress }: { pickupAddress: PickupAddress }) => {
  const address = pickupAddress.terminalAddress;
  if (!address) return <span className="text-gray-500">No address data</span>;

  return (
    <div className="space-y-1">
      <div className="font-medium">
        {address.name ||
          `${address.first_name || ""} ${address.last_name || ""}`.trim() ||
          "Unnamed Address"}
      </div>
      <div className="text-sm text-gray-600">
        {address.line1 && <div>{address.line1}</div>}
        {address.line2 && <div>{address.line2}</div>}
        <div>
          {address.city}, {address.state} {address.zip}
        </div>
        <div>{address.country}</div>
      </div>
    </div>
  );
};

const DefaultCell = ({ isDefault }: { isDefault: boolean }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        isDefault ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {isDefault ? "Default" : "Not Default"}
    </span>
  );
};

export const columns: ColumnDef<PickupAddress>[] = [
  createSelectColumn<PickupAddress>(),
  {
    accessorKey: "nickname",
    header: ({ column }) => (
      <SortableHeader column={column}>Nickname</SortableHeader>
    ),
    cell: ({ row }) => {
      const nickname = row.getValue("nickname") as string;
      return (
        <div className="font-medium">
          {nickname || (
            <span className="text-gray-500 italic">No nickname</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "terminalAddress",
    header: "Address",
    cell: ({ row }) => <AddressCell pickupAddress={row.original} />,
  },
  {
    accessorKey: "isDefault",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => <DefaultCell isDefault={row.getValue("isDefault")} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Created</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<PickupAddress>({
    actions: [
      {
        label: "Copy pickup address ID",
        onClick: (pickupAddress) =>
          navigator.clipboard.writeText(pickupAddress.id),
      },
      {
        label: "View details",
        onClick: () => {},
        separator: true,
      },
      {
        label: "Edit pickup address",
        onClick: () => {},
      },
      {
        label: "Delete pickup address",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];
