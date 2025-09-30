"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderReviewContent } from "./order-review-content";
import {
  CustomerInfoFormValues,
  DeliveryInfoFormValues,
  OrderItemsFormValues,
} from "./schemas";

interface ReviewProps {
  accumulatedData: {
    customerInfo?: CustomerInfoFormValues;
    orderItems?: OrderItemsFormValues;
    delivery?: DeliveryInfoFormValues;
    deliveryCache?: {
      addressId: string;
      addressData: {
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
      rates?: Array<{
        rate_id: string;
        amount: number;
        carrier_name: string;
        delivery_time: string;
        currency: string;
      }>;
    };
  };
}

export const Review = ({ accumulatedData }: ReviewProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Order Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrderReviewContent
            customerInfo={accumulatedData.customerInfo}
            orderItems={accumulatedData.orderItems}
            delivery={accumulatedData.delivery}
            deliveryRates={accumulatedData.deliveryCache?.rates}
          />
        </CardContent>
      </Card>
    </div>
  );
};
