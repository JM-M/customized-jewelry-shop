import { InfiniteLoadingTrigger } from "@/components/shared/infinite-loading-trigger";
import { GetUserOrdersOutput } from "@/modules/orders/types";
import { OrderListItem } from "./order-list-item";

interface OrdersListProps {
  orders: GetUserOrdersOutput["items"];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const OrdersList = ({
  orders,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">No orders found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderListItem key={order.id} order={order} />
        ))}
      </div>

      <InfiniteLoadingTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
