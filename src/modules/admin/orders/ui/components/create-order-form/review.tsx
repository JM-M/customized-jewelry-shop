"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Review = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">Customer</h4>
            <p className="text-muted-foreground">John Doe (john@example.com)</p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Order Items</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Gold Ring (14K Gold) × 1</span>
                <span>$299.99</span>
              </div>
              <div className="flex justify-between">
                <span>Silver Necklace (Sterling Silver) × 2</span>
                <span>$199.98</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">Delivery</h4>
            <p className="text-muted-foreground">
              123 Main St, New York, NY 10001
            </p>
            <p className="text-muted-foreground">Pickup: Warehouse A</p>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$499.97</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>$514.97</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
