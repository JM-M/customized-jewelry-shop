import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from "../../../cart/contexts";
import { useCartOptimisticUpdates } from "../../../cart/hooks/use-cart-optimistic-updates";
import { CartItem } from "../../../cart/types";

interface AddToBagCounterProps {
  cartItem: CartItem;
}
export const AddToBagCounter = ({ cartItem }: AddToBagCounterProps) => {
  const { updateQuantityMutation, removeItemMutation } = useCart();
  const {
    optimisticallyUpdateQuantity,
    optimisticallyRemoveFromCart,
    rollbackCart,
  } = useCartOptimisticUpdates();

  const handleAddItem = () => {
    const newQuantity = cartItem.quantity + 1;

    // Optimistically update quantity
    const { previousCartState } = optimisticallyUpdateQuantity(
      cartItem.id,
      newQuantity,
    );

    updateQuantityMutation.mutate(
      {
        itemId: cartItem.id,
        quantity: newQuantity,
      },
      {
        onError: () => {
          // Rollback on failure
          rollbackCart(previousCartState);
          console.error(
            "Failed to update quantity. Changes have been reverted.",
          );
        },
      },
    );
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = cartItem.quantity - 1;

    if (newQuantity <= 0) {
      // Remove item if quantity would be 0 or less
      const { previousCartState } = optimisticallyRemoveFromCart(cartItem.id);

      removeItemMutation.mutate(
        {
          itemId: cartItem.id,
        },
        {
          onError: () => {
            // Rollback on failure
            rollbackCart(previousCartState);
            console.error("Failed to remove item. Changes have been reverted.");
          },
        },
      );
    } else {
      // Decrease quantity by 1
      const { previousCartState } = optimisticallyUpdateQuantity(
        cartItem.id,
        newQuantity,
      );

      updateQuantityMutation.mutate(
        {
          itemId: cartItem.id,
          quantity: newQuantity,
        },
        {
          onError: () => {
            // Rollback on failure
            rollbackCart(previousCartState);
            console.error(
              "Failed to update quantity. Changes have been reverted.",
            );
          },
        },
      );
    }
  };

  const isLoading =
    updateQuantityMutation.isPending || removeItemMutation.isPending;

  return (
    <div className="flex items-center justify-between gap-2">
      <Button size="icon" onClick={handleDecreaseQuantity}>
        <MinusIcon />
      </Button>
      <span>{cartItem.quantity}</span>
      <Button size="icon" onClick={handleAddItem}>
        <PlusIcon />
      </Button>
    </div>
  );
};
