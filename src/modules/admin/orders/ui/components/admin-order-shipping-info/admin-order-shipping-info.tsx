"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Spinner2 } from "@/components/shared/spinner-2";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Building,
  Calendar,
  Clock,
  MapPin,
  PackageIcon,
  Phone,
  Shield,
  Truck,
  User,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { AdminOrderDetails } from "../../../types";

interface AdminOrderShippingInfoProps {
  order: AdminOrderDetails;
}

const formatDate = (date: string | Date) => {
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
  const trpc = useTRPC();

  // Fetch delivery address
  const { data: deliveryAddress, isLoading: deliveryAddressLoading } = useQuery(
    trpc.admin.orders.getDeliveryAddress.queryOptions(
      {
        addressId: order.deliveryAddressId!,
      },
      {
        enabled: !!order.deliveryAddressId,
      },
    ),
  );

  // Fetch pickup address
  const { data: pickupAddress, isLoading: pickupAddressLoading } = useQuery(
    trpc.admin.orders.getPickupAddress.queryOptions(
      {
        pickupAddressId: order.pickupAddressId!,
      },
      {
        enabled: !!order.pickupAddressId,
      },
    ),
  );

  // Fetch rate details
  const { data: rateDetails, isLoading: rateLoading } = useQuery(
    trpc.admin.orders.getRateDetails.queryOptions(
      {
        rateId: order.rateId!,
      },
      {
        enabled: !!order.rateId && order.rateId !== "N/A",
      },
    ),
  );

  // Create timeline from order data
  const timeline = {
    createdAt: formatDate(order.createdAt),
    shippedAt: order.shippedAt ? formatDate(order.shippedAt) : null,
    deliveredAt: order.deliveredAt ? formatDate(order.deliveredAt) : null,
  };

  // Use rateDetails directly if available

  const isLoading =
    deliveryAddressLoading || pickupAddressLoading || rateLoading;

  const fullDeliveryAddress = deliveryAddress
    ? [
        deliveryAddress.line1,
        deliveryAddress.line2,
        deliveryAddress.city,
        deliveryAddress.state,
        deliveryAddress.country,
        deliveryAddress.zip,
      ]
        .filter(Boolean)
        .join(", ")
    : "No delivery address available";

  const fullPickupAddress = pickupAddress
    ? [
        pickupAddress.terminalAddress.line1,
        pickupAddress.terminalAddress.line2,
        pickupAddress.terminalAddress.city,
        pickupAddress.terminalAddress.state,
        pickupAddress.terminalAddress.country,
        pickupAddress.terminalAddress.zip,
      ]
        .filter(Boolean)
        .join(", ")
    : "No pickup address available";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="gap-3 p-3">
          <div className="flex items-center justify-center gap-2 py-8">
            <Spinner2 /> Loading shipping information...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Delivery Address */}
      {deliveryAddress && (
        <Card className="gap-3 p-3">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <MapPin className="h-5 w-5 text-blue-600" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {deliveryAddress.first_name && deliveryAddress.last_name
                    ? `${deliveryAddress.first_name} ${deliveryAddress.last_name}`
                    : deliveryAddress.name || "Delivery Address"}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {fullDeliveryAddress}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:gap-4 @sm:flex-row">
                {deliveryAddress.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <CopyableText text={deliveryAddress.phone} />
                  </div>
                )}
                {deliveryAddress.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-500" />
                    <CopyableText text={deliveryAddress.email} />
                  </div>
                )}
              </div>
              <Badge
                variant="outline"
                className="w-fit border-blue-200 bg-blue-50 text-blue-700"
              >
                {deliveryAddress.is_residential ? "Residential" : "Commercial"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pickup Address */}
      {pickupAddress && (
        <Card className="gap-3 p-3">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Building className="h-5 w-5 text-green-600" />
              Pickup Address
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-gray-900">
                  {pickupAddress.nickname || "Pickup Address"}
                </p>
                <p className="text-sm leading-relaxed text-gray-600">
                  {fullPickupAddress}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:gap-4 @sm:flex-row">
                {pickupAddress.terminalAddress.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <CopyableText text={pickupAddress.terminalAddress.phone} />
                  </div>
                )}
                {pickupAddress.terminalAddress.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-500" />
                    <CopyableText text={pickupAddress.terminalAddress.email} />
                  </div>
                )}
              </div>
              {pickupAddress.isDefault && (
                <Badge
                  variant="outline"
                  className="w-fit border-green-200 bg-green-50 text-green-700"
                >
                  Default Pickup Location
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Shipping Method */}
      {rateDetails && (
        <Card className="gap-3 p-3">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Truck className="h-5 w-5 text-purple-600" />
              Selected Shipping Method
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {rateDetails.carrier_logo ? (
                  <img
                    src={rateDetails.carrier_logo}
                    alt={rateDetails.carrier_name}
                    className="h-8 w-8 rounded object-contain"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                    <Truck className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {rateDetails.carrier_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rateDetails.carrier_rate_description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatNaira(rateDetails.amount)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Delivery: {rateDetails.delivery_time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PackageIcon className="h-4 w-4 text-gray-500" />
                  <span>Pickup: {rateDetails.pickup_time}</span>
                </div>
              </div>
              {rateDetails.includes_insurance && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Shield className="h-4 w-4" />
                  <span>
                    Insured ({formatNaira(rateDetails.insurance_coverage)}{" "}
                    coverage)
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Timeline */}
      <Card className="gap-3 p-3">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Order Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">{timeline.createdAt}</p>
              </div>
            </div>
            {timeline.shippedAt && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <Truck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">{timeline.shippedAt}</p>
                </div>
              </div>
            )}
            {timeline.deliveredAt && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <PackageIcon className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    {timeline.deliveredAt}
                  </p>
                </div>
              </div>
            )}
            {!timeline.deliveredAt && (
              <div className="flex items-center gap-3 opacity-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <PackageIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-400">Delivered</p>
                  <p className="text-sm text-gray-400">Pending</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
