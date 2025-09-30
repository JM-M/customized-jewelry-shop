import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { CustomerInfoFormValues } from "../ui/components/create-order-form/schemas";

interface UseAdminOrderDeliveryProps {
  customerInfo?: CustomerInfoFormValues;
  initialAddressId?: string;
  onAddressCreated?: (cache: {
    addressId: string;
    addressData: {
      phone: string;
      line1: string;
      line2?: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  }) => void;
  onRatesLoaded?: (
    rates: Array<{
      rate_id: string;
      amount: number;
      carrier_name: string;
      delivery_time: string;
      currency: string;
    }>,
  ) => void;
}

export const useAdminOrderDelivery = ({
  customerInfo,
  initialAddressId,
  onAddressCreated,
  onRatesLoaded,
}: UseAdminOrderDeliveryProps) => {
  const trpc = useTRPC();
  const [createdAddressId, setCreatedAddressId] = useState<string | null>(
    initialAddressId || null,
  );
  const lastCachedRatesRef = useRef<string | null>(null);

  // Restore cached address ID on mount
  useEffect(() => {
    if (initialAddressId && !createdAddressId) {
      setCreatedAddressId(initialAddressId);
    }
  }, [initialAddressId, createdAddressId]);

  // Mutation to create address
  const {
    mutate: createAddress,
    isPending: isCreatingAddress,
    error: createAddressError,
  } = useMutation(trpc.terminal.createAddress.mutationOptions());

  // Query to fetch delivery rates (enabled when address exists)
  const {
    data: ratesData,
    isLoading: isLoadingRates,
    error: ratesError,
  } = useQuery(
    trpc.terminal.getDeliveryRates.queryOptions(
      {
        deliveryAddressId: createdAddressId!,
      },
      {
        enabled: !!createdAddressId,
      },
    ),
  );

  // Call onRatesLoaded when rates are fetched
  useEffect(() => {
    if (ratesData?.rates && onRatesLoaded) {
      // Create a unique key for this set of rates to prevent duplicate caching
      const ratesKey = ratesData.rates.map((r) => r.rate_id).join(",");

      if (lastCachedRatesRef.current !== ratesKey) {
        const simplifiedRates = ratesData.rates.map((rate) => ({
          rate_id: rate.rate_id,
          amount: rate.amount,
          carrier_name: rate.carrier_name,
          delivery_time: rate.delivery_time,
          currency: rate.currency,
        }));
        onRatesLoaded(simplifiedRates);
        lastCachedRatesRef.current = ratesKey;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratesData]);

  // Function to create address and fetch rates
  const handleCreateAddressAndFetchRates = (addressData: {
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }) => {
    if (!customerInfo) {
      console.error("Customer info is required to create address");
      return;
    }

    const fullAddressData = {
      firstName: customerInfo.customerFirstName,
      lastName: customerInfo.customerLastName,
      email: customerInfo.customerEmail,
      ...addressData,
      metadata: {
        user_id: customerInfo.customerId,
      },
    };

    createAddress(fullAddressData, {
      onSuccess: (data) => {
        const addressId = data.data.address_id;
        setCreatedAddressId(addressId);

        // Cache the address ID and data in parent component
        if (onAddressCreated) {
          onAddressCreated({
            addressId,
            addressData,
          });
        }
        // Rates query will automatically trigger due to enabled condition
      },
      onError: (error) => {
        console.error("Failed to create address:", error);
      },
    });
  };

  return {
    createdAddressId,
    createAddress: handleCreateAddressAndFetchRates,
    isCreatingAddress,
    createAddressError: createAddressError as Error | null,
    ratesData,
    isLoadingRates,
    ratesError: ratesError as Error | null,
  };
};
