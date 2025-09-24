import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetUserOrderOutput } from "@/modules/orders/types";
import { MapPin, Package, Truck } from "lucide-react";

interface OrderShippingInfoProps {
  order: GetUserOrderOutput;
}

export const OrderShippingInfo = ({ order }: OrderShippingInfoProps) => {
  const { deliveryAddressId, pickupAddressId, trackingNumber, shipmentId } =
    order;

  return (
    <Card className="gap-3 p-3">
      <CardHeader className="p-0">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {/* Delivery Address */}
        {deliveryAddressId && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-gray-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Delivery Address
              </h4>
              <p className="text-sm text-gray-600">
                Address ID: {deliveryAddressId}
                {/* TODO: Fetch and display actual address details */}
              </p>
            </div>
          </div>
        )}

        {/* Pickup Address */}
        {pickupAddressId && (
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 size-5 text-gray-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Pickup Address
              </h4>
              <p className="text-sm text-gray-600">
                Address ID: {pickupAddressId}
                {/* TODO: Fetch and display actual address details */}
              </p>
            </div>
          </div>
        )}

        {/* Tracking Information */}
        {(trackingNumber || shipmentId) && (
          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-5 text-gray-400" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Tracking Information
              </h4>
              <div className="space-y-1">
                {trackingNumber && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Tracking Number:</span>{" "}
                    <span className="font-mono">{trackingNumber}</span>
                  </p>
                )}
                {shipmentId && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Shipment ID:</span>{" "}
                    <span className="font-mono">{shipmentId}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No shipping info message */}
        {!deliveryAddressId &&
          !pickupAddressId &&
          !trackingNumber &&
          !shipmentId && (
            <div className="py-8 text-center">
              <Package className="mx-auto mb-2 size-12 text-gray-300" />
              <p className="text-sm text-gray-500">
                No shipping information available yet
              </p>
            </div>
          )}
      </CardContent>
    </Card>
  );
};
