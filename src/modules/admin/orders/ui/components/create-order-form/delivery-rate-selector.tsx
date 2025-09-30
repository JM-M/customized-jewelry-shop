"use client";

import { DeliveryRateCard } from "@/components/shared/delivery-rate-card";
import { Spinner2 } from "@/components/shared/spinner-2";
import { TerminalRate } from "@/modules/terminal/types";
import { useFormContext } from "react-hook-form";
import { DeliveryInfoFormValues } from "./schemas";

interface DeliveryRateSelectorProps {
  rates: TerminalRate[];
  isLoading: boolean;
  error: Error | null;
}

export const DeliveryRateSelector = ({
  rates,
  isLoading,
  error,
}: DeliveryRateSelectorProps) => {
  const form = useFormContext<DeliveryInfoFormValues>();
  const selectedRateId = form.watch("selectedRateId");

  const handleRateSelect = (rateId: string) => {
    form.setValue("selectedRateId", rateId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8">
        <Spinner2 />
        <span className="text-muted-foreground">Loading delivery rates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4 text-sm">
        {error.message || "Failed to fetch delivery rates. Please try again."}
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center">
        <p>No delivery rates available for this address.</p>
        <p className="text-sm">Please check the address and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">
        Select a delivery rate to continue
      </p>
      <div className="space-y-3">
        {rates.map((rate) => (
          <DeliveryRateCard
            key={rate.rate_id}
            rate={rate}
            isSelected={selectedRateId === rate.rate_id}
            onSelect={() => handleRateSelect(rate.rate_id)}
          />
        ))}
      </div>
    </div>
  );
};
