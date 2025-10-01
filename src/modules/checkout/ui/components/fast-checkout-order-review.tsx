import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone } from "lucide-react";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { useTRPC } from "@/trpc/client";
import { FastCheckoutOrderItemCard } from "./fast-checkout-order-item-card";

interface FastCheckoutOrderReviewProps {
  order: AdminOrderDetails;
}

export const FastCheckoutOrderReview = ({
  order,
}: FastCheckoutOrderReviewProps) => {
  const trpc = useTRPC();

  const {
    data: deliveryAddress,
    isLoading: deliveryAddressLoading,
    error: deliveryAddressError,
  } = useQuery(
    trpc.admin.orders.getDeliveryAddress.queryOptions({
      addressId: order.deliveryAddressId || "",
    }),
  );

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
        <CardContent className="space-y-3">
          {deliveryAddressLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner2 /> Loading address...
            </div>
          ) : deliveryAddressError || !deliveryAddress ? (
            <div className="text-sm text-gray-600">
              Unable to load delivery address
            </div>
          ) : (
            <div className="space-y-3">
              {/* Recipient Name */}
              {(deliveryAddress.name ||
                deliveryAddress.first_name ||
                deliveryAddress.last_name) && (
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    {deliveryAddress.name ||
                      `${deliveryAddress.first_name || ""} ${deliveryAddress.last_name || ""}`.trim()}
                  </span>
                </div>
              )}

              {/* Address */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span className="leading-relaxed">
                  {[
                    deliveryAddress.line1,
                    deliveryAddress.line2,
                    deliveryAddress.city,
                    deliveryAddress.state,
                    deliveryAddress.country,
                    deliveryAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              {/* Phone */}
              {deliveryAddress.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{deliveryAddress.phone}</span>
                </div>
              )}

              {/* Email */}
              {deliveryAddress.email && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Email: </span>
                  {deliveryAddress.email}
                </div>
              )}
            </div>
          )}
        </CardContent>
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
