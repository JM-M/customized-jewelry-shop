"use client";

import { ShopPageHeader } from "@/components/shared/shop-page-header";
import { Spinner2 } from "@/components/shared/spinner-2";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { OrdersList } from "../components/orders-list";

export const OrdersView = () => {
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      ...trpc.orders.getUserOrders.infiniteQueryOptions(
        {
          limit: 20,
        },
        {
          getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
      ),
      select: (data) => data.pages.flatMap((page) => page.items),
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <ShopPageHeader title="Your Orders" />
      <div className="mx-auto max-w-[500px]">
        <OrdersList
          orders={data}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};
