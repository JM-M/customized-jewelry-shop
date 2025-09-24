"use client";

import { ShopPageHeader } from "@/components/shared/shop-page-header";
import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { OrdersList } from "../components/orders-list";

export const OrdersView = () => {
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
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

  return (
    <div className="space-y-4 p-4">
      <ShopPageHeader title="Your Orders" />
      <OrdersList
        orders={data}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
