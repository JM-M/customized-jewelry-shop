"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ExternalLink, MapPin, Package, Truck } from "lucide-react";

interface AdminOrderShippingInfoProps {
  order: {
    deliveryAddressId?: string;
    pickupAddressId?: string;
    trackingNumber?: string;
    shipmentId?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const AdminOrderShippingInfo = ({
  order,
}: AdminOrderShippingInfoProps) => {
  const {
    deliveryAddressId,
    pickupAddressId,
    trackingNumber,
    shipmentId,
    shippedAt,
    deliveredAt,
  } = order;

  const hasShippingInfo =
    deliveryAddressId || pickupAddressId || trackingNumber || shipmentId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Shipping & Logistics
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasShippingInfo ? (
          <div className="py-8 text-center">
            <Package className="text-muted-foreground mx-auto mb-4 size-12" />
            <p className="text-muted-foreground">
              No shipping information available yet
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Shipping details will appear here once the order is processed
            </p>
          </div>
        ) : (
          <>
            {/* Delivery Address */}
            {deliveryAddressId && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground size-5" />
                    <h4 className="font-medium text-gray-900">
                      Delivery Address
                    </h4>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 size-4" />
                    View Details
                  </Button>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Address ID:
                      </span>
                      <CopyableText text={deliveryAddressId} />
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <p>123 Main Street, Apartment 4B</p>
                      <p>Lagos, Nigeria 100001</p>
                      <p>+234 800 123 4567</p>
                      {/* Placeholder - will be replaced with actual address details */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pickup Address */}
            {pickupAddressId && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="text-muted-foreground size-5" />
                    <h4 className="font-medium text-gray-900">
                      Pickup Address
                    </h4>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 size-4" />
                    View Details
                  </Button>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Address ID:
                      </span>
                      <CopyableText text={pickupAddressId} />
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <p>Jewelry Store - Victoria Island</p>
                      <p>123 Broad Street, Victoria Island</p>
                      <p>Lagos, Nigeria 101241</p>
                      {/* Placeholder - will be replaced with actual address details */}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Information */}
            {(trackingNumber || shipmentId) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="text-muted-foreground size-5" />
                  <h4 className="font-medium text-gray-900">
                    Tracking Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {trackingNumber && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Tracking Number:
                        </span>
                        <CopyableText text={trackingNumber} />
                      </div>
                      <div className="rounded-lg bg-blue-50 p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-blue-600">
                            Active
                          </Badge>
                          <span className="text-sm text-blue-700">
                            In Transit
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-blue-600">
                          Last updated: 2 hours ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Track Package
                      </Button>
                    </div>
                  )}

                  {shipmentId && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          Shipment ID:
                        </span>
                        <CopyableText text={shipmentId} />
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">Terminal</Badge>
                          <span className="text-sm text-gray-700">
                            Integrated
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          Managed by Terminal API
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Shipping Timeline */}
            {(shippedAt || deliveredAt) && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground size-5" />
                  <h4 className="font-medium text-gray-900">
                    Shipping Timeline
                  </h4>
                </div>

                <div className="space-y-3">
                  {shippedAt && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Truck className="size-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order Shipped
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatDate(shippedAt)}
                        </p>
                      </div>
                    </div>
                  )}

                  {deliveredAt && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <Package className="size-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order Delivered
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatDate(deliveredAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
