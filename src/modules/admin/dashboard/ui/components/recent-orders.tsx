"use client";

import { Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  createdAt: Date;
  itemCount: number;
}

interface RecentOrdersProps {
  orders?: RecentOrder[];
}

export const RecentOrders = ({
  orders = [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerName: "Sarah Johnson",
      totalAmount: 125000,
      status: "processing",
      createdAt: new Date("2024-01-15T10:30:00"),
      itemCount: 2,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerName: "Michael Brown",
      totalAmount: 89000,
      status: "confirmed",
      createdAt: new Date("2024-01-15T09:15:00"),
      itemCount: 1,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerName: "Emily Davis",
      totalAmount: 245000,
      status: "shipped",
      createdAt: new Date("2024-01-14T16:45:00"),
      itemCount: 3,
    },
    {
      id: "4",
      orderNumber: "ORD-2024-004",
      customerName: "David Wilson",
      totalAmount: 67000,
      status: "pending",
      createdAt: new Date("2024-01-14T14:20:00"),
      itemCount: 1,
    },
  ],
}: RecentOrdersProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="text-muted-foreground text-sm hover:underline"
        >
          View All
        </Link>
      </div>

      <div className="grid gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card hover:bg-muted/50 rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                  <ShoppingBag className="text-muted-foreground h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{order.orderNumber}</h4>
                  <p className="text-muted-foreground text-xs">
                    {order.customerName}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold">
                  {formatCurrency(order.totalAmount)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {formatDate(order.createdAt)}
                </div>
                <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <Link
                href={`/admin/orders/${order.id}`}
                className="text-primary text-xs hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
