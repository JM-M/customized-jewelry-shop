"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  GetEngravingAreasByProductIdOutput,
  GetMaterialsByProductIdOutput,
} from "@/modules/products/types";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { ProductEngraving } from "./product-engraving";
import { ProductMaterialSelect } from "./product-material-select";

interface ProductCustomizationProps {
  productMaterials: GetMaterialsByProductIdOutput;
  productEngravingAreas: GetEngravingAreasByProductIdOutput;
}

export const ProductCustomization = ({
  productMaterials,
  productEngravingAreas,
}: ProductCustomizationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-y">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <span className="font-medium">Customize Your Jewelry</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md bg-gray-50/50 dark:bg-gray-800/30">
          <div className="space-y-6 px-3">
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Material
              </h4>
              <ProductMaterialSelect productMaterials={productMaterials} />
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Engraving
              </h4>
              <ProductEngraving productEngravingAreas={productEngravingAreas} />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
