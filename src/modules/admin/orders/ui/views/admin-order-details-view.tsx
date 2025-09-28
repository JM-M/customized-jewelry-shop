"use client";

import { AdminPageHeader } from "@/components/admin/shared/page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { useParams } from "next/navigation";
import { AdminOrderCustomerInfo } from "../components/admin-order-customer-info";
import { AdminOrderItems } from "../components/admin-order-items";
import { AdminOrderOverview } from "../components/admin-order-overview";
import { AdminOrderShippingInfo } from "../components/admin-order-shipping-info";

export const AdminOrderDetailsView = () => {
  const { orderNumber } = useParams();
  const trpc = useTRPC();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.orders.getOrder.queryOptions({
      orderNumber: orderNumber as string,
    }),
  );

  if (isLoading) {
    return (
      <div>
        <AdminPageHeader
          title={`Order ${orderNumber}`}
          description="View and manage order details."
        />
        <div className="mt-6 flex items-center justify-center gap-2">
          <Spinner2 /> Loading order details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminPageHeader
          title={`Order ${orderNumber}`}
          description="View and manage order details."
        />
        <div className="mt-6 text-center">
          <p className="text-destructive">
            Error loading order: {error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <AdminPageHeader
          title={`Order ${orderNumber}`}
          description="View and manage order details."
        />
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description="View and manage order details."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Overview */}
          <AdminOrderOverview order={order} />

          {/* Customer Information */}
          <AdminOrderCustomerInfo customer={order.customer} />

          {/* Order Items */}
          <AdminOrderItems items={order.items} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Information */}
          <AdminOrderShippingInfo order={order} />
        </div>
      </div>
    </div>
  );
};
