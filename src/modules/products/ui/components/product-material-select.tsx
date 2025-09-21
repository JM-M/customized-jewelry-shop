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
        const formattedName = capitalize(material.name.replace("_", " "));
        return (
          <Badge
            key={material.id}
            variant="outline"
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-2 px-3 py-2 transition-colors hover:opacity-80",
              { "border-primary": selectedMaterial === material.id },
            )}
            onClick={() => onMaterialChange(productMaterial.material.id)}
          >
            <div
              className="h-4 w-4 rounded-full border border-white/20"
              style={{ backgroundColor: material.hexColor }}
            />
            {formattedName}
          </Badge>
        );
      })}
    </div>
  );
};
