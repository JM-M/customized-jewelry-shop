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
    <div className="space-y-4">
      <AdminPageHeader
        title={`Order ${order.orderNumber}`}
        description="View and manage order details."
      />

      <div className="@container grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Main Content */}
        <div className="space-y-4 @lg:col-span-3">
          {/* Order Overview */}
          <div className="@container">
            <AdminOrderOverview order={order} />
          </div>

          {/* Customer Information */}
          <div className="@container">
            <AdminOrderCustomerInfo customer={order.customer} />
          </div>

          {/* Order Items */}
          <div className="@container">
            <AdminOrderItems items={order.items} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="@container space-y-4 @lg:col-span-2">
          {/* Shipping Information */}
          <AdminOrderShippingInfo order={order} />
        </div>
      </div>
    </div>
  );
};
