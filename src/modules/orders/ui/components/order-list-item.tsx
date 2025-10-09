import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { GetUserOrdersOutput } from "@/modules/orders/types";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

interface OrderListItemProps {
  order: GetUserOrdersOutput["items"][number];
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
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const OrderListItem = ({ order }: OrderListItemProps) => {
  const { orderNumber, status, totalAmount, createdAt, itemCount } = order;

  return (
    <Link href={`/orders/${orderNumber}`}>
      <Card className="cursor-pointer gap-2 p-4 shadow-none transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              #{orderNumber}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs font-medium ${getStatusColor(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
              <span className="text-xs text-gray-500">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-gray-900">
              {formatNaira(Number(totalAmount))}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-end gap-2">
            <CalendarDays className="size-4" />
            <span>Ordered on {formatDate(createdAt as string)}</span>
          </div>

          {/* {shippedAt && (
            <div className="flex items-center justify-end gap-2">
              <Truck className="size-4" />
              <span>Shipped on {formatDate(shippedAt as string)}</span>
            </div>
          )}

          {deliveredAt && (
            <div className="flex items-center justify-end gap-2">
              <Package className="size-4" />
              <span>Delivered on {formatDate(deliveredAt as string)}</span>
            </div>
          )}

          {trackingNumber && (
            <div className="flex items-center justify-end gap-2">
              <Package className="size-4" />
              <span>Tracking: {trackingNumber}</span>
            </div>
          )} */}
        </div>
      </Card>
    </Link>
  );
};
