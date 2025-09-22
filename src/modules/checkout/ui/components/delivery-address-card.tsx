import { Building, EditIcon, Home, MapPin, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetUserAddressesOutput } from "@/modules/terminal/types";

interface DeliveryAddressCardProps {
  address: GetUserAddressesOutput[number];
  isSelected?: boolean;
  onSelect?: () => void;
}

export const DeliveryAddressCard = ({
  address,
  isSelected = false,
  onSelect,
}: DeliveryAddressCardProps) => {
  const {
    name,
    first_name,
    last_name,
    line1,
    line2,
    city,
    state,
    country,
    zip,
    phone,
    is_residential,
  } = address.terminalAddresses;

  const displayName = name || `${first_name || ""} ${last_name || ""}`.trim();
  const fullAddress = [line1, line2, city, state, country, zip]
    .filter(Boolean)
    .join(", ");

  return (
    <Card
      className={`cursor-pointer gap-3 p-3 transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "ring-primary border-primary ring-2"
          : "hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <CardHeader className="p-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-medium">
            {displayName || "Delivery Address"}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-none text-xs">
              {is_residential ? (
                <>
                  <Home className="h-3 w-3" />
                  Residential
                </>
              ) : (
                <>
                  <Building className="h-3 w-3" />
                  Business
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="leading-relaxed">{fullAddress}</span>
          </div>

          {phone && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{phone}</span>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            {/* TODO: Add edit address functionality */}
            <Button size="sm" variant="ghost">
              <EditIcon />
              Edit
            </Button>
            <Button size="sm" variant={isSelected ? "default" : "outline"}>
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
