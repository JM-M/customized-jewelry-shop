"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  CheckCircle,
  Copy,
  Edit,
  Mail,
  MessageSquare,
  Package,
  RefreshCw,
  Truck,
  XCircle,
} from "lucide-react";

import { AdminOrderDetails } from "../../types";

interface AdminOrderActionsProps {
  order: AdminOrderDetails;
}

const getStatusActions = (status: string) => {
  switch (status) {
    case "pending":
      return [
        {
          label: "Confirm Order",
          icon: CheckCircle,
          variant: "default" as const,
        },
        {
          label: "Cancel Order",
          icon: XCircle,
          variant: "destructive" as const,
        },
      ];
    case "confirmed":
      return [
        {
          label: "Start Processing",
          icon: Package,
          variant: "default" as const,
        },
        {
          label: "Cancel Order",
          icon: XCircle,
          variant: "destructive" as const,
        },
      ];
    case "processing":
      return [
        { label: "Mark as Shipped", icon: Truck, variant: "default" as const },
        {
          label: "Cancel Order",
          icon: XCircle,
          variant: "destructive" as const,
        },
      ];
    case "shipped":
      return [
        {
          label: "Mark as Delivered",
          icon: CheckCircle,
          variant: "default" as const,
        },
        { label: "Update Tracking", icon: Edit, variant: "outline" as const },
      ];
    case "delivered":
      return [
        {
          label: "Process Refund",
          icon: RefreshCw,
          variant: "outline" as const,
        },
      ];
    case "cancelled":
    case "refunded":
      return [
        {
          label: "Restore Order",
          icon: RefreshCw,
          variant: "outline" as const,
        },
      ];
    default:
      return [];
  }
};

export const AdminOrderActions = ({ order }: AdminOrderActionsProps) => {
  const statusActions = getStatusActions(order.status);

  const handleStatusUpdate = (action: string) => {
    console.log(`Updating order ${order.orderNumber} to: ${action}`);
    // TODO: Implement status update logic
  };

  const handleCopyOrderInfo = () => {
    const orderInfo = `Order: ${order.orderNumber}\nStatus: ${order.status}\nID: ${order.id}`;
    navigator.clipboard.writeText(orderInfo);
  };

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Current Status</p>
            <Badge
              variant={
                order.status === "delivered"
                  ? "default"
                  : order.status === "shipped"
                    ? "default"
                    : order.status === "processing"
                      ? "secondary"
                      : order.status === "confirmed"
                        ? "secondary"
                        : order.status === "pending"
                          ? "secondary"
                          : "destructive"
              }
              className="capitalize"
            >
              {order.status}
            </Badge>
          </div>

          <Separator />

          {/* Status Actions */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Quick Actions</p>
            <div className="space-y-2">
              {statusActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => handleStatusUpdate(action.label)}
                >
                  <action.icon className="mr-2 size-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Tracking Management */}
          {order.status === "processing" || order.status === "shipped" ? (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">Tracking</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Edit className="mr-2 size-4" />
                  {order.trackingNumber
                    ? "Update Tracking Number"
                    : "Add Tracking Number"}
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Mail className="mr-2 size-4" />
            Send Email to Customer
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <MessageSquare className="mr-2 size-4" />
            Add Internal Note
          </Button>
        </CardContent>
      </Card>

      {/* Order Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Copy className="mr-2 size-4" />
            Copy Order Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleCopyOrderInfo}
          >
            <Copy className="mr-2 size-4" />
            Copy Order Summary
          </Button>
        </CardContent>
      </Card>

      {/* Alerts & Warnings */}
      {order.status === "pending" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-orange-900">
              <AlertTriangle className="size-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-800">
              This order is pending confirmation. Please review and confirm the
              order to proceed with processing.
            </p>
          </CardContent>
        </Card>
      )}

      {order.status === "processing" && !order.trackingNumber && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900">
              <Package className="size-5" />
              Ready for Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-800">
              Order is being processed. Add tracking information when ready to
              ship.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
