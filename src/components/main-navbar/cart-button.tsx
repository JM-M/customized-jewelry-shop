import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HiShoppingBag } from "react-icons/hi2";

export const CartButton = () => {
  // TODO: Replace with actual cart state
  const cartItemsCount = 3;

  return (
    <Button variant="ghost" size="icon" className="relative">
      <HiShoppingBag className="size-4.5" />
      {cartItemsCount > 0 && (
        <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-xs">
          {cartItemsCount > 99 ? "99+" : cartItemsCount}
        </Badge>
      )}
    </Button>
  );
};
