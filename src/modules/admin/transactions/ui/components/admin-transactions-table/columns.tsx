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
import { AdminGetTransactionsOutput } from "@/modules/admin/transactions/types";

type Transaction = AdminGetTransactionsOutput["items"][0];

const PaymentReferenceCell = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/admin/transactions/${transaction.paymentReference}`);
  };

  return (
    <div
      className="cursor-pointer font-medium transition-colors hover:text-blue-600 hover:underline"
      onClick={handleClick}
    >
      {transaction.paymentReference}
    </div>
  );
};

const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  const statusConfig = {
    pending: { variant: "secondary" as const, label: "Pending" },
    success: { variant: "default" as const, label: "Success" },
    failed: { variant: "destructive" as const, label: "Failed" },
    cancelled: { variant: "destructive" as const, label: "Cancelled" },
    refunded: { variant: "destructive" as const, label: "Refunded" },
    partially_refunded: {
      variant: "destructive" as const,
      label: "Partially Refunded",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  );
};

const CustomerInfoCell = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">
        {transaction.customerName || transaction.userName || "Unknown"}
      </div>
      <div className="text-muted-foreground text-sm">
        {transaction.customerEmail || transaction.userEmail}
      </div>
    </div>
  );
};

const PaymentMethodCell = ({ transaction }: { transaction: Transaction }) => {
  const { channel, cardType, bank, last4 } = transaction;

  if (channel === "card" && cardType && last4) {
    return (
      <div className="space-y-1">
        <div className="font-medium capitalize">{cardType}</div>
        <div className="text-muted-foreground text-sm">****{last4}</div>
      </div>
    );
  }

  if (channel === "bank" && bank) {
    return (
      <div className="space-y-1">
        <div className="font-medium capitalize">{channel}</div>
        <div className="text-muted-foreground text-sm">{bank}</div>
      </div>
    );
  }

  if (channel) {
    return (
      <div className="font-medium capitalize">{channel.replace("_", " ")}</div>
    );
  }

  return <span className="text-muted-foreground">-</span>;
};

const OrderNumberCell = ({ transaction }: { transaction: Transaction }) => {
  const router = useRouter();

  if (!transaction.orderNumber) {
    return <span className="text-muted-foreground">-</span>;
  }

  const handleClick = () => {
    router.push(`/admin/orders/${transaction.orderNumber}`);
  };

  return (
    <div
      className="cursor-pointer font-medium transition-colors hover:text-blue-600 hover:underline"
      onClick={handleClick}
    >
      {transaction.orderNumber}
    </div>
  );
};

export const columns: ColumnDef<Transaction>[] = [
  createSelectColumn<Transaction>(),
  {
    accessorKey: "paymentReference",
    header: ({ column }) => (
      <SortableHeader column={column}>Payment Reference</SortableHeader>
    ),
    cell: ({ row }) => <PaymentReferenceCell transaction={row.original} />,
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
    cell: ({ row }) => <CustomerInfoCell transaction={row.original} />,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <SortableHeader column={column}>Amount</SortableHeader>
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      const currency = row.original.currency;
      return (
        <div className="space-y-1">
          <PriceCell value={amount} />
          <div className="text-muted-foreground text-xs">{currency}</div>
        </div>
      );
    },
  },
  {
    id: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => <PaymentMethodCell transaction={row.original} />,
  },
  {
    accessorKey: "fees",
    header: ({ column }) => (
      <SortableHeader column={column}>Fees</SortableHeader>
    ),
    cell: ({ row }) => {
      const fees = row.getValue("fees") as string;
      return fees ? (
        <PriceCell value={fees} />
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => <OrderNumberCell transaction={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column}>Transaction Date</SortableHeader>
    ),
    cell: ({ row }) => <DateCell value={row.getValue("createdAt")} />,
  },
  createActionsColumn<Transaction>({
    actions: [
      {
        label: "Copy transaction ID",
        onClick: (transaction) => navigator.clipboard.writeText(transaction.id),
      },
      {
        label: "Copy payment reference",
        onClick: (transaction) =>
          navigator.clipboard.writeText(transaction.paymentReference),
        separator: true,
      },
      {
        label: "View details",
        onClick: () => {},
      },
      {
        label: "View order",
        onClick: (transaction) => {
          if (transaction.orderNumber) {
            window.open(`/admin/orders/${transaction.orderNumber}`, "_blank");
          }
        },
        separator: true,
      },
      {
        label: "Refund transaction",
        onClick: () => {},
        className: "text-red-600",
      },
    ],
  }),
];
