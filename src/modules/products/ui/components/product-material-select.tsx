"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { GetMaterialsByProductIdOutput } from "@/modules/products/types";
import { useState } from "react";

interface ProductMaterialSelectProps {
  productMaterials: GetMaterialsByProductIdOutput;
}

export const ProductMaterialSelect = ({
  productMaterials,
}: ProductMaterialSelectProps) => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap gap-2 p-3">
      {productMaterials.map((productMaterial) => {
        const { material } = productMaterial;
        return (
          <Badge
            key={material.name}
            variant="outline"
            className={cn(
              "flex cursor-pointer items-center gap-1.5 px-3 py-2 transition-colors hover:opacity-80",
              { "border-primary border-2": selectedMaterial === material.name },
            )}
            onClick={() => setSelectedMaterial(productMaterial.material.name)}
          >
            <div
              className="h-4 w-4 rounded-full border border-white/20"
              style={{ backgroundColor: material.hexColor }}
            />
            {material.name}
          </Badge>
        );
      })}
    </div>
  );
};
