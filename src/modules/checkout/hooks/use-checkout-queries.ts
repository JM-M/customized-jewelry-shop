import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCheckout } from "../contexts/checkout";

export const useCheckoutQueries = () => {
  const { selectedAddressId, selectedRateId } = useCheckout();

  const trpc = useTRPC();

  // Get address data
  const addressQuery = useQuery(
    trpc.terminal.getAddress.queryOptions(
      {
        addressId: selectedAddressId!,
      },
      {
        enabled: !!selectedAddressId,
      },
    ),
  );

  // Get delivery rates
  const ratesQuery = useQuery(
    trpc.terminal.getDeliveryRates.queryOptions(
      {
        deliveryAddressId: selectedAddressId!,
      },
      {
        enabled: !!selectedAddressId,
      },
    ),
  );

  return {
    addressQuery,
    ratesQuery,
  };
};
