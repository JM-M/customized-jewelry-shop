import { TerminalRate } from "@/modules/terminal/types";

import { DeliveryRateCard } from "@/components/shared/delivery-rate-card";
import { useCheckout } from "../../contexts/checkout";

interface DeliveryRatesProps {
  rates: TerminalRate[];
}
export const DeliveryRates = ({ rates }: DeliveryRatesProps) => {
  const { selectedRateId, setSelectedRateId } = useCheckout();

  return (
    <div className="space-y-3 py-4">
      {rates.map((rate) => (
        <DeliveryRateCard
          key={rate.rate_id}
          rate={rate}
          isSelected={selectedRateId === rate.rate_id}
          onSelect={() => setSelectedRateId(rate.rate_id)}
        />
      ))}
    </div>
  );
};
