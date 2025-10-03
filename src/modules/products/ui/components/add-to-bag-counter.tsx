import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentProps } from "react";
import { useCart } from "../../../cart/contexts";
import { useCartOptimisticUpdates } from "../../../cart/hooks/use-cart-optimistic-updates";
import { CartItem } from "../../../cart/types";

interface AddToBagCounterProps {
  cartItem: CartItem;
  buttonProps?: ComponentProps<typeof Button>;
}
export const AddToBagCounter = ({
  cartItem,
  buttonProps,
}: AddToBagCounterProps) => {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data;

  const router = useRouter();

  const { updateQuantityMutation, removeItemMutation } = useCart();
  const { optimisticallyUpdateQuantity, optimisticallyRemoveFromCart } =
    useCartOptimisticUpdates();

  const handleAddItem = () => {
    if (!isLoggedIn) {
      router.push(`/sign-in?redirect=${window.location.pathname}`);
      return;
    }

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
          // rollbackCart(previousCartState);
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
            // rollbackCart(previousCartState);
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
            // rollbackCart(previousCartState);
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
      <Button
        size="icon"
        onClick={handleDecreaseQuantity}
        {...buttonProps}
      >
        <MinusIcon />
      </Button>
      <span>{cartItem.quantity}</span>
      <Button size="icon" onClick={handleAddItem} {...buttonProps}>
        <PlusIcon />
      </Button>
    </div>
  );
};
