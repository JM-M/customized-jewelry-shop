import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/contexts";
import { HiShoppingBag } from "react-icons/hi2";

export const CartButton = () => {
  const { setIsOpen, cartSummary, cart } = useCart();
  const cartItemsCount = cartSummary.itemCount;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setIsOpen(true)}
    >
      <HiShoppingBag className="size-4.5" />
      {cartItemsCount > 0 && (
        <Badge className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full p-0 text-[11px]">
          {cartItemsCount > 99 ? "99+" : cartItemsCount}
        </Badge>
      )}
    </Button>
  );
};
