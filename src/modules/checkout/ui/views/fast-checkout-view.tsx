"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FastReviewAndCheckout } from "../components/fast-review-and-checkout";

export const FastCheckoutView = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const trpc = useTRPC();

  const {
    data: order,
    isLoading,
    error,
  } = useQuery(
    trpc.admin.orders.getOrder.queryOptions({
      orderNumber,
    }),
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2">
        <Spinner2 /> Loading order...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <p className="mt-2 text-gray-600">
            The order you{"'"}re looking for doesn{"'"}t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  if (order.status !== "pending") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Order Already Processed
          </h1>
          <p className="mt-2 text-gray-600">
            This order has already been processed and cannot be modified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Complete Your Order
        </h1>
        <h1 className="mt-2 text-gray-600">Order #{order.orderNumber}</h1>
      </div>

      <FastReviewAndCheckout order={order} />
    </div>
  );
};
