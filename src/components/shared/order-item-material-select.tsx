"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GetProductMaterialsOutput } from "@/modules/products/types";
import { capitalize } from "lodash-es";

interface OrderItemMaterialSelectProps {
  productMaterials: GetProductMaterialsOutput;
  selectedMaterialId: string | null;
  onMaterialChange: (materialId: string | null) => void;
  className?: string;
}

export const OrderItemMaterialSelect = ({
  productMaterials,
  selectedMaterialId,
  onMaterialChange,
  className = "",
}: OrderItemMaterialSelectProps) => {
  if (productMaterials.length === 0) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        No materials available for this product.
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Material
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {productMaterials.map((productMaterial) => {
          const { material } = productMaterial;
          const formattedName = material.name
            .replaceAll("_", " ")
            .split(" ")
            .map(capitalize)
            .join(" ");
          return (
            <Badge
              key={material.id}
              variant="outline"
              className={cn(
                "flex w-full min-w-20 cursor-pointer flex-col items-center justify-center gap-1.5 border-2 px-3 py-2 transition-colors hover:opacity-80",
                { "border-primary": selectedMaterialId === material.id },
              )}
              onClick={() => onMaterialChange(material.id)}
            >
              <div
                className="size-6 rounded-full border border-white/20"
                style={{ backgroundColor: material.hexColor }}
              />
              {formattedName}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};
