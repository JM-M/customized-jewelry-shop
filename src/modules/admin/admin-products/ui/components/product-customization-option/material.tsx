import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useAdminProduct } from "../../../contexts/admin-product";

export const Material = () => {
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<Set<string>>(
    new Set(),
  );
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  const { productMaterials, product } = useAdminProduct();

  const queryClient = useQueryClient();

  const trpc = useTRPC();
  const { data: materials, isLoading } = useQuery(
    trpc.adminProducts.getAllMaterials.queryOptions(),
  );

  const {
    mutate: updateProductMaterials,
    isPending,
    error,
  } = useMutation(trpc.adminProducts.updateProductMaterials.mutationOptions());

  // Initialize selected materials from current product materials
  useEffect(() => {
    if (productMaterials) {
      const materialIds = new Set(productMaterials.map((pm) => pm.material.id));
      setSelectedMaterialIds(materialIds);
      // Enable switch if there are materials, disable if none
      setIsEnabled(materialIds.size > 0);
    }
  }, [productMaterials]);

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterialIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(materialId)) {
        newSet.delete(materialId);
      } else {
        newSet.add(materialId);
      }
      return newSet;
    });
  };

  const handleSwitchToggle = (checked: boolean) => {
    setIsEnabled(checked);
    // Don't clear selected materials when switch is turned off
    // This preserves the selection when toggling back on
  };

  const handleSave = () => {
    if (!product) return;

    const queryOptions =
      trpc.products.getProductMaterialsByProductId.queryOptions({
        productId: product.id,
      });

    // If switch is off, send empty array to remove all materials
    const materialIdsToSave = isEnabled ? Array.from(selectedMaterialIds) : [];

    updateProductMaterials(
      {
        productId: product.id,
        materialIds: materialIdsToSave,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(queryOptions);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Spinner className="size-4" /> Loading...
      </div>
    );
  }

  if (!materials) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>No materials found</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p>Product not found</p>
      </div>
    );
  }

  const hasChanges = () => {
    if (!productMaterials) return false;
    const currentMaterialIds = new Set(
      productMaterials.map((pm) => pm.material.id),
    );

    // If switch is off, check if there are any materials to remove
    if (!isEnabled) {
      return currentMaterialIds.size > 0;
    }

    // If switch is on, check if selected materials differ from current
    if (currentMaterialIds.size !== selectedMaterialIds.size) return true;

    for (const id of currentMaterialIds) {
      if (!selectedMaterialIds.has(id)) return true;
    }

    for (const id of selectedMaterialIds) {
      if (!currentMaterialIds.has(id)) return true;
    }

    return false;
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor="material">Material</Label>
        <Switch
          id="material"
          checked={isEnabled}
          onCheckedChange={handleSwitchToggle}
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-600">
          Error saving materials. Please try again.
        </div>
      )}
      {isEnabled && (
        <div className="mt-2 grid grid-cols-3 gap-2 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6">
          {materials.map((material, index) => {
            const { displayName, hexColor } = material;
            const isSelected = selectedMaterialIds.has(material.id);

            return (
              <div
                key={index}
                className={cn(
                  "relative flex h-full cursor-pointer flex-col items-center gap-2 border p-3 text-center text-sm transition-colors hover:bg-gray-50",
                  {
                    "border-primary": isSelected,
                  },
                )}
                onClick={() => toggleMaterial(material.id)}
              >
                {isSelected && (
                  <CheckIcon className="absolute top-2 right-2 size-4" />
                )}
                <span
                  className="m-auto block size-4 rounded-full"
                  style={{ backgroundColor: hexColor }}
                />
                {displayName}
              </div>
            );
          })}
        </div>
      )}
      {hasChanges() && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} disabled={isPending} size="sm">
            {isPending ? (
              <>
                <Spinner className="size-4" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
