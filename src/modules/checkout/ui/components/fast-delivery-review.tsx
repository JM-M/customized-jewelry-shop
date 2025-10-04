import { DeliveryRateCard } from "@/components/shared/delivery-rate-card";
import { Spinner2 } from "@/components/shared/spinner-2";
import { AdminOrderDetails } from "@/modules/admin/orders/types";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MapPinIcon, PhoneIcon } from "lucide-react";

interface FastDeliveryReviewProps {
  order: AdminOrderDetails;
}

export const FastDeliveryReview = ({ order }: FastDeliveryReviewProps) => {
  const trpc = useTRPC();

  // Get address data
  const { data: addressData, isLoading: addressLoading } = useQuery(
    trpc.admin.orders.getDeliveryAddress.queryOptions(
      {
        addressId: order.deliveryAddressId!,
      },
      {
        enabled: !!order.deliveryAddressId,
      },
    ),
  );

  // Get rate details
  const { data: rateData, isLoading: rateLoading } = useQuery(
    trpc.admin.orders.getRateDetails.queryOptions(
      {
        rateId: order.rateId!,
      },
      {
        enabled: !!order.rateId && order.rateId !== "N/A",
      },
    ),
  );

  if (addressLoading || rateLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading delivery information...
      </div>
    );
  }

  if (!addressData) {
    return (
      <div className="text-muted-foreground text-sm">
        Unable to fetch delivery address
      </div>
    );
  }

  const { line1, line2, city, state, country, zip, phone } = addressData;
  const fullAddress = [line1, line2, city, state, country, zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-2">
      <div className="text-muted-foreground flex items-start gap-2 text-sm">
        <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span className="leading-relaxed">{fullAddress}</span>
      </div>

      {phone && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <PhoneIcon className="h-4 w-4 flex-shrink-0" />
          <span>{phone}</span>
        </div>
      )}

      {rateData && (
        <div className="mt-3">
          <DeliveryRateCard rate={rateData} displayOnly />
        </div>
      )}
    </div>
  );
};
