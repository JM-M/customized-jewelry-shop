import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useCheckout } from "../contexts/checkout";

export const useCheckoutQueries = () => {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user?.id;

  const { selectedAddressId } = useCheckout();

  const trpc = useTRPC();

  const addressesQuery = useQuery(
    trpc.terminal.getUserAddresses.queryOptions(undefined, {
      enabled: isLoggedIn,
    }),
  );

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
    addressesQuery,
  };
};
