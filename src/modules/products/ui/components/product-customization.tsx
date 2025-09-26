"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useProduct } from "../../contexts/product";
import { ProductCustomizationOptions } from "./product-customization-options";
import { ProductMaterialSelect } from "./product-material-select";

export const ProductCustomization = () => {
  const {
    productMaterials,
    customizationOptions,
    selectedMaterial,
    customizations,
    setSelectedMaterial,
    updateCustomization,
  } = useProduct();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-y">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <span>Customize Your Jewelry</span>
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
              <ProductMaterialSelect
                productMaterials={productMaterials}
                selectedMaterial={selectedMaterial}
                onMaterialChange={setSelectedMaterial}
              />
            </div>

            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Customization Options
              </h4>
              <ProductCustomizationOptions
                customizationOptions={customizationOptions}
                customizations={customizations}
                onCustomizationChange={updateCustomization}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
