"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

export const CheckoutSuccessView = () => {
  const params = useSearchParams();
  const trpc = useTRPC();
  const orderNumber = params.get("orderNumber") as string;

  const {
    data: orderData,
    isLoading,
    error,
  } = useQuery(trpc.orders.getOrderStatus.queryOptions({ orderNumber }));

  if (isLoading) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <Spinner2 />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-600">Error</h2>
          <p className="text-sm text-gray-600">
            Unable to load order status. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col p-4">
      <div className="mt-20 space-y-4">
        <div className="text-center">
          <h2 className="mb-5 text-2xl font-semibold">
            Order Placed Successfully!
          </h2>
          <p>
            You will receive an email confirmation with your order details
            shortly. If you have any questions, please don{"'"}t hesitate to
            contact our customer service team.
          </p>
          {orderData && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Order #{orderData.orderNumber} - Status:{" "}
                <span className="font-medium capitalize">
                  {orderData.status}
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/orders/${orderNumber}`}>View Order</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
