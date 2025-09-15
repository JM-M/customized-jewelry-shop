"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

const materials = [
  {
    name: "Gold",
    hex: "#FFD700",
  },
  {
    name: "Silver",
    hex: "#C0C0C0",
  },
  {
    name: "Rose Gold",
    hex: "#D4AF36",
  },
];

export const ProductMaterialSelect = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {materials.map((material) => (
        <div
          key={material.name}
          className={cn(
            "flex cursor-pointer items-center gap-1 rounded-md border p-2 text-sm transition-colors",
            {
              "border-primary bg-primary/1": selectedMaterial === material.name,
              "border-transparent hover:border-gray-300":
                selectedMaterial !== material.name,
            },
          )}
          onClick={() => setSelectedMaterial(material.name)}
        >
          <div
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: material.hex }}
          />
          {material.name}
        </div>
      ))}
    </div>
  );
};
