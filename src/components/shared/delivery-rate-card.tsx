import { Clock, Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNaira } from "@/lib/utils";
import { TerminalRate } from "@/modules/terminal/types";

interface DeliveryRateCardProps {
  rate: TerminalRate;
  isSelected?: boolean;
  onSelect?: () => void;
  displayOnly?: boolean;
}

export const DeliveryRateCard = ({
  rate,
  isSelected = false,
  onSelect,
  displayOnly = false,
}: DeliveryRateCardProps) => {
  const {
    carrier_name,
    carrier_logo,
    amount,
    delivery_time,
    includes_insurance,
    insurance_coverage,
  } = rate;

  return (
    <Card
      className={`gap-3 p-3 transition-all duration-200 ${
        displayOnly
          ? ""
          : `cursor-pointer hover:shadow-md ${
              isSelected ? "border-primary" : "hover:border-primary/50"
            }`
      }`}
      onClick={displayOnly ? undefined : onSelect}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {carrier_logo && (
            <img
              src={carrier_logo}
              alt={carrier_name}
              className="h-8 w-8 rounded object-contain"
            />
          )}
          <div>
            <h3 className="font-medium">{carrier_name}</h3>
            <p className="text-sm text-gray-500">{formatNaira(amount)}</p>
          </div>
          {!displayOnly && (
            <div className="mb-auto ml-auto h-full w-fit">
              <Badge variant={isSelected ? "default" : "outline"}>
                {isSelected ? "Selected" : "Select"}
              </Badge>
            </div>
          )}
        </div>

        <div className="ml-auto w-fit">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="h-3 w-3" />
            {delivery_time}
          </div>
          {includes_insurance && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield className="h-3 w-3" />
              Insured
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
