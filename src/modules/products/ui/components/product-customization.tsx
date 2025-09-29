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

export const ProductCustomization = () => {
  const { customizationOptions, customizations, updateCustomization } =
    useProduct();
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
        <div className="space-y-4">
          <ProductCustomizationOptions
            customizationOptions={customizationOptions}
            customizations={customizations}
            onCustomizationChange={updateCustomization}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
