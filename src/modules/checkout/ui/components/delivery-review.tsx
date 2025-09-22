import { Spinner2 } from "@/components/shared/spinner-2";
import { formatNaira } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MapPinIcon, PhoneIcon } from "lucide-react";
import { useCheckout } from "../../contexts/checkout";

export const DeliveryReview = () => {
  const { selectedAddressId } = useCheckout();

  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.terminal.getAddress.queryOptions(
      {
        addressId: selectedAddressId!,
      },
      {
        enabled: !!selectedAddressId,
      },
    ),
  );

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 /> Loading...
      </div>
    );

  if (!selectedAddressId) return "No address selected";

  if (!data) return "Unable to fetch address";

  const { line1, line2, city, state, country, zip, phone } = data.data;

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

      <div className="flex items-center justify-between text-lg">
        <span className="font-medium text-gray-900">Delivery Fee</span>
        <span className="font-medium text-gray-900">
          {/* TODO: Add delivery fee */}
          {formatNaira(1000)}
        </span>
      </div>
    </div>
  );
};
