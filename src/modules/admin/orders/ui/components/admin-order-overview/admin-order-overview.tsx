"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import {
  CalendarDays,
  Clock,
  CreditCard,
  CreditCardIcon,
  Package,
} from "lucide-react";

import { AdminOrderDetails } from "../../../types";

interface AdminOrderOverviewProps {
  order: AdminOrderDetails;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return {
        variant: "secondary" as const,
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "confirmed":
      return {
        variant: "default" as const,
        label: "Confirmed",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "processing":
      return {
        variant: "default" as const,
        label: "Processing",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      };
    case "shipped":
      return {
        variant: "default" as const,
        label: "Shipped",
        color: "bg-indigo-100 text-indigo-800 border-indigo-200",
      };
    case "delivered":
      return {
        variant: "default" as const,
        label: "Delivered",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    case "cancelled":
      return {
        variant: "destructive" as const,
        label: "Cancelled",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    case "refunded":
      return {
        variant: "destructive" as const,
        label: "Refunded",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    default:
      return {
        variant: "secondary" as const,
        label: "Unknown",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
  }
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const AdminOrderOverview = ({ order }: AdminOrderOverviewProps) => {
  const statusConfig = getStatusConfig(order.status);

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="px-0">
        <div className="flex items-start justify-between">
          <CardTitle>
            <CopyableText
              text={order.orderNumber}
              className="text-lg font-medium text-gray-900"
            />
          </CardTitle>
          <Badge
            variant={statusConfig.variant}
            className={`font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-0">
        {/* Timeline */}
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-muted-foreground size-5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Order Date</p>
              <p className="text-muted-foreground text-sm">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-muted-foreground size-5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last Updated</p>
              <p className="text-muted-foreground text-sm">
                {formatDate(order.updatedAt)}
              </p>
            </div>
          </div>

          {order.shippedAt && (
            <div className="flex items-center gap-3">
              <Package className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Shipped</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(order.shippedAt)}
                </p>
              </div>
            </div>
          )}

          {order.deliveredAt && (
            <div className="flex items-center gap-3">
              <Package className="text-muted-foreground size-5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Delivered</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(order.deliveredAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Payment & Tracking */}
        <div className="grid grid-cols-1 gap-4">
          {order.status === "pending" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCardIcon className="text-muted-foreground size-4" />
                <p className="text-sm font-medium text-gray-900">
                  Fast Checkout Link
                </p>
              </div>
              <CopyableText
                text={`${process.env.NEXT_PUBLIC_WEBSITE_URL!}/checkout/fast/${order.orderNumber}`}
              />
            </div>
          )}

          {order.paymentReference && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground size-4" />
                <p className="text-sm font-medium text-gray-900">
                  Payment Reference
                </p>
              </div>
              <CopyableText text={order.paymentReference} />
            </div>
          )}

          {order.trackingNumber && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="text-muted-foreground size-4" />
                <p className="text-sm font-medium text-gray-900">
                  Tracking Number
                </p>
              </div>
              <CopyableText text={order.trackingNumber} />
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="border-t pt-4">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Order Summary
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatNaira(Number(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span className="font-medium text-gray-900">
                {formatNaira(Number(order.deliveryFee))}
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                {formatNaira(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
