"use client";

import { CopyableText } from "@/components/shared/copyable-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import {
  Building,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Shield,
  Truck,
  User,
} from "lucide-react";

import { AdminOrderDetails } from "../../../types";

interface AdminOrderShippingInfoProps {
  order: AdminOrderDetails;
}

// Placeholder data - will be replaced with real data from API
const mockShippingData = {
  deliveryAddress: {
    address_id: "addr_del_123",
    line1: "123 Main Street",
    line2: "Apartment 4B",
    city: "Lagos",
    state: "Lagos State",
    country: "Nigeria",
    zip: "100001",
    phone: "+234-801-234-5678",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    is_residential: true,
  },
  pickupAddress: {
    id: "pickup_001",
    nickname: "Main Warehouse",
    terminalAddress: {
      line1: "456 Business District",
      line2: "Suite 200",
      city: "Ikeja",
      state: "Lagos State",
      country: "Nigeria",
      zip: "100001",
      phone: "+234-802-345-6789",
      email: "warehouse@jewelry.com",
    },
    isDefault: true,
  },
  selectedRate: {
    rate_id: "RT_DEF456UVW",
    carrier_name: "FedEx",
    carrier_logo:
      "https://logos-world.net/wp-content/uploads/2020/04/FedEx-Logo.png",
    carrier_rate_description: "Standard Overnight Delivery",
    amount: 2500,
    currency: "NGN",
    delivery_time: "1-2 business days",
    pickup_time: "Same day by 6 PM",
    includes_insurance: true,
    insurance_coverage: 50000,
    insurance_fee: 0,
    carrier_id: "FDX_001",
  },
  tracking: {
    shipmentId: "SH_ABC123XYZ",
    trackingNumber: "1Z999AA1234567890",
  },
  timeline: {
    createdAt: "Dec 15, 2024 at 2:30 PM",
    shippedAt: "Dec 16, 2024 at 9:15 AM",
    deliveredAt: null,
  },
};

export const AdminOrderShippingInfo = ({
  order,
}: AdminOrderShippingInfoProps) => {
  const { deliveryAddress, pickupAddress, selectedRate, tracking, timeline } =
    mockShippingData;

  const fullDeliveryAddress = [
    deliveryAddress.line1,
    deliveryAddress.line2,
    deliveryAddress.city,
    deliveryAddress.state,
    deliveryAddress.country,
    deliveryAddress.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const fullPickupAddress = [
    pickupAddress.terminalAddress.line1,
    pickupAddress.terminalAddress.line2,
    pickupAddress.terminalAddress.city,
    pickupAddress.terminalAddress.state,
    pickupAddress.terminalAddress.country,
    pickupAddress.terminalAddress.zip,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-4">
      {/* Delivery Address */}
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
                {deliveryAddress.first_name} {deliveryAddress.last_name}
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                {fullDeliveryAddress}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
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

      {/* Pickup Address */}
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
                {pickupAddress.nickname}
              </p>
              <p className="text-sm leading-relaxed text-gray-600">
                {fullPickupAddress}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
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

      {/* Selected Shipping Method */}
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
              {selectedRate.carrier_logo && (
                <img
                  src={selectedRate.carrier_logo}
                  alt={selectedRate.carrier_name}
                  className="h-8 w-8 rounded object-contain"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {selectedRate.carrier_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedRate.carrier_rate_description}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatNaira(selectedRate.amount)}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Delivery: {selectedRate.delivery_time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4 text-gray-500" />
                <span>Pickup: {selectedRate.pickup_time}</span>
              </div>
            </div>
            {selectedRate.includes_insurance && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>
                  Insured ({formatNaira(selectedRate.insurance_coverage)}{" "}
                  coverage)
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Information */}
      <Card className="gap-3 p-3">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Package className="h-5 w-5 text-orange-600" />
            Tracking Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Shipment ID
                </p>
                <CopyableText text={tracking.shipmentId} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Tracking Number
                </p>
                <CopyableText text={tracking.trackingNumber} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Rate ID
                </p>
                <CopyableText text={selectedRate.rate_id} />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  Carrier ID
                </p>
                <CopyableText text={selectedRate.carrier_id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <Package className="h-4 w-4 text-green-600" />
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
                  <Package className="h-4 w-4 text-gray-400" />
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

      {/* Delivery Cost Breakdown */}
      <Card className="gap-3 p-3">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Delivery Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Products</span>
              <span className="font-medium text-gray-900">
                {formatNaira(Number(order.subtotal))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery</span>
              <span className="font-medium text-gray-900">
                {formatNaira(Number(order.deliveryFee || 0))}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {formatNaira(Number(order.totalAmount))}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
