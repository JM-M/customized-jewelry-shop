import { GetUserOrderOutput } from "@/modules/orders/types";
import { OrderInfoSection } from "./order-info-section";
import { OrderItemsList } from "./order-items-list";
import { OrderShippingInfo } from "./order-shipping-info";
import { OrderStatusTracker } from "./order-status-tracker";

interface OrderDetailsProps {
  order: GetUserOrderOutput;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="space-y-4">
      {/* Order Information */}
      <OrderInfoSection order={order} />

      {/* Order Status Tracker */}
      <OrderStatusTracker order={order} />

      {/* Order Items */}
      <OrderItemsList order={order} />

      {/* Shipping Information */}
      <OrderShippingInfo order={order} />
    </div>
  );
};
