"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { formatTransactionDate } from "../utils/transaction-utils";

interface AdminTransactionOrderInfoProps {
  transaction: {
    order?: {
      id: string;
      orderNumber: string;
      status: string;
      subtotal: string;
      deliveryFee: string | null;
      totalAmount: string;
      trackingNumber?: string | null;
      createdAt: string;
    } | null;
  };
}

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "refunded":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const AdminTransactionOrderInfo = ({
  transaction,
}: AdminTransactionOrderInfoProps) => {
  if (!transaction.order) {
    return (
      <Card className="gap-3 p-3">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2">
            <span>📦</span>
            Related Order
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="py-8 text-center">
            <div className="text-muted-foreground mb-2">
              No related order found
            </div>
            <p className="text-muted-foreground text-sm">
              This transaction may not be associated with an order, or the order
              may have been deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const order = transaction.order;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📦</span>
            Related Order
          </div>
          <Badge className={getOrderStatusColor(order.status)}>
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-0">
        <div className="space-y-3">
          {/* Order Number */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Order Number
            </label>
            <div className="flex items-center gap-2">
              <CopyableText text={order.orderNumber} />
              <Link
                href={`/admin/orders/${order.orderNumber}`}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                View Order
              </Link>
            </div>
          </div>

          {/* Tracking Number */}
          {order.trackingNumber && (
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-medium">
                Tracking Number
              </label>
              <CopyableText text={order.trackingNumber} />
            </div>
          )}
        </div>

        {/* Order Amounts */}
        <div className="space-y-3">
          <h4 className="font-medium">Order Amounts</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">Subtotal:</span>
              <span className="text-sm">
                {formatCurrency(parseFloat(order.subtotal), "NGN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-sm">
                Delivery Fee:
              </span>
              <span className="text-sm">
                {order.deliveryFee
                  ? formatCurrency(parseFloat(order.deliveryFee), "NGN")
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-medium">Total:</span>
              <span className="font-medium">
                {formatCurrency(parseFloat(order.totalAmount), "NGN")}
              </span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium">Order Timeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{formatTransactionDate(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
