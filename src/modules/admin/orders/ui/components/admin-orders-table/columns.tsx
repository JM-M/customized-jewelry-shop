"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  createActionsColumn,
  createSelectColumn,
  DateCell,
  PriceCell,
  SortableHeader,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { AdminGetOrdersOutput } from "@/modules/admin/orders/types";

type Order = AdminGetOrdersOutput["items"][0];

const OrderNumberCell = ({ order }: { order: Order }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/orders/${order.orderNumber}`);
  };

  return (
    <div
      className="cursor-pointer font-medium transition-colors hover:text-blue-600 hover:underline"
      onClick={handleClick}
    >
      {order.orderNumber}
    </div>
  );
};

const StatusBadge = ({ status }: { status: Order["status"] }) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, label: "Pending" },
    confirmed: { variant: "default" as const, label: "Confirmed" },
    processing: { variant: "default" as const, label: "Processing" },
    shipped: { variant: "default" as const, label: "Shipped" },
    delivered: { variant: "default" as const, label: "Delivered" },
    cancelled: { variant: "destructive" as const, label: "Cancelled" },
    refunded: { variant: "destructive" as const, label: "Refunded" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
};

const UserInfoCell = ({ order }: { order: Order }) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">{order.userName || "Unknown User"}</div>
      <div className="text-muted-foreground text-sm">{order.userEmail}</div>
    </div>
  );
};

export const columns: ColumnDef<Order>[] = [
  createSelectColumn<Order>(),
  {
    accessorKey: "orderNumber",
    header: ({ column }) => (
      <SortableHeader column={column}>Order Number</SortableHeader>
    ),
    cell: ({ row }) => <OrderNumberCell order={row.original} />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => <UserInfoCell order={row.original} />,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <SortableHeader column={column}>Total</SortableHeader>
    ),
    cell: ({ row }) => <PriceCell value={row.getValue("totalAmount")} />,
  },
  {
    accessorKey: "itemCount",
    header: ({ column }) => (
      <SortableHeader column={column}>Items</SortableHeader>
    ),
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {row.getValue("itemCount") || 0}
      </div>
    ),
  },
  {
    accessorKey: "trackingNumber",
    header: "Tracking",
    cell: ({ row }) => {
      const trackingNumber = row.getValue("trackingNumber") as string;
      return trackingNumber ? (
        <div className="font-mono text-sm">{trackingNumber}</div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Order Date</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<Order>({
    actions: [
      {
        label: "Copy order ID",
        onClick: (order) => navigator.clipboard.writeText(order.id),
      },
      {
        label: "Copy order number",
        onClick: (order) => navigator.clipboard.writeText(order.orderNumber),
        separator: true,
      },
      {
        label: "View details",
        onClick: () => {},
      },
      {
        label: "Update status",
        onClick: () => {},
      },
      {
        label: "View customer",
        onClick: () => {},
        separator: true,
      },
      {
        label: "Cancel order",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];
