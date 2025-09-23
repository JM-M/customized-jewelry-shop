import { Spinner2 } from "@/components/shared/spinner-2";
import { MapPinIcon, PhoneIcon } from "lucide-react";
import { useCheckout } from "../../contexts/checkout";
import { useCheckoutQueries } from "../../hooks/use-checkout-queries";
import { DeliveryRates } from "./delivery-rates";

export const DeliveryReview = () => {
  const { selectedAddressId, selectedRateId, isLoadingSession } = useCheckout();

  const { addressQuery, ratesQuery } = useCheckoutQueries();

  // Get address data
  const { data: addressData, isLoading: addressLoading } = addressQuery;

  // Get delivery rates
  const { data: ratesData, isLoading: ratesLoading } = ratesQuery;

  if (addressLoading || ratesLoading || isLoadingSession)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (!selectedAddressId)
    return (
      <div className="text-muted-foreground text-sm">No address selected</div>
    );

  if (!addressData)
    return (
      <div className="text-muted-foreground text-sm">
        Unable to fetch address
      </div>
    );

  const { line1, line2, city, state, country, zip, phone } = addressData.data;
  const fullAddress = [line1, line2, city, state, country, zip]
    .filter(Boolean)
    .join(", ");

  // Get the cheapest rate or first available rate
  const selectedRate = ratesData?.rates.find(
    (rate) => rate.rate_id === selectedRateId,
  );
  const deliveryFee = selectedRate?.amount || 0;

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

      <DeliveryRates rates={ratesData?.rates || []} />
    </div>
  );
};
