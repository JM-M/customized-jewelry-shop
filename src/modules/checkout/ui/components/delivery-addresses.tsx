import { useState } from "react";

import { CarouselIndicators } from "@/components/shared/carousel-indicators";
import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { TerminalGetAddressResponse } from "@/modules/terminal/types";
import { ArrowRightIcon } from "lucide-react";
import { useCheckout } from "../../contexts/checkout";
import { useCheckoutQueries } from "../../hooks/use-checkout-queries";
import { DeliveryAddressCard } from "./delivery-address-card";

interface DeliveryAddressesProps {
  onProceed: () => void;
}

export const DeliveryAddresses = ({ onProceed }: DeliveryAddressesProps) => {
  const { selectedAddressId, setSelectedAddressId, isLoadingSession } =
    useCheckout();
  const { addressesQuery } = useCheckoutQueries();

  const [api, setApi] = useState<CarouselApi | null>(null);

  const { data: addresses, isLoading } = addressesQuery;

  if (isLoading || isLoadingSession)
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner2 />
        <span>Loading...</span>
      </div>
    );

  const noAddresses = (addresses?.length ?? 0) === 0;
  if (noAddresses)
    return (
      <div className="flex items-center gap-2">
        <p className="text-muted-foreground text-sm">
          You have not saved any addresses yet
        </p>
      </div>
    );

  return (
    <div className="space-y-3 py-4">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {addresses?.map((address) => {
            const terminalAddressId = address.terminalAddress.address_id;
            const isSelected = selectedAddressId === terminalAddressId;
            return (
              <CarouselItem key={address.id} className="pl-2 md:pl-4">
                <DeliveryAddressCard
                  address={
                    address.terminalAddress as TerminalGetAddressResponse["data"]
                  }
                  isSelected={isSelected}
                  onSelect={() =>
                    setSelectedAddressId(isSelected ? null : terminalAddressId)
                  }
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <CarouselIndicators api={api} count={addresses?.length ?? 0} />
      {selectedAddressId && (
        <div className="flex justify-end pt-4">
          <Button
            variant="secondary"
            disabled={isLoading}
            className="h-12 w-full md:w-auto"
            onClick={onProceed}
          >
            {isLoading ? (
              <>
                Processing...
                <Spinner2 />
              </>
            ) : (
              <>
                Continue with Selected Address
                <ArrowRightIcon />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
