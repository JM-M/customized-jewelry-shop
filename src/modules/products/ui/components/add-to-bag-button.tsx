"use client";

import { Spinner2 } from "@/components/shared/spinner-2";
import { Button } from "@/components/ui/button";
import { useCart } from "@/modules/cart/contexts";
import { useProduct } from "../../contexts/product";

interface AddToBagButtonProps {
  disabled?: boolean;
  className?: string;
}

export function AddToBagButton({
  disabled = false,
  className,
}: AddToBagButtonProps) {
  const { product, selectedMaterial } = useProduct();
  const productId = product.id;
  const materialId = selectedMaterial;
  const { addItemMutation } = useCart();

  const handleAddToBag = () => {
    addItemMutation.mutate({
      productId,
      materialId,
      quantity: 1,
    });
  };

  const isAdding = addItemMutation.isPending;

  return (
    <Button
      onClick={handleAddToBag}
      disabled={disabled || isAdding}
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
