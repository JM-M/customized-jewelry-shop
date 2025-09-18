"use client";

import { Badge } from "@/components/ui/badge";
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
    <div className="flex flex-wrap gap-2 p-3">
      {materials.map((material) => (
        <Badge
          key={material.name}
          variant={selectedMaterial === material.name ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors hover:opacity-80",
            "flex items-center gap-1.5 px-3 py-2",
          )}
          onClick={() => setSelectedMaterial(material.name)}
        >
          <div
            className="h-3 w-3 rounded-full border border-white/20"
            style={{ backgroundColor: material.hex }}
          />
          {material.name}
        </Badge>
      ))}
    </div>
  );
};
