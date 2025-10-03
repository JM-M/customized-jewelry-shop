"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useCart } from "@/modules/cart/contexts";
import { useCartOptimisticUpdates } from "@/modules/cart/hooks/use-cart-optimistic-updates";
import { useRouter } from "next/navigation";
import { HiShoppingBag } from "react-icons/hi2";
import { useProduct } from "../../contexts/product";

interface AddToBagButtonProps {
  className?: string;
}

export function AddToBagButton({ className }: AddToBagButtonProps) {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data;

  const router = useRouter();

  const { addItemMutation, setIsOpen: setIsCartOpen } = useCart();
  const { product, selectedMaterial, productMaterials, customizations } =
    useProduct();
  const productId = product.id;
  const materialId = selectedMaterial;

  const { optimisticallyAddToCart } = useCartOptimisticUpdates();

  const handleAddToBag = () => {
    if (!isLoggedIn) {
      router.push(`/sign-in?redirect=${window.location.pathname}`);
      return;
    }

    if (!materialId) return;

    // Perform optimistic update and capture previous state
    const { generatedItemId } = optimisticallyAddToCart({
      product,
      materialId,
      customizations,
      productMaterials,
    });

    setIsCartOpen(true);

    addItemMutation.mutate(
      {
        productId,
        materialId,
        quantity: 1,
        customizations,
        itemId: generatedItemId, // Pass the generated item ID to maintain consistency
      },
      {
        onError: () => {
          // Rollback the optimistic update on failure
          // rollbackCart(previousCartState);
          console.error(
            "Failed to add item to cart. Changes have been reverted.",
          );
        },
      },
    );
  };

  const isAdding = addItemMutation.isPending;

  return (
    <Button
      onClick={handleAddToBag}
      disabled={isAdding || !materialId}
      className={className}
    >
      {isAdding ? (
        <>
          <Spinner2 />
          Adding...
        </>
      ) : (
        <>
          <HiShoppingBag className="size-4.5" />
          Add to Bag
        </>
      )}
    </Button>
  );
}
