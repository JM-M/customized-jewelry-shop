import { DeliveryRateCard } from "@/components/shared/delivery-rate-card";
import { Spinner2 } from "@/components/shared/spinner-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetUserOrderOutput } from "@/modules/orders/types";
import { TerminalRate } from "@/modules/terminal/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Truck } from "lucide-react";

interface OrderShippingInfoProps {
  order: GetUserOrderOutput;
}

export const OrderShippingInfo = ({ order }: OrderShippingInfoProps) => {
  const { deliveryAddressId, trackingNumber, shipmentId, rateId } = order;

  const trpc = useTRPC();

  // Fetch delivery address details
  const { data: deliveryAddressData, isLoading: deliveryAddressLoading } =
    useQuery(
      trpc.terminal.getAddress.queryOptions(
        {
          addressId: deliveryAddressId!,
        },
        {
          enabled: !!deliveryAddressId,
        },
      ),
    );

  // Fetch delivery rate details
  const { data: deliveryRateData, isLoading: deliveryRateLoading } = useQuery(
    trpc.terminal.getRate.queryOptions(
      {
        rateId: rateId!,
      },
      {
        enabled: !!rateId,
      },
    ),
  );

  const formatAddress = (addressData: any) => {
    if (!addressData?.data) return null;

    const { line1, line2, city, state, country, zip, phone } = addressData.data;
    const fullAddress = [line1, line2, city, state, country, zip]
      .filter(Boolean)
      .join(", ");

    return { fullAddress, phone };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {/* Delivery Address */}
        {deliveryAddressId && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-5 text-gray-400" />
            <div className="flex-1">
              {deliveryAddressLoading ? (
                <div className="flex items-center gap-2">
                  <Spinner2 />
                  <span className="text-sm text-gray-600">
                    Loading address...
                  </span>
                </div>
              ) : deliveryAddressData ? (
                <div className="space-y-1">
                  {(() => {
                    const formatted = formatAddress(deliveryAddressData);
                    return formatted ? (
                      <>
                        <p className="text-sm leading-relaxed text-gray-600">
                          {formatted.fullAddress}
                        </p>
                        {formatted.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatted.phone}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Could not load address
                      </p>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Could not load address</p>
              )}
            </div>
          </div>
        )}

        {/* Delivery Rate Information */}
        {rateId && (
          <div className="space-y-3">
            {deliveryRateLoading ? (
              <div className="flex items-center gap-2">
                <Spinner2 />
                <span className="text-sm text-gray-600">
                  Loading delivery details...
                </span>
              </div>
            ) : deliveryRateData ? (
              <DeliveryRateCard
                rate={deliveryRateData as TerminalRate}
                isSelected={true}
                displayOnly={true}
              />
            ) : (
              <p className="text-sm text-gray-600">Rate ID: {rateId}</p>
            )}
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
        {!deliveryAddressId && !trackingNumber && !shipmentId && !rateId && (
          <div className="py-8 text-center">
            <Truck className="mx-auto mb-2 size-12 text-gray-300" />
            <p className="text-sm text-gray-500">
              No shipping information available yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
