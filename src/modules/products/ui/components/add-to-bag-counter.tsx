import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from "../../../cart/contexts";
import { CartItem } from "../../../cart/types";

interface AddToBagCounterProps {
  cartItem: CartItem;
}
export const AddToBagCounter = ({ cartItem }: AddToBagCounterProps) => {
  const { addItemMutation, removeItemMutation } = useCart();

  const handleAddItem = () => {
    addItemMutation.mutate({
      productId: cartItem.productId,
      materialId: cartItem.materialId,
      quantity: cartItem.quantity + 1,
    });
  };

  const handleRemoveItem = () => {
    removeItemMutation.mutate({
      itemId: cartItem.id,
    });
  };

  const isLoading = addItemMutation.isPending || removeItemMutation.isPending;

  return (
    <div className="flex items-center justify-between gap-2">
      <Button size="icon" onClick={handleRemoveItem} disabled={isLoading}>
        {removeItemMutation.isPending ? <Spinner2 /> : <MinusIcon />}
      </Button>
      <span>{cartItem.quantity}</span>
      <Button size="icon" onClick={handleAddItem} disabled={isLoading}>
        {addItemMutation.isPending ? <Spinner2 /> : <PlusIcon />}
      </Button>
    </div>
  );
};
