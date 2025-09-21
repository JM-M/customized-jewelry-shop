"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/contexts";
import { useCartOptimisticUpdates } from "@/modules/cart/hooks/use-cart-optimistic-updates";
import { useProduct } from "../../contexts/product";

interface AddToBagButtonProps {
  className?: string;
}

export function AddToBagButton({ className }: AddToBagButtonProps) {
  const { addItemMutation, updateCartOptimistically } = useCart();
  const { product, selectedMaterial, productMaterials, engravings } =
    useProduct();
  const productId = product.id;
  const materialId = selectedMaterial;

  const { optimisticallyAddToCart, rollbackCart } = useCartOptimisticUpdates();

  const handleAddToBag = () => {
    if (!materialId) return;

    // Perform optimistic update and capture previous state
    const { previousCartState, generatedItemId } = optimisticallyAddToCart({
      product,
      materialId,
      engravings,
      productMaterials,
    });

    addItemMutation.mutate(
      {
        productId,
        materialId,
        quantity: 1,
        itemId: generatedItemId, // Pass the generated item ID to maintain consistency
      },
      {
        onError: () => {
          // Rollback the optimistic update on failure
          rollbackCart(previousCartState);
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
        "Add to Bag"
      )}
    </Button>
  );
}
