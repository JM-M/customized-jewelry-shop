import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminOrderDelivery } from "../../../hooks/use-admin-order-delivery";
import { AdminOrderDeliveryForm } from "./admin-order-delivery-form";
import { DeliveryRateSelector } from "./delivery-rate-selector";
import { CustomerInfoFormValues } from "./schemas";

interface DeliveryFieldsProps {
  customerInfo?: CustomerInfoFormValues;
  deliveryCache?: {
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
    rates?: Array<{
      rate_id: string;
      amount: number;
      carrier_name: string;
      delivery_time: string;
      currency: string;
    }>;
  };
  onCacheUpdate: (cache: {
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
  onRatesUpdate: (
    rates: Array<{
      rate_id: string;
      amount: number;
      carrier_name: string;
      delivery_time: string;
      currency: string;
    }>,
  ) => void;
}

export const DeliveryFields = ({
  customerInfo,
  deliveryCache,
  onCacheUpdate,
  onRatesUpdate,
}: DeliveryFieldsProps) => {
  const {
    createdAddressId,
    createAddress,
    isCreatingAddress,
    createAddressError,
    ratesData,
    isLoadingRates,
    ratesError,
  } = useAdminOrderDelivery({
    customerInfo,
    initialAddressId: deliveryCache?.addressId,
    onAddressCreated: onCacheUpdate,
    onRatesLoaded: onRatesUpdate,
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminOrderDeliveryForm
            onFetchRates={createAddress}
            isCreatingAddress={isCreatingAddress}
            createAddressError={createAddressError as Error | null}
            hasExistingAddress={!!deliveryCache?.addressId}
          />
        </CardContent>
      </Card>

      {createdAddressId && (
        <Card>
          <CardHeader>
            <CardTitle>Select Delivery Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryRateSelector
              rates={ratesData?.rates || []}
              isLoading={isLoadingRates}
              error={ratesError as Error | null}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
