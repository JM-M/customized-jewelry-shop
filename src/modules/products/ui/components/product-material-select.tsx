"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GetMaterialsByProductIdOutput } from "@/modules/products/types";
import { capitalize } from "lodash-es";

interface ProductMaterialSelectProps {
  productMaterials: GetMaterialsByProductIdOutput;
  selectedMaterial: string | null;
  onMaterialChange: (material: string | null) => void;
}

export const ProductMaterialSelect = ({
  productMaterials,
  selectedMaterial,
  onMaterialChange,
}: ProductMaterialSelectProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-3">
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
              "flex min-w-20 cursor-pointer flex-col items-center justify-center gap-1.5 border-2 px-3 py-2 transition-colors hover:opacity-80",
              { "border-primary": selectedMaterial === material.id },
            )}
            onClick={() => onMaterialChange(productMaterial.material.id)}
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
  );
};
