"use client";

import { ShopPageHeader } from "@/components/shared/shop-page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { OrderDetails } from "../components/order-details";

export const OrderView = () => {
  const { orderNumber } = useParams();

  const trpc = useTRPC();

  const { data: order, isLoading } = useQuery(
    trpc.orders.getUserOrder.queryOptions({
      orderNumber: orderNumber as string,
    }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Order not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <ShopPageHeader title={`Order Details`} />
      <OrderDetails order={order} />
    </div>
  );
};
