import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { GetUserOrderOutput } from "@/modules/orders/types";
import { CalendarDays, CreditCard, Package } from "lucide-react";

interface OrderInfoSectionProps {
  order: GetUserOrderOutput;
}

const getStatusColor = (status: string) => {
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

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const OrderInfoSection = ({ order }: OrderInfoSectionProps) => {
  const {
    orderNumber,
    status,
    subtotal,
    deliveryFee,
    totalAmount,
    paymentReference,
    trackingNumber,
    createdAt,
  } = order;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Order #{orderNumber}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-sm font-medium ${getStatusColor(status)}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Order Dates */}
        <div>
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-gray-400" strokeWidth={1.2} />
            <div>
              <p className="text-sm font-medium text-gray-900">Order Date</p>
              <p className="text-sm text-gray-600">
                {formatDate(createdAt as string)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment & Tracking Info */}
        <div>
          {paymentReference && (
            <div className="flex items-center gap-3">
              <CreditCard className="size-5 text-gray-400" strokeWidth={1.2} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Payment Reference
                </p>
                <CopyableText text={paymentReference} />
              </div>
            </div>
          )}
          {trackingNumber && (
            <div className="flex items-center gap-3">
              <Package className="size-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Tracking Number
                </p>
                <CopyableText text={trackingNumber} />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="border-t pt-3">
          <h4 className="mb-3 text-sm font-medium text-gray-900">
            Order Summary
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">
                {formatNaira(Number(subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">
                {formatNaira(Number(deliveryFee))}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                {formatNaira(Number(totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
