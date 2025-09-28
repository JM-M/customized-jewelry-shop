"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  createSelectColumn,
  DateCell,
  SortableHeader,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PickupAddress } from "@/modules/terminal/types";
import { MoreHorizontal } from "lucide-react";

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

// Actions cell component
const PickupAddressActionsCell = ({
  pickupAddress,
  onMarkAsDefault,
  isMarkingAsDefault,
}: {
  pickupAddress: PickupAddress;
  onMarkAsDefault: (id: string) => void;
  isMarkingAsDefault: boolean;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(pickupAddress.id)}
        >
          Copy pickup address ID
        </DropdownMenuItem>
        {!pickupAddress.isDefault && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onMarkAsDefault(pickupAddress.id)}
              disabled={isMarkingAsDefault}
            >
              Mark as default
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>View details</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>
          Edit pickup address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}} className="text-red-600">
          Delete pickup address
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const createColumns = (
  onMarkAsDefault: (id: string) => void,
  isMarkingAsDefault: boolean,
): ColumnDef<PickupAddress>[] => [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <PickupAddressActionsCell
        pickupAddress={row.original}
        onMarkAsDefault={onMarkAsDefault}
        isMarkingAsDefault={isMarkingAsDefault}
      />
    ),
  },
];
