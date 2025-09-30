"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { CustomerInfoFormValues, OrderItemsFormValues } from "./schemas";

interface ReviewProps {
  accumulatedData: {
    customerInfo?: CustomerInfoFormValues;
    orderItems?: OrderItemsFormValues;
  };
}

export const Review = ({ accumulatedData }: ReviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Customer Information */}
          <div>
            <h4 className="mb-2 font-medium">Customer</h4>
            {accumulatedData.customerInfo ? (
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  {accumulatedData.customerInfo.customerName}
                </p>
                <p className="text-muted-foreground">
                  {accumulatedData.customerInfo.customerEmail}
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
            {accumulatedData.orderItems?.items &&
            accumulatedData.orderItems.items.length > 0 ? (
              <div className="space-y-2">
                {accumulatedData.orderItems.items.map((item, index) => (
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

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  {accumulatedData.orderItems?.items
                    ? formatNaira(
                        accumulatedData.orderItems.items.reduce(
                          (sum, item) => sum + item.unitPrice * item.quantity,
                          0,
                        ),
                      )
                    : formatNaira(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatNaira(0)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>
                  {accumulatedData.orderItems?.items
                    ? formatNaira(
                        accumulatedData.orderItems.items.reduce(
                          (sum, item) => sum + item.unitPrice * item.quantity,
                          0,
                        ),
                      )
                    : formatNaira(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
