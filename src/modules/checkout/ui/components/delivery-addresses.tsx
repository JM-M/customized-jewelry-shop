import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { PlusIcon } from "lucide-react";

export const DeliveryAddresses = () => {
  const trpc = useTRPC();

  const noAddresses = true;

  if (noAddresses) return null;

  return (
    <div className="space-y-3 py-4">
      <div>
        <p className="text-muted-foreground text-center text-sm">
          You don{"'"}t have any delivery addresses yet.
        </p>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" className="rounded-none">
          <PlusIcon />
          Add Delivery Address
        </Button>
      </div>
    </div>
  );
};
