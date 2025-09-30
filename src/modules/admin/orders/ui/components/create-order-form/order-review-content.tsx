"use client";

import { formatNaira } from "@/lib/utils";
import {
  CustomerInfoFormValues,
  DeliveryInfoFormValues,
  OrderItemsFormValues,
} from "./schemas";

interface OrderReviewContentProps {
  customerInfo?: CustomerInfoFormValues;
  orderItems?: OrderItemsFormValues;
  delivery?: DeliveryInfoFormValues;
  deliveryRates?: Array<{
    rate_id: string;
    amount: number;
    carrier_name: string;
    delivery_time: string;
    currency: string;
  }>;
}

export const OrderReviewContent = ({
  customerInfo,
  orderItems,
  delivery,
  deliveryRates,
}: OrderReviewContentProps) => {
  const subtotal = orderItems?.items
    ? orderItems.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      )
    : 0;

  // Find the selected rate to get the delivery fee
  const selectedRate = deliveryRates?.find(
    (rate) => rate.rate_id === delivery?.selectedRateId,
  );
  const deliveryFee = selectedRate?.amount || 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-4">
      {/* Customer Information */}
      <div>
        <h4 className="mb-2 font-medium">Customer</h4>
        {customerInfo ? (
          <div className="space-y-1">
            <p className="text-muted-foreground">
              {customerInfo.customerFirstName} {customerInfo.customerLastName}
            </p>
            <p className="text-muted-foreground">
              {customerInfo.customerEmail}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No customer information provided
          </p>
        )}
      </div>

      {/* Order Items */}
      <div>
        <h4 className="mb-2 font-medium">Order Items</h4>
        {orderItems?.items && orderItems.items.length > 0 ? (
          <div className="space-y-2">
            {orderItems.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.productName || `Product ${item.productId}`} ×{" "}
                  {item.quantity}
                </span>
                <span>{formatNaira(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No items added to order</p>
        )}
      </div>

      {/* Delivery Information */}
      {delivery && selectedRate && (
        <div>
          <h4 className="mb-2 font-medium">Delivery</h4>
          <div className="space-y-1">
            <p className="text-muted-foreground">{selectedRate.carrier_name}</p>
            <p className="text-muted-foreground text-sm">
              Estimated delivery: {selectedRate.delivery_time}
            </p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="border-t pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Fee:</span>
            <span>
              {selectedRate ? formatNaira(deliveryFee) : "Not selected"}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{formatNaira(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
