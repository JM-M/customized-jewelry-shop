"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const ProductMaterialSelect = () => {
  const { productId } = useParams();

  const trpc = useTRPC();
  const { data: materials } = useSuspenseQuery(
    trpc.products.getMaterialsByProductId.queryOptions({
      productId: productId as string,
    }),
  );

  console.log(materials);

  return (
    <div className="flex flex-wrap gap-2 p-3">
      {/* {materials.map((material) => (
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
      ))} */}
    </div>
  );
};
