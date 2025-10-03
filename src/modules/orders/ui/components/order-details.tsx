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
      {/* Top Section - Order Info and Status Tracker */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <OrderInfoSection order={order} />
        <OrderStatusTracker order={order} />
      </div>

      {/* Bottom Section - Order Items and Shipping Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <OrderItemsList order={order} />
        <OrderShippingInfo order={order} />
      </div>
    </div>
  );
};
