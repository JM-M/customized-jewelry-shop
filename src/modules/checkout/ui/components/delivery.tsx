import { Spinner2 } from "@/components/shared/spinner-2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCheckoutParams } from "../../hooks/use-checkout-params";
import { useCheckoutQueries } from "../../hooks/use-checkout-queries";
import { DeliveryAddresses } from "./delivery-addresses";
import { DeliveryForm } from "./delivery-form";

export const Delivery = () => {
  const [_, setCheckoutParams] = useCheckoutParams();
  const { addressesQuery } = useCheckoutQueries();
  const { data: addresses, isLoading: isLoadingAddresses } = addressesQuery;

  const onProceed = () => setCheckoutParams({ step: "review-and-checkout" });

  if (isLoadingAddresses) {
    return (
      <div className="mx-auto flex max-w-[500px] items-center justify-center gap-2 py-8">
        <Spinner2 />
        <span>Loading addresses...</span>
      </div>
    );
  }

  const hasAddresses =
    !isLoadingAddresses && !!addresses?.length && addresses.length > 0;

  if (!hasAddresses) {
    return (
      <div className="mx-auto max-w-[500px] space-y-5">
        <DeliveryForm onSubmit={onProceed} />
      </div>
    );
  }

  const tabsTriggerClassName = "data-[state=active]:border";

  return (
    <div className="mx-auto max-w-[500px] space-y-5">
      <Tabs
        defaultValue={hasAddresses ? "saved-addresses" : "new-address"}
        className="w-full"
      >
        <TabsList className="grid h-10 w-full grid-cols-2 gap-2">
          <TabsTrigger value="new-address" className={tabsTriggerClassName}>
            New Address
          </TabsTrigger>
          <TabsTrigger
            value="saved-addresses"
            className={tabsTriggerClassName}
            disabled={!hasAddresses}
          >
            Saved Addresses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new-address" className="mt-6">
          <DeliveryForm onSubmit={onProceed} />
        </TabsContent>

        <TabsContent value="saved-addresses" className="mt-6">
          {hasAddresses ? (
            <DeliveryAddresses onProceed={onProceed} />
          ) : (
            <div className="flex items-center gap-2 py-8">
              <p className="text-muted-foreground text-sm">
                You have not saved any addresses yet
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
