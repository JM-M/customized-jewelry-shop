import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { FastCheckoutOrderItemCard } from "./fast-checkout-order-item-card";

interface FastCheckoutOrderReviewProps {
  order: AdminOrderDetails;
}

export const FastCheckoutOrderReview = ({
  order,
}: FastCheckoutOrderReviewProps) => {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Order Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items.map((item) => (
            <FastCheckoutOrderItemCard key={item.id} item={item} />
          ))}
        </CardContent>
      </Card>

      {/* Delivery Information */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">Hi</CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">
              {formatNaira(Number(order.subtotal))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium text-gray-900">
              {formatNaira(Number(order.deliveryFee))}
            </span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">
                {formatNaira(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
