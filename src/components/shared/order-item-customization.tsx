"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  CustomizationContent,
  CustomizationOption,
} from "@/modules/products/types";
import { Dropzone } from "./dropzone";

interface OrderItemCustomizationProps {
  customizationOptions: CustomizationOption[];
  customizations: Record<string, CustomizationContent>;
  onCustomizationChange: (
    optionId: string,
    content: CustomizationContent,
  ) => void;
  title?: string;
  defaultOpen?: boolean;
  className?: string;
}

export const OrderItemCustomization = ({
  customizationOptions,
  customizations,
  onCustomizationChange,
  title = "Customize Your Jewelry",
  defaultOpen = true,
  className = "",
}: OrderItemCustomizationProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (customizationOptions.length === 0) {
    return (
      <div className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
        No customization options available for this product.
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`border-y ${className}`}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <span>{title}</span>
        <ChevronDownIcon
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-6 rounded-md bg-gray-50/50 px-3 dark:bg-gray-800/30">
          <div className="space-y-4">
            {customizationOptions.map((option) => (
              <div key={option.id} className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {option.name}
                </label>
                {option.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                )}

                {option.type === "text" && (
                  <Input
                    type="text"
                    placeholder="Enter text..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    value={customizations[option.id]?.textContent || ""}
                    onChange={(e) =>
                      onCustomizationChange(option.id, {
                        id: option.id,
                        type: "text",
                        textContent: e.target.value,
                      })
                    }
                  />
                )}

                {option.type === "image" && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <Dropzone
                      id={`image-upload-${option.id}`}
                      accept="image/*"
                    />
                  </div>
                )}

                {option.type === "qr_code" && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    QR code generation functionality to be implemented
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
